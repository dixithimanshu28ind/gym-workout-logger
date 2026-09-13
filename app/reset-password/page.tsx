"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <p className="text-sm text-neutral-500">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-sm w-full mx-auto space-y-4 text-center">
          <h1 className="font-display text-2xl tracking-wide">Link expired</h1>
          <p className="text-sm text-neutral-500">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password" className="underline font-medium text-sm">
            Request a new link
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="max-w-sm w-full mx-auto space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl tracking-wide">Set a new password</h1>
        </div>

        {success ? (
          <p className="text-sm text-center text-green-700" role="status">
            Password updated. Redirecting...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                autoComplete="new-password"
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
              {submitting ? "Please wait..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
