"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProfile } from "@/lib/profile";
import { getProgramById } from "@/lib/programs";
import {
  createWorkout,
  fetchWorkoutDetail,
  fetchWorkoutSummaries,
  updateWorkout,
} from "@/lib/workouts";
import { formatDateKey } from "@/lib/dates";
import type { WorkoutFormData } from "@/lib/types";
import WorkoutForm from "@/components/WorkoutForm";
import AppShell from "@/components/AppShell";

export default function NewWorkoutPage() {
  return (
    <Suspense fallback={null}>
      <NewWorkoutPageInner />
    </Suspense>
  );
}

function NewWorkoutPageInner() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledDate = searchParams.get("date");

  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [dateToWorkoutId, setDateToWorkoutId] = useState<Map<string, string>>(new Map());
  const [selectedDate, setSelectedDate] = useState(
    () => prefilledDate ?? formatDateKey(new Date())
  );
  const [activeWorkout, setActiveWorkout] = useState<(WorkoutFormData & { id: string }) | null>(
    null
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
      return;
    }
    if (user) {
      Promise.all([fetchProfile(user.id), fetchWorkoutSummaries(user.id)])
        .then(([profile, summaries]) => {
          setSelectedProgramId(profile?.selected_program_id ?? null);
          setDateToWorkoutId(new Map(summaries.map((w) => [w.date, w.id])));
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Failed to load workout data."))
        .finally(() => setLoadingPage(false));
    }
  }, [user, loading, router]);

  const activeWorkoutId = dateToWorkoutId.get(selectedDate) ?? null;
  const activeWorkoutLoaded = activeWorkoutId !== null && activeWorkout?.id === activeWorkoutId;

  useEffect(() => {
    if (loadingPage || !activeWorkoutId || activeWorkoutLoaded) return;
    let cancelled = false;
    fetchWorkoutDetail(activeWorkoutId)
      .then((w) => {
        if (!cancelled) setActiveWorkout(w);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load workout.");
      });
    return () => {
      cancelled = true;
    };
  }, [activeWorkoutId, activeWorkoutLoaded, loadingPage]);

  const loggedDates = useMemo(() => new Set(dateToWorkoutId.keys()), [dateToWorkoutId]);
  const showLoadingActiveWorkout = Boolean(activeWorkoutId) && !activeWorkoutLoaded;
  const activeInitialData = activeWorkoutLoaded ? (activeWorkout ?? undefined) : undefined;
  const selectedProgram = getProgramById(selectedProgramId);

  const handleSubmit = useCallback(
    async (data: WorkoutFormData) => {
      if (!user) return;
      setError(null);
      try {
        if (activeWorkoutId) {
          await updateWorkout(activeWorkoutId, data);
        } else {
          await createWorkout(user.id, data);
        }
        router.push("/dashboard");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save workout.");
      }
    },
    [user, activeWorkoutId, router]
  );

  if (loading || !user || loadingPage) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </main>
    );
  }

  return (
    <AppShell title="Log Workout">
      <p className="text-sm text-neutral-500">
        {selectedProgram ? (
          <>
            You are currently following{" "}
            <Link href={`/programs/${selectedProgram.id}`} className="text-accent hover:underline">
              {selectedProgram.name}
            </Link>
            .
          </>
        ) : (
          <>
            You are currently following your own workout program. Looking for more structure?{" "}
            <Link href="/programs" className="text-accent hover:underline">
              Check our pre-designed programs.
            </Link>
          </>
        )}
      </p>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {showLoadingActiveWorkout ? (
        <p className="text-neutral-500">Loading workout...</p>
      ) : (
        <WorkoutForm
          key={activeWorkoutId ?? `new-${selectedDate}`}
          date={selectedDate}
          onDateChange={setSelectedDate}
          loggedDates={loggedDates}
          initialData={activeInitialData}
          onSubmit={handleSubmit}
          submitLabel={activeWorkoutId ? "Save Changes" : "Submit Workout"}
        />
      )}
    </AppShell>
  );
}
