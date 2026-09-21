"use client";

import { FormEvent, useId, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";
import { INTEREST_KEYS, INTEREST_MESSAGE_MAX, type InterestKey } from "@/lib/interest";

const INPUT =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent";

/**
 * The "Register your interest" form (GYM-47), shown inside a modal. No login: a
 * visitor gives an email and, if they like, says what they would want, then
 * leaves. Signed-in visitors get their email filled in.
 *
 * Generic over the offering (`interest`), so the Diet program and Community can
 * reuse it. Posts to /api/interest, which saves the entry first and emails
 * support afterwards.
 */
export default function InterestForm({ interest, onClose }: { interest: InterestKey; onClose: () => void }) {
  const { user } = useAuth();
  const id = useId();
  const label = INTEREST_KEYS[interest].label;

  // null until the visitor types, so a signed-in visitor's email shows without an effect.
  const [typedEmail, setTypedEmail] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: real visitors never see it
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const email = typedEmail ?? user?.email ?? "";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interest, email, message, website }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "We couldn't save that just now. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-display text-2xl tracking-wide">Thanks, you&apos;re on the list.</h1>
        <p className="text-sm text-neutral-600">We&apos;ll email you when the {label} is ready.</p>
        <Link href="/programs" onClick={onClose} className="inline-block text-sm font-medium text-accent hover:underline">
          Explore Free Programs →
        </Link>
        <div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium hover:bg-background"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="font-display text-2xl tracking-wide">Register your interest</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Tell us what you&apos;d want from a {label}. We&apos;ll email you when it&apos;s ready.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor={`${id}-email`} className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id={`${id}-email`}
            type="email"
            value={email}
            onChange={(e) => setTypedEmail(e.target.value)}
            className={INPUT}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor={`${id}-message`} className="mb-1 block text-sm font-medium">
            What would you want from it? <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <textarea
            id={`${id}-message`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={INTEREST_MESSAGE_MAX}
            rows={4}
            placeholder="For example: my goal, how many days I can train, the equipment I have..."
            className={INPUT}
          />
        </div>

        {/* Honeypot. Hidden from people and screen readers; bots that fill every field give themselves away. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-accent py-2.5 font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Register interest"}
        </button>

        <p className="text-center text-xs text-neutral-500">
          We&apos;ll only use your email to tell you when this launches.{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
        </p>
      </form>
    </div>
  );
}
