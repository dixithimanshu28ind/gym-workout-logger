"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/contexts/AuthContext";
import { fetchWorkoutSummaries } from "@/lib/workouts";
import { fetchProfile } from "@/lib/profile";
import { fetchProgramById } from "@/lib/programsClient";
import { computeCurrentStreak, computeLongestStreak } from "@/lib/streak";
import type { Program, WorkoutSummary } from "@/lib/types";
import WeeklyWorkoutHistory from "@/components/WeeklyWorkoutHistory";
import WeekAtAGlance from "@/components/WeekAtAGlance";
import AppShell from "@/components/AppShell";

export default function DashboardPage() {
  const { user, loading } = useRequireAuth();
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
  // Which user's data has finished loading (or failed). "Loading workouts..."
  // is derived from it rather than set by hand, so nothing sets state
  // synchronously inside the effect below.
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    // Ignore a response that arrives after the user changed or the page left,
    // so a slow earlier load can't overwrite a newer one.
    let cancelled = false;
    (async () => {
      try {
        const [data, profile] = await Promise.all([
          fetchWorkoutSummaries(user.id),
          fetchProfile(user.id),
        ]);
        const programId = profile?.selected_program_id ?? null;
        const program = programId ? (await fetchProgramById(programId))?.program ?? null : null;
        if (cancelled) return;
        setWorkouts(data);
        setSelectedProgramId(programId);
        setSelectedProgram(program);
        setError(null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load workouts.");
      } finally {
        if (!cancelled) setLoadedFor(user.id);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || !user) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </main>
    );
  }

  const loadingWorkouts = loadedFor !== user.id;

  const streak = computeCurrentStreak(workouts.map((w) => w.date));
  const longestStreak = computeLongestStreak(workouts.map((w) => w.date));
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
