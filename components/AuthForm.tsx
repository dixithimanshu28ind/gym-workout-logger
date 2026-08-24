"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface AuthFormProps {
  mode: "signup" | "signin";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

    setSubmitting(true);

    if (mode === "signup") {
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
        router.push("/dashboard");
        return;
      }

      setInfo(
        "Account created. Check your email to confirm your address, then sign in."
      );
      setSubmitting(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
  };

  const isSignUp = mode === "signup";

  return (
    <div className="max-w-sm w-full mx-auto space-y-6">
      <h1 className="font-display text-2xl tracking-wide text-center">
        {isSignUp ? "Create your account" : "Sign in"}
      </h1>

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
          {submitting ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-center text-neutral-600">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/signin" className="underline font-medium">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline font-medium">
              Sign up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
