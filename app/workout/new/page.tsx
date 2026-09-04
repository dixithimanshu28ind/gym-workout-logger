"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProfile } from "@/lib/profile";
import { getProgramById } from "@/lib/programs";
import {
  createWorkout,
  deleteWorkout,
  fetchWorkoutDetail,
  fetchWorkoutSummaries,
  updateWorkout,
} from "@/lib/workouts";
import { formatDateKey } from "@/lib/dates";
import { OTHER_WORKOUT_TYPE } from "@/lib/workoutTypes";
import { validateWorkoutSection } from "@/lib/workoutValidation";
import type { WorkoutFormData, WorkoutSectionData } from "@/lib/types";
import WorkoutDatePicker from "@/components/WorkoutDatePicker";
import WorkoutSection from "@/components/WorkoutSection";
import AppShell from "@/components/AppShell";

interface SectionState {
  clientKey: string;
  data: WorkoutSectionData;
  justAdded?: boolean;
}

const emptySectionData = (): WorkoutSectionData => ({
  workout_type: "",
  workout_type_custom: null,
  exercises: [],
});

let clientKeyCounter = 0;
const nextClientKey = () => `new-${Date.now()}-${clientKeyCounter++}`;

const defaultExpandedIndex = (count: number): number | null => (count === 1 ? 0 : null);

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
  const [dateToWorkoutIds, setDateToWorkoutIds] = useState<Map<string, string[]>>(new Map());
  const [selectedDate, setSelectedDate] = useState(
    () => prefilledDate ?? formatDateKey(new Date())
  );
  const [sections, setSections] = useState<SectionState[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [initialSectionIds, setInitialSectionIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
      return;
    }
    if (user) {
      Promise.all([fetchProfile(user.id), fetchWorkoutSummaries(user.id)])
        .then(([profile, summaries]) => {
          setSelectedProgramId(profile?.selected_program_id ?? null);
          const map = new Map<string, string[]>();
          for (const w of summaries) {
            const ids = map.get(w.date) ?? [];
            ids.push(w.id);
            map.set(w.date, ids);
          }
          setDateToWorkoutIds(map);
          if (!map.get(selectedDate)?.length) {
            setSections([{ clientKey: nextClientKey(), data: emptySectionData() }]);
            setInitialSectionIds([]);
            setExpandedIndex(0);
          }
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Failed to load workout data."))
        .finally(() => setLoadingPage(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router]);

  const currentIdsForDate = useMemo(
    () => dateToWorkoutIds.get(selectedDate) ?? [],
    [dateToWorkoutIds, selectedDate]
  );
  const sectionsMatchDate =
    currentIdsForDate.length === initialSectionIds.length &&
    currentIdsForDate.every((id, i) => id === initialSectionIds[i]);
  const loadingSections = currentIdsForDate.length > 0 && !sectionsMatchDate;

  useEffect(() => {
    if (loadingPage || currentIdsForDate.length === 0 || sectionsMatchDate) return;
    let cancelled = false;
    Promise.all(currentIdsForDate.map((id) => fetchWorkoutDetail(id)))
      .then((workouts) => {
        if (cancelled) return;
        setSections(
          workouts.map((w) => ({
            clientKey: w.id,
            data: {
              id: w.id,
              workout_type: w.workout_type,
              workout_type_custom: w.workout_type_custom,
              exercises: w.exercises,
            },
          }))
        );
        setInitialSectionIds(currentIdsForDate);
        setExpandedIndex(defaultExpandedIndex(workouts.length));
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load workouts.");
      });
    return () => {
      cancelled = true;
    };
  }, [currentIdsForDate, sectionsMatchDate, loadingPage]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const ids = dateToWorkoutIds.get(newDate) ?? [];
    if (ids.length === 0) {
      setSections([{ clientKey: nextClientKey(), data: emptySectionData() }]);
      setInitialSectionIds([]);
      setExpandedIndex(0);
    }
  };

  const loggedDates = useMemo(() => new Set(dateToWorkoutIds.keys()), [dateToWorkoutIds]);
  const selectedProgram = getProgramById(selectedProgramId);

  const updateSection = (idx: number, next: WorkoutSectionData) =>
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, data: next } : s)));

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { clientKey: nextClientKey(), data: emptySectionData(), justAdded: true },
    ]);
    setExpandedIndex(sections.length);
  };

  const removeSection = (idx: number) => {
    const next = sections.filter((_, i) => i !== idx);
    const finalSections =
      next.length > 0 ? next : [{ clientKey: nextClientKey(), data: emptySectionData() }];
    setSections(finalSections);

    if (finalSections.length === 1) {
      setExpandedIndex(0);
      return;
    }
    setExpandedIndex((prev) => {
      if (prev === null) return null;
      if (idx < prev) return prev - 1;
      if (idx === prev) return null;
      return prev;
    });
  };

  const handleSave = useCallback(async () => {
    if (!user) return;
    setError(null);

    const meaningfulSections = sections.filter(
      (s) => s.data.workout_type !== "" || s.data.exercises.length > 0
    );

    const allErrors = meaningfulSections.flatMap((s, i) =>
      validateWorkoutSection(s.data, `Workout ${i + 1}`)
    );
    setErrors(allErrors);
    if (allErrors.length > 0) return;

    setSaving(true);
    try {
      const currentIds = new Set(
        meaningfulSections.filter((s) => s.data.id).map((s) => s.data.id!)
      );
      const removedIds = initialSectionIds.filter((id) => !currentIds.has(id));

      await Promise.all([
        ...meaningfulSections.map((s) => {
          const payload: WorkoutFormData = {
            date: selectedDate,
            workout_type: s.data.workout_type,
            workout_type_custom:
              s.data.workout_type === OTHER_WORKOUT_TYPE
                ? s.data.workout_type_custom?.trim() || null
                : null,
            exercises: s.data.exercises,
          };
          return s.data.id ? updateWorkout(s.data.id, payload) : createWorkout(user.id, payload);
        }),
        ...removedIds.map((id) => deleteWorkout(id)),
      ]);
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save workouts.");
    } finally {
      setSaving(false);
    }
  }, [user, sections, initialSectionIds, selectedDate, router]);

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

      <div className="sticky top-0 z-20 -mx-6 flex justify-center border-b border-card-border bg-background px-6 py-3">
        <div className="w-full max-w-xs">
          <WorkoutDatePicker value={selectedDate} onChange={handleDateChange} loggedDates={loggedDates} />
        </div>
      </div>

      {loadingSections ? (
        <p className="text-neutral-500">Loading workouts...</p>
      ) : (
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <WorkoutSection
              key={section.clientKey}
              value={section.data}
              onChange={(next) => updateSection(idx, next)}
              onRemove={() => removeSection(idx)}
              isOpen={idx === expandedIndex}
              onToggle={() => setExpandedIndex((prev) => (prev === idx ? null : idx))}
              autoFocusType={section.justAdded}
            />
          ))}

          <button
            type="button"
            onClick={addSection}
            className="w-full rounded-lg border border-dashed border-accent py-2.5 text-sm font-medium text-neutral-700 hover:bg-accent/10 transition"
          >
            + Add Workout
          </button>

          {errors.length > 0 && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <ul className="text-sm text-red-700 list-disc list-inside space-y-0.5">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-accent text-accent-foreground font-medium py-2.5 hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Workouts"}
          </button>
        </div>
      )}
    </AppShell>
  );
}
