"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";

export default function HowItWorksHero() {
  const { user } = useAuth();
  const { openSignUp } = useAuthModal();
  const router = useRouter();

  return (
    <section className="mx-auto max-w-2xl px-6 py-16 text-center sm:py-24">
      <p className="text-sm font-semibold tracking-[0.2em] text-accent">HOW IT WORKS</p>
      <h1 className="mt-4 font-display text-4xl leading-[1.1] sm:text-5xl">
        Training shouldn&apos;t need instructions.
      </h1>
      <p className="mt-6 text-base text-neutral-600">
        Log &amp; Train keeps things simple: choose how you want to train, log what you do and
        keep moving forward.
      </p>
      <div className="mt-8 flex justify-center">
        {user ? (
          <button
            type="button"
            onClick={() => router.push("/workout/new")}
            className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition"
          >
            Log a Workout
          </button>
        ) : (
          <button
            type="button"
            onClick={() => openSignUp()}
            className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition"
          >
            Start Training
          </button>
        )}
      </div>
    </section>
  );
}
