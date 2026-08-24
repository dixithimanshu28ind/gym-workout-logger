"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWorkoutSummaries } from "@/lib/workouts";
import type { WorkoutSummary } from "@/lib/types";
import WorkoutSummaryCard from "@/components/WorkoutSummaryCard";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
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

  return (
    <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Workouts</h1>
        <button
          onClick={() => signOut()}
          className="text-sm text-neutral-600 hover:underline"
        >
          Sign Out
        </button>
      </div>

      <Link
        href="/workout/new"
        className="block text-center rounded-lg bg-neutral-900 text-white font-medium py-2.5 hover:bg-neutral-700 transition"
      >
        + Log New Workout
      </Link>

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
    </main>
  );
}
