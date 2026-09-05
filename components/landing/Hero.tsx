"use client";

import Link from "next/link";
import { useAuthModal } from "@/contexts/AuthModalContext";

function MiniSetRow({ label, weight, reps }: { label: string; weight: string; reps: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
      <span className="w-8 shrink-0">{label}</span>
      <span className="rounded border border-neutral-200 px-1.5 py-0.5">{weight}</span>
      <span className="rounded border border-neutral-200 px-1.5 py-0.5">{reps}</span>
    </div>
  );
}

/** AC6: coded mock-ups of real product screens, not a screenshot or stock imagery — see Hero's design note. */
function ProductVisual() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-md sm:h-[460px]">
      {/* Dashboard — back-left */}
      <div className="absolute left-0 top-0 w-44 -rotate-6 rounded-xl border border-card-border bg-card p-3 shadow-lg sm:w-48">
        <p className="text-[11px] font-medium text-neutral-500">Current Streak</p>
        <p className="mt-1 font-display text-xl">🔥 12 days</p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100">
          <div className="h-1.5 w-4/5 rounded-full bg-accent" />
        </div>
        <p className="mt-1.5 text-[10px] text-neutral-500">Push · Pull · Legs this week</p>
      </div>

      {/* Programs — back-right */}
      <div className="absolute right-0 top-10 w-40 rotate-6 rounded-xl border border-card-border bg-card p-3 shadow-lg sm:w-44">
        <p className="text-[11px] font-medium text-neutral-500">Full Body + Conditioning</p>
        <p className="mt-1 font-display text-base">Up next: Pull</p>
        <p className="mt-1 text-[10px] text-neutral-500">Day 2 of your program</p>
      </div>

      {/* Log Workout — front and center */}
      <div className="absolute inset-x-4 bottom-0 rounded-xl border border-card-border bg-card p-4 shadow-xl sm:inset-x-8">
        <div className="flex items-center justify-between">
          <p className="font-display text-base">Push</p>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
            Log Workout
          </span>
        </div>
        <div className="mt-3 space-y-2">
          <div className="rounded-lg border border-neutral-200 p-2">
            <p className="text-xs font-medium">Barbell Bench Press</p>
            <div className="mt-1.5 space-y-1">
              <MiniSetRow label="Set 1" weight="60 kg" reps="8" />
              <MiniSetRow label="Set 2" weight="60 kg" reps="8" />
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-accent py-2 text-center text-xs font-medium text-accent-foreground">
          Save Workouts
        </div>
      </div>

      {/* Floating status badges */}
      <div className="absolute -left-3 top-32 hidden rounded-full border border-card-border bg-background px-3 py-1.5 text-[11px] font-medium shadow-md sm:block">
        ✓ Push + Core completed
      </div>
      <div className="absolute left-1/2 top-52 hidden -translate-x-1/2 rounded-full border border-card-border bg-background px-3 py-1.5 text-[11px] font-medium shadow-md sm:block">
        💪 24 workouts logged
      </div>
      <div className="absolute right-2 top-40 hidden rounded-full bg-accent px-3 py-1.5 text-[11px] font-medium text-accent-foreground shadow-md sm:block">
        🏆 Longest streak: 18 days
      </div>
    </div>
  );
}

export default function Hero() {
  const { openSignUp, openSignIn } = useAuthModal();

  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
      <div>
        <p className="text-sm font-semibold tracking-[0.2em] text-accent">LOG. TRAIN. CONNECT.</p>
        <h1 className="mt-4 font-display text-4xl leading-[1.1] sm:text-5xl">
          Train your way.
          <br />
          Track your progress.
        </h1>
        <p className="mt-6 max-w-md text-base text-neutral-600">
          Log your workouts, follow a structured program when you want one, and keep moving
          forward even when training doesn&apos;t go exactly to plan.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => openSignUp()}
            className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition"
          >
            Start Training
          </button>
          <Link
            href="/programs"
            className="rounded-lg border border-card-border px-6 py-3 text-sm font-medium hover:bg-card transition"
          >
            Explore Programs
          </Link>
        </div>
        <p className="mt-4 text-sm text-neutral-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => openSignIn()}
            className="font-medium text-accent hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>

      <ProductVisual />
    </section>
  );
}
