/**
 * Sends the "someone registered their interest" email to support. Server-only.
 *
 * The mailbox is Zoho (support@logandtrain.com). It is configured entirely from
 * environment variables, so nothing secret is in the code:
 *
 *   SMTP_HOST   smtp.zoho.in (or smtp.zoho.com, depending on the Zoho data centre)
 *   SMTP_PORT   465 (the default here) or 587
 *   SMTP_USER   support@logandtrain.com
 *   SMTP_PASS   an app-specific password created in Zoho (not the login password)
 *   INTEREST_EMAIL_TO   who receives it; defaults to support@logandtrain.com
 *
 * With any of the first four missing nothing is sent and the entry is still
 * saved ("not_configured"), so the form works on previews and locally.
 *
 * It sends from the authenticated mailbox (Zoho refuses any other From address)
 * and sets Reply-To to the visitor, so replying goes straight to them.
 */
import nodemailer from "nodemailer";

import { buildInterestEmail, type InterestInput } from "@/lib/interest";

export type EmailOutcome = "sent" | "failed" | "not_configured";

function mailSettings() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT) || 465;
  return { host, port, user, pass, to: process.env.INTEREST_EMAIL_TO || "support@logandtrain.com" };
}

export async function sendInterestEmail(entry: InterestInput, registeredAt: Date): Promise<EmailOutcome> {
  const settings = mailSettings();
  if (!settings) return "not_configured";

  const mail = buildInterestEmail(entry, registeredAt);
  try {
    const transport = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.port === 465,
      auth: { user: settings.user, pass: settings.pass },
      // Short limits so a stuck mail server cannot hold the request open.
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 10_000,
    });
    await transport.sendMail({
      from: `"Log & Train" <${settings.user}>`,
      to: settings.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
    });
    return "sent";
  } catch (err) {
    // The message only: it can quote the server's reply, never the password.
    console.error("[interest] could not email support:", err instanceof Error ? err.message : err);
    return "failed";
  }
}
