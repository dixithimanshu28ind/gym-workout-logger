import { after, NextResponse } from "next/server";

import { requireFeatureForApi } from "@/lib/features";
import { INTEREST_NOTICE_VERSION, isTestEmail, parseInterest, type InterestInput } from "@/lib/interest";
import { sendInterestEmail } from "@/lib/interestEmail";
import { getPayloadClient } from "@/lib/payloadClient";

/**
 * "Register your interest" (GYM-47). Public, no login. Exists while the
 * `custom_programs` flag is Coming soon or Live; a 404 when Off.
 *
 * Order matters: the entry is SAVED first, and the copy to support is sent
 * afterwards (after the response), so a mail problem can never lose or slow an
 * entry. The outcome is written back to the entry as `emailStatus`.
 *
 * Abuse: JSON only (a cross-site form cannot post it), a size cap, strict
 * validation, a hidden honeypot field, one entry per email and offering, and a
 * cap on how many emails go to support in an hour.
 */
export const dynamic = "force-dynamic";

const MAX_BODY_CHARS = 10_000;
/** Entries beyond this per hour are saved but not emailed, so a bot cannot flood the inbox. */
const EMAILS_PER_HOUR = 30;

const ok = () => NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
const fail = (status: number, error: string) =>
  NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const blocked = await requireFeatureForApi("custom_programs", "coming_soon");
  if (blocked) return blocked;

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return fail(415, "Something went wrong. Please try again.");
  }
  const text = await req.text();
  if (text.length > MAX_BODY_CHARS) return fail(413, "That is too long. Please shorten your comments.");

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return fail(400, "Something went wrong. Please try again.");
  }

  const parsed = parseInterest(body);
  // A bot gets the same answer as a person, and nothing is stored.
  if (parsed.kind === "bot") return ok();
  if (parsed.kind === "invalid") return fail(400, parsed.error);
  const entry = parsed.value;

  try {
    const payload = await getPayloadClient();

    // One entry per email and offering. Registering again just refreshes the comment.
    const existing = await payload.find({
      collection: "interest-registrations",
      where: { and: [{ email: { equals: entry.email } }, { interest: { equals: entry.interest } }] },
      limit: 1,
      depth: 0,
    });
    const previous = existing.docs[0];
    if (previous) {
      if (entry.message !== "" && entry.message !== previous.message) {
        await payload.update({ collection: "interest-registrations", id: previous.id, data: { message: entry.message } });
      }
      return ok();
    }

    const test = isTestEmail(entry.email);
    const created = await payload.create({
      collection: "interest-registrations",
      data: {
        ...entry,
        noticeVersion: INTEREST_NOTICE_VERSION,
        emailStatus: test ? "skipped_test" : "pending",
      },
    });

    // Test entries (from the e2e suite) are saved but never emailed.
    if (!test) after(() => notifySupport(created.id, entry, new Date(created.createdAt)));

    return ok();
  } catch (err) {
    console.error("[interest] could not save an entry:", err instanceof Error ? err.message : err);
    return fail(500, "We couldn't save that just now. Please try again.");
  }
}

async function notifySupport(id: number, entry: InterestInput, registeredAt: Date) {
  try {
    const payload = await getPayloadClient();

    // Real entries in the last hour, this one included.
    const recent = await payload.count({
      collection: "interest-registrations",
      where: {
        and: [
          { createdAt: { greater_than: new Date(Date.now() - 60 * 60 * 1000).toISOString() } },
          { emailStatus: { not_equals: "skipped_test" } },
        ],
      },
    });
    const emailStatus = recent.totalDocs > EMAILS_PER_HOUR ? "skipped_cap" : await sendInterestEmail(entry, registeredAt);

    await payload.update({ collection: "interest-registrations", id, data: { emailStatus } });
  } catch (err) {
    console.error("[interest] could not finish the email step:", err instanceof Error ? err.message : err);
  }
}
