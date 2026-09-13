"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";

function ProductVisual() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-md sm:h-[460px]">
      <div className="absolute left-0 top-0 w-44 -rotate-6 rounded-xl border border-card-border bg-card p-3 shadow-lg sm:w-48">
        <p className="text-[11px] font-medium text-neutral-500">This Week</p>
        <p className="mt-1 font-display text-xl">🔥 12 days</p>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {["✓", "✓", "–", "✓", "✓", "✓", "M"].map((mark, i) => (
            <span
              key={i}
              className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[7px] ${
                mark === "✓"
                  ? "bg-accent text-accent-foreground"
                  : mark === "–"
                    ? "border border-dashed border-neutral-300 text-neutral-400"
                    : "bg-neutral-100 text-neutral-300"
              }`}
            >
              {mark}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute right-0 top-10 w-40 rotate-6 rounded-xl border border-card-border bg-card p-3 shadow-lg sm:w-44">
        <p className="text-[11px] font-medium text-neutral-500">Full Body + Conditioning</p>
        <p className="mt-1 font-display text-base">Up next: Pull</p>
        <p className="mt-1 text-[10px] text-neutral-500">Day 2 of your program</p>
      </div>

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
            <div className="mt-1.5 flex gap-1.5 text-[11px] text-neutral-500">
              <span className="rounded border border-neutral-200 px-1.5 py-0.5">60 kg</span>
              <span className="rounded border border-neutral-200 px-1.5 py-0.5">8 reps</span>
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-accent py-2 text-center text-xs font-medium text-accent-foreground">
          Save Workouts
        </div>
      </div>
    </div>
  );
}

export default function FeaturesHero() {
  const { user } = useAuth();
  const { openSignUp } = useAuthModal();
  const router = useRouter();

  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
      <div>
        <p className="text-sm font-semibold tracking-[0.2em] text-accent">FEATURES</p>
        <h1 className="mt-4 font-display text-4xl leading-[1.1] sm:text-5xl">
          Everything you need to keep training.
        </h1>
        <p className="mt-6 max-w-md text-base text-neutral-600">
          Log your workouts, follow a structured program when you want one, and keep your
          training history in one place.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
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
          <Link
            href="/programs"
            className="rounded-lg border border-card-border px-6 py-3 text-sm font-medium hover:bg-card transition"
          >
            Explore Programs
          </Link>
        </div>
      </div>

      <ProductVisual />
    </section>
  );
}
