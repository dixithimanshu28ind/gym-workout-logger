"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWorkoutSummaries } from "@/lib/workouts";
import { fetchProfile } from "@/lib/profile";
import { getProgramById } from "@/lib/programs";
import { computeCurrentStreak, computeLongestStreak } from "@/lib/streak";
import type { WorkoutSummary } from "@/lib/types";
import WeeklyWorkoutHistory from "@/components/WeeklyWorkoutHistory";
import WeekAtAGlance from "@/components/WeekAtAGlance";
import AppShell from "@/components/AppShell";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadWorkouts = useCallback(async (userId: string) => {
    setLoadingWorkouts(true);
    setError(null);
    try {
      const [data, profile] = await Promise.all([
        fetchWorkoutSummaries(userId),
        fetchProfile(userId),
      ]);
      setWorkouts(data);
      setSelectedProgramId(profile?.selected_program_id ?? null);
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
  const longestStreak = computeLongestStreak(workouts.map((w) => w.date));
  const selectedProgram = getProgramById(selectedProgramId);
  const hasProgram = !!selectedProgram;
  const hasWorkouts = workouts.length > 0;

  const firstProgramDayKey = hasProgram
    ? workouts.reduce<string | null>((earliest, w) => {
        if (w.program_id !== selectedProgramId) return earliest;
        return !earliest || w.date < earliest ? w.date : earliest;
      }, null)
    : null;

  return (
    <AppShell
      title="My Workouts"
      actions={
        <Link
          href="/workout/new"
          className="rounded-lg bg-accent text-accent-foreground text-sm font-medium px-4 py-2 hover:opacity-90 transition"
        >
          + Log New Workout
        </Link>
      }
    >
      <div className="flex justify-end">
        <span className="rounded-full bg-accent/10 text-accent text-xs font-medium px-3 py-1">
          {hasProgram ? selectedProgram.name : "My Own Program"}
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {loadingWorkouts ? (
        <p className="text-neutral-500">Loading workouts...</p>
      ) : (
        <>
          <WeekAtAGlance workouts={workouts} firstProgramDayKey={firstProgramDayKey} />

          <div className={`grid gap-4 ${longestStreak.visible ? "grid-cols-2" : "grid-cols-1"}`}>
            <div className="rounded-2xl bg-sidebar text-sidebar-foreground p-5">
              <p className="text-2xl" aria-hidden>
                🔥
              </p>
              <p className="font-display text-2xl tracking-wide">
                {streak} day{streak === 1 ? "" : "s"}
              </p>
              <p className="text-sm text-sidebar-foreground-muted">Current streak</p>
            </div>
            {longestStreak.visible && (
              <div className="rounded-2xl border border-card-border bg-card p-5">
                <p className="text-2xl" aria-hidden>
                  🏆
                </p>
                <p className="font-display text-2xl tracking-wide">
                  {longestStreak.longestStreak} day{longestStreak.longestStreak === 1 ? "" : "s"}
                </p>
                <p className="text-sm text-neutral-500">Longest streak</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-5">
            <p className="text-sm text-neutral-500">Workouts Logged</p>
            <p className="font-display text-2xl tracking-wide">{workouts.length} total</p>
          </div>

          {!hasWorkouts ? (
            <div className="text-center py-8 space-y-1">
              {hasProgram ? (
                <>
                  <p className="text-neutral-500">
                    Ready to get started?{" "}
                    <Link href="/workout/new" className="text-accent hover:underline">
                      Log your first workout here.
                    </Link>
                  </p>
                  <p className="text-neutral-500">
                    Want to change your program?{" "}
                    <Link href="/programs" className="text-accent hover:underline">
                      Check more programs.
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-neutral-500">No workouts logged yet.</p>
                  <p className="text-neutral-500">
                    Already following your own program?{" "}
                    <Link href="/workout/new" className="text-accent hover:underline">
                      Start logging here.
                    </Link>
                  </p>
                  <p className="text-neutral-500">
                    Not sure where to start?{" "}
                    <Link href="/programs" className="text-accent hover:underline">
                      Check our pre-designed programs.
                    </Link>
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <WeeklyWorkoutHistory workouts={workouts} />
              <p className="text-sm">
                {hasProgram ? (
                  <Link href="/programs" className="text-accent hover:underline">
                    Change Program
                  </Link>
                ) : (
                  <>
                    Looking for more structure?{" "}
                    <Link href="/programs" className="text-accent hover:underline">
                      Check our pre-designed programs.
                    </Link>
                  </>
                )}
              </p>
            </>
          )}
        </>
      )}
    </AppShell>
  );
}
