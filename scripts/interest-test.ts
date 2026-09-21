/**
 * Tests for the pure "register your interest" rules in lib/interest.ts and the
 * flag-ordering helper `isAtLeast`. No database or mail server needed.
 * Run with: node ./node_modules/.bin/tsx scripts/interest-test.ts
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { isAtLeast } from "../lib/featureFlags";
import {
  buildInterestEmail,
  INTEREST_EMAIL_SUBJECT,
  INTEREST_MESSAGE_MAX,
  isTestEmail,
  parseInterest,
} from "../lib/interest";

const good = { interest: "custom-training-program", email: "Person@Example.com", message: "I train 3 days a week." };

test("a normal submission is accepted, with the email lower-cased and trimmed", () => {
  const r = parseInterest({ ...good, email: "  Person@Example.com  " });
  assert.equal(r.kind, "ok");
  if (r.kind === "ok") {
    assert.equal(r.value.email, "person@example.com");
    assert.equal(r.value.message, "I train 3 days a week.");
    assert.equal(r.value.interest, "custom-training-program");
  }
});

test("comments are optional", () => {
  for (const message of [undefined, null, "", "   "]) {
    const r = parseInterest({ ...good, message });
    assert.equal(r.kind, "ok");
    if (r.kind === "ok") assert.equal(r.value.message, "");
  }
});

test("EMAIL: bad addresses are refused", () => {
  for (const email of ["", "nope", "a@b", "a@b.c", "a b@c.com", "a@b.com,c@d.com", "a@b.com;c@d.com", "<a@b.com>", '"a"@b.com', "a@b.com\nBcc: x@y.com", "a@@b.com", "@b.com", "a@.com"]) {
    assert.equal(parseInterest({ ...good, email }).kind, "invalid", JSON.stringify(email));
  }
  for (const email of [undefined, null, 5, {}, []]) assert.equal(parseInterest({ ...good, email }).kind, "invalid");
});

test("EMAIL: too long is refused", () => {
  assert.equal(parseInterest({ ...good, email: `${"a".repeat(250)}@b.com` }).kind, "invalid");
});

test("EMAIL: ordinary addresses with + . _ ' - are accepted", () => {
  for (const email of ["first.last+tag@example.co.in", "o'brien@example.com", "a_b-c@sub.example.org"]) {
    assert.equal(parseInterest({ ...good, email }).kind, "ok", email);
  }
});

test("HONEYPOT: a filled hidden field is a bot, and stores nothing", () => {
  assert.deepEqual(parseInterest({ ...good, website: "http://spam.example" }), { kind: "bot" });
  assert.deepEqual(parseInterest({ ...good, website: 42 }), { kind: "bot" });
  assert.equal(parseInterest({ ...good, website: "" }).kind, "ok");
  assert.equal(parseInterest({ ...good, website: "   " }).kind, "ok");
});

test("COMMENTS: up to the limit is fine, one over is refused; characters are counted as a person counts them", () => {
  assert.equal(parseInterest({ ...good, message: "a".repeat(INTEREST_MESSAGE_MAX) }).kind, "ok");
  assert.equal(parseInterest({ ...good, message: "a".repeat(INTEREST_MESSAGE_MAX + 1) }).kind, "invalid");
  // 1,000 emoji are 2,000 UTF-16 units but 1,000 characters.
  assert.equal(parseInterest({ ...good, message: "💪".repeat(INTEREST_MESSAGE_MAX) }).kind, "ok");
  assert.equal(parseInterest({ ...good, message: "💪".repeat(INTEREST_MESSAGE_MAX + 1) }).kind, "invalid");
});

test("COMMENTS: control characters are stripped, line breaks kept", () => {
  // Built from character codes so this file holds no invisible characters.
  const nul = String.fromCharCode(0);
  const bell = String.fromCharCode(7);
  const r = parseInterest({ ...good, message: `line one\r\nline two${nul}${bell} done\ttab` });
  assert.equal(r.kind, "ok");
  if (r.kind === "ok") assert.equal(r.value.message, "line one\nline two done\ttab");
});

test("an unknown offering, or a body that is not an object, is refused", () => {
  assert.equal(parseInterest({ ...good, interest: "something-else" }).kind, "invalid");
  assert.equal(parseInterest({ ...good, interest: "toString" }).kind, "invalid");
  assert.equal(parseInterest({ ...good, interest: undefined }).kind, "invalid");
  for (const body of [null, undefined, "text", 5, [], [good]]) assert.equal(parseInterest(body).kind, "invalid");
});

test("test addresses are recognised", () => {
  assert.equal(isTestEmail("e2e-123-abc@logandtrain-test.dev"), true);
  assert.equal(isTestEmail("someone@logandtrain-test.dev.evil.com"), false);
  assert.equal(isTestEmail("someone@evil-logandtrain-test.dev"), false);
  assert.equal(isTestEmail("real@example.com"), false);
});

test("the support email has the agreed subject, replies to the visitor, and keeps their words in the body only", () => {
  const mail = buildInterestEmail(
    { interest: "custom-training-program", email: "person@example.com", message: "Subject: hijack\nBcc: x@y.com" },
    new Date("2026-09-21T13:00:00Z")
  );
  assert.equal(mail.subject, INTEREST_EMAIL_SUBJECT);
  assert.equal(mail.subject, "custom plan query");
  assert.equal(mail.replyTo, "person@example.com");
  assert.match(mail.text, /Email: person@example\.com/);
  assert.match(mail.text, /Subject: hijack\nBcc: x@y\.com/); // in the body, harmless
  assert.doesNotMatch(mail.subject, /hijack/);
  assert.match(buildInterestEmail({ interest: "custom-training-program", email: "a@b.com", message: "" }, new Date()).text, /\(none\)/);
});

test("flag states are ordered off < coming_soon < live", () => {
  assert.equal(isAtLeast("off", "coming_soon"), false);
  assert.equal(isAtLeast("off", "live"), false);
  assert.equal(isAtLeast("coming_soon", "coming_soon"), true);
  assert.equal(isAtLeast("coming_soon", "live"), false);
  assert.equal(isAtLeast("live", "coming_soon"), true);
  assert.equal(isAtLeast("live", "live"), true);
});
