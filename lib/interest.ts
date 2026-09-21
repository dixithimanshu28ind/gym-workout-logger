/**
 * "Register your interest": the rules for what a submission may contain and how
 * it is turned into an email. Pure (no I/O), so it is tested directly in
 * scripts/interest-test.ts. Saving and sending are in app/(app)/api/interest.
 *
 * Why this exists: before building a paid feature (GYM-47), find out whether
 * anyone wants it. A visitor leaves an email and, if they like, a comment.
 */

export const INTEREST_KEYS = {
  "custom-training-program": { label: "Custom Training Program" },
} as const;

export type InterestKey = keyof typeof INTEREST_KEYS;

export const INTEREST_KEY_LIST = Object.keys(INTEREST_KEYS) as InterestKey[];

export const INTEREST_MESSAGE_MAX = 1000;
export const INTEREST_EMAIL_MAX = 254;

/** Shown to the visitor next to the form; stored with each entry so we know what they agreed to. */
export const INTEREST_NOTICE_VERSION = "2026-09-21";

/** Subject of the email that goes to support (as chosen by the product owner). */
export const INTEREST_EMAIL_SUBJECT = "custom plan query";

/** The e2e suite registers with this domain. Such entries are saved but never emailed. */
export const TEST_EMAIL_DOMAIN = "logandtrain-test.dev";

export type InterestInput = { interest: InterestKey; email: string; message: string };

export type InterestResult =
  | { kind: "ok"; value: InterestInput }
  /** The hidden field was filled in: a bot. Answer as if it worked; store nothing. */
  | { kind: "bot" }
  | { kind: "invalid"; error: string };

// One plain address. Deliberately strict: no spaces, commas, angle brackets or
// quotes, so the value can never become a list of recipients or inject anything
// into an email header when it is used as the Reply-To.
const EMAIL_PATTERN = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

/**
 * Drops control characters (character codes below 32 and 127), keeping tab and
 * newline. Done by code rather than with a pattern so the source file holds no
 * invisible characters.
 */
function stripControlChars(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code === 9 || code === 10 || (code >= 32 && code !== 127)) out += ch;
  }
  return out;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isTestEmail(email: string): boolean {
  return email.endsWith(`@${TEST_EMAIL_DOMAIN}`);
}

export function parseInterest(body: unknown): InterestResult {
  if (!isRecord(body)) return { kind: "invalid", error: "Something went wrong. Please try again." };

  // Real visitors never see this field (it is hidden from people and from
  // screen readers); bots that fill every field do.
  if (typeof body.website === "string" && body.website.trim() !== "") return { kind: "bot" };
  if (body.website !== undefined && typeof body.website !== "string") return { kind: "bot" };

  const interest = body.interest;
  if (typeof interest !== "string" || !Object.hasOwn(INTEREST_KEYS, interest)) {
    return { kind: "invalid", error: "Something went wrong. Please try again." };
  }

  if (typeof body.email !== "string") return { kind: "invalid", error: "Enter a valid email address." };
  const email = normalizeEmail(body.email);
  if (email.length > INTEREST_EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
    return { kind: "invalid", error: "Enter a valid email address." };
  }

  let message = "";
  if (body.message !== undefined && body.message !== null) {
    if (typeof body.message !== "string") return { kind: "invalid", error: "Something went wrong. Please try again." };
    message = stripControlChars(body.message.replace(/\r\n?/g, "\n")).trim();
    // Count characters as a person does, not UTF-16 units (an emoji is one).
    if ([...message].length > INTEREST_MESSAGE_MAX) {
      return {
        kind: "invalid",
        error: `Please keep your comments under ${INTEREST_MESSAGE_MAX.toLocaleString("en-US")} characters.`,
      };
    }
  }

  return { kind: "ok", value: { interest: interest as InterestKey, email, message } };
}

/** The email that goes to support. Plain text; the visitor's words are only ever in the body. */
export function buildInterestEmail(entry: InterestInput, registeredAt: Date) {
  const label = INTEREST_KEYS[entry.interest].label;
  const text = [
    `Someone registered their interest in the ${label}.`,
    "",
    `Email: ${entry.email}`,
    `Registered: ${registeredAt.toISOString()}`,
    "",
    "Comments:",
    entry.message === "" ? "(none)" : entry.message,
    "",
    "Reply to this email to answer them directly.",
  ].join("\n");

  return { subject: INTEREST_EMAIL_SUBJECT, text, replyTo: entry.email };
}
