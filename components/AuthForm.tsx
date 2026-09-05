"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface AuthFormProps {
  mode: "signup" | "signin";
  onSuccess?: (userId: string) => void;
  onSwitchMode?: (mode: "signup" | "signin") => void;
}

export default function AuthForm({ mode, onSuccess, onSwitchMode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === "signup";

  const handleSuccess = (userId: string) => {
    if (onSuccess) {
      onSuccess(userId);
      return;
    }
    router.push("/dashboard");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    if (isSignUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setSubmitting(false);
        return;
      }

      if (data.session) {
        handleSuccess(data.session.user.id);
        return;
      }

      setInfo(
        "Account created. Check your email to confirm your address, then sign in."
      );
      setSubmitting(false);
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }

    handleSuccess(data.user.id);
  };

  return (
    <div className="max-w-sm w-full mx-auto space-y-6">
      <div className="text-center">
        <h1 className="font-display text-2xl tracking-wide">
          {isSignUp ? "Start training" : "Welcome back"}
        </h1>
        {isSignUp && (
          <p className="mt-1 text-sm text-neutral-500">Create your Log &amp; Train account.</p>
        )}
      </div>

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

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
        </div>

        {isSignUp && (
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
        )}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {info && (
          <p className="text-sm text-green-700" role="status">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent text-accent-foreground font-medium py-2.5 hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-center text-neutral-600">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            {onSwitchMode ? (
              <button
                type="button"
                onClick={() => onSwitchMode("signin")}
                className="underline font-medium"
              >
                Sign in
              </button>
            ) : (
              <Link href="/signin" className="underline font-medium">
                Sign in
              </Link>
            )}
          </>
        ) : (
          <>
            New to Log &amp; Train?{" "}
            {onSwitchMode ? (
              <button
                type="button"
                onClick={() => onSwitchMode("signup")}
                className="underline font-medium"
              >
                Create an account
              </button>
            ) : (
              <Link href="/signup" className="underline font-medium">
                Create an account
              </Link>
            )}
          </>
        )}
      </p>
    </div>
  );
}
