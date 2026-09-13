"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    setSubmitting(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/reset-password` }
    );

    setSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="max-w-sm w-full mx-auto space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl tracking-wide">Reset your password</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <p className="text-sm text-center text-green-700" role="status">
            Check your email for a link to reset your password.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                autoComplete="email"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-accent text-accent-foreground font-medium py-2.5 hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Please wait..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-sm text-center text-neutral-600">
          <Link href="/signin" className="underline font-medium">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
