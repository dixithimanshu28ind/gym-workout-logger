"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWorkoutSummaries } from "@/lib/workouts";
import { computeCurrentStreak } from "@/lib/streak";
import type { WorkoutSummary } from "@/lib/types";
import WorkoutSummaryCard from "@/components/WorkoutSummaryCard";
import AppShell from "@/components/AppShell";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkouts = useCallback(async (userId: string) => {
    setLoadingWorkouts(true);
    setError(null);
    try {
      const data = await fetchWorkoutSummaries(userId);
      setWorkouts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load workouts.");
    } finally {
      setLoadingWorkouts(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
      return;
    }
    if (user) {
      loadWorkouts(user.id);
    }
  }, [user, loading, router, loadWorkouts]);

  if (loading || !user) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </main>
    );
  }

  const streak = computeCurrentStreak(workouts.map((w) => w.date));

  return (
    <AppShell
      title="Your Workouts"
      actions={
        <Link
          href="/workout/new"
          className="rounded-lg bg-accent text-accent-foreground text-sm font-medium px-4 py-2 hover:opacity-90 transition"
        >
          + Log New Workout
        </Link>
      }
    >
      <div className="rounded-2xl bg-sidebar text-sidebar-foreground p-6 flex items-center gap-4">
        <span className="text-4xl" aria-hidden>
          🔥
        </span>
        <div>
          <p className="font-display text-3xl tracking-wide">
            {streak} day{streak === 1 ? "" : "s"}
          </p>
          <p className="text-sm text-sidebar-foreground-muted">Current streak</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {loadingWorkouts ? (
        <p className="text-neutral-500">Loading workouts...</p>
      ) : workouts.length === 0 ? (
        <p className="text-neutral-500 text-center py-8">
          No workouts logged yet. Log your first one above.
        </p>
      ) : (
        <div className="space-y-3">
          {workouts.map((w) => (
            <WorkoutSummaryCard key={w.id} workout={w} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
