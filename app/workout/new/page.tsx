"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigationGuard } from "@/contexts/NavigationGuardContext";
import { fetchProfile } from "@/lib/profile";
import { getProgramById } from "@/lib/programs";
import {
  createWorkout,
  deleteWorkout,
  fetchCompletedProgramDayKeys,
  fetchWorkoutDetail,
  fetchWorkoutSummaries,
  updateWorkout,
} from "@/lib/workouts";
import { formatDateKey } from "@/lib/dates";
import {
  OTHER_WORKOUT_TYPE,
  REST_DAY_COMPANION_TYPES,
  REST_DAY_WORKOUT_TYPE,
  WORKOUT_TYPES,
} from "@/lib/workoutTypes";
import { validateWorkoutSection } from "@/lib/workoutValidation";
import { isExerciseComplete, completedSetsOf } from "@/lib/workoutCompletion";
import { getProgramDayList, getNextProgramDay, type ProgramDayRef } from "@/lib/programProgress";
import { inferMeasurementType } from "@/lib/measurementHeuristic";
import type { EffortType, SetData, WorkoutFormData, WorkoutSectionData } from "@/lib/types";
import WorkoutDatePicker from "@/components/WorkoutDatePicker";
import WorkoutSection from "@/components/WorkoutSection";
import AppShell from "@/components/AppShell";
import Modal from "@/components/Modal";

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

function allowedTypesFor(sections: SectionState[], idx: number): readonly string[] | undefined {
  const siblingTypes = sections
    .filter((_, i) => i !== idx)
    .map((s) => s.data.workout_type)
    .filter(Boolean);

  if (siblingTypes.includes(REST_DAY_WORKOUT_TYPE)) return REST_DAY_COMPANION_TYPES;

  const hasTrainingType = siblingTypes.some(
    (t) => t !== REST_DAY_WORKOUT_TYPE && !(REST_DAY_COMPANION_TYPES as readonly string[]).includes(t)
  );
  if (hasTrainingType) return WORKOUT_TYPES.filter((t) => t !== REST_DAY_WORKOUT_TYPE);

  return undefined;
}

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
  const [completedProgramDayKeys, setCompletedProgramDayKeys] = useState<Set<string>>(new Set());
  const [dismissedForDate, setDismissedForDate] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState<
    { sections: SectionState[]; onDone: () => void } | null
  >(null);
  const [saveDialog, setSaveDialog] = useState<
    { kind: "none-completed" } | { kind: "some-incomplete"; completed: number; total: number } | null
  >(null);
  const [dirty, setDirty] = useState(false);
  const [leaveDialog, setLeaveDialog] = useState<{ proceed: () => void } | null>(null);
  const dirtyRef = useRef(dirty);
  const { registerGuard, guardedNavigate } = useNavigationGuard();

  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  useEffect(
    () => registerGuard(() => dirtyRef.current, (proceed) => setLeaveDialog({ proceed })),
    [registerGuard]
  );

  // AC25: warn on tab close/refresh too. Browsers show their own generic
  // prompt here (no custom copy allowed) — this is a platform limitation,
  // not a shortcut; there's no way to run an async save from this handler.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
      return;
    }
    if (user) {
      Promise.all([fetchProfile(user.id), fetchWorkoutSummaries(user.id)])
        .then(([profile, summaries]) => {
          const programId = profile?.selected_program_id ?? null;
          setSelectedProgramId(programId);
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
            setDirty(false);
          }
          return programId;
        })
        .then((programId) => {
          if (!programId) return;
          return fetchCompletedProgramDayKeys(user.id, programId).then(setCompletedProgramDayKeys);
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
        setDirty(false);
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
      setDirty(false);
    }
  };

  const loggedDates = useMemo(() => new Set(dateToWorkoutIds.keys()), [dateToWorkoutIds]);
  const selectedProgram = getProgramById(selectedProgramId);

  const nextProgramDay = useMemo(
    () => (selectedProgramId ? getNextProgramDay(selectedProgramId, completedProgramDayKeys) : undefined),
    [selectedProgramId, completedProgramDayKeys]
  );
  const showRecommendation =
    !!selectedProgramId &&
    !!nextProgramDay &&
    currentIdsForDate.length === 0 &&
    dismissedForDate !== selectedDate;

  const emptySetForType = (measurementType: EffortType): SetData => ({
    effort_type: measurementType,
    effort_value: 0,
    reps: 0,
    duration_unit: measurementType === "duration" ? "min" : undefined,
  });

  const sectionsFromProgramDay = (ref: ProgramDayRef): SectionState[] => {
    const groups = ref.day.groups;
    if (!groups || groups.length === 0) {
      // HIIT / rounds-only day — no structured exercise list to prefill.
      return [
        {
          clientKey: nextClientKey(),
          data: {
            workout_type: "HIIT",
            workout_type_custom: null,
            exercises: [],
            program_id: selectedProgramId,
            program_day_key: ref.key,
          },
        },
      ];
    }
    return groups.map((group) => ({
      clientKey: nextClientKey(),
      data: {
        workout_type: group.workoutType ?? "",
        workout_type_custom: null,
        exercises: group.exercises.map((ex) => {
          const measurementType = ex.measurementType ?? "total_weight";
          return {
            name: ex.exercise,
            targetLabel: ex.targetReps,
            isPrescribed: true,
            sets: Array.from({ length: ex.sets ?? 1 }, () => emptySetForType(measurementType)),
            altToggle:
              ex.alternative && ex.alternative !== "—"
                ? {
                    originalName: ex.exercise,
                    originalMeasurementType: measurementType,
                    alternativeName: ex.alternative,
                    alternativeMeasurementType: inferMeasurementType(ex.alternative),
                    usingAlternative: false,
                  }
                : undefined,
          };
        }),
        program_id: selectedProgramId,
        program_day_key: ref.key,
      },
    }));
  };

  const applyProgramDay = (ref: ProgramDayRef) => {
    const built = sectionsFromProgramDay(ref);
    setSections(built);
    setInitialSectionIds([]);
    setExpandedIndex(defaultExpandedIndex(built.length));
    setDismissedForDate(selectedDate);
    setPickerOpen(false);
    setDirty(true);
  };

  const logSomethingElse = () => {
    setSections([{ clientKey: nextClientKey(), data: emptySectionData() }]);
    setInitialSectionIds([]);
    setExpandedIndex(0);
    setDismissedForDate(selectedDate);
    setDirty(true);
  };

  const updateSection = (idx: number, next: WorkoutSectionData) => {
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, data: next } : s)));
    setDirty(true);
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { clientKey: nextClientKey(), data: emptySectionData(), justAdded: true },
    ]);
    setExpandedIndex(sections.length);
    setDirty(true);
  };

  const removeSection = (idx: number) => {
    const next = sections.filter((_, i) => i !== idx);
    const finalSections =
      next.length > 0 ? next : [{ clientKey: nextClientKey(), data: emptySectionData() }];
    setSections(finalSections);
    setDirty(true);

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

  const performSave = useCallback(
    async (meaningfulSections: SectionState[], onDone: () => void) => {
      if (!user) return;
      setSaving(true);
      try {
        const currentIds = new Set(
          meaningfulSections.filter((s) => s.data.id).map((s) => s.data.id!)
        );
        const removedIds = initialSectionIds.filter((id) => !currentIds.has(id));

        await Promise.all([
          ...meaningfulSections.map((s) => {
            // AC16-18: Rest Day keeps its own zero-exercise behaviour; every
            // other section saves only its completed exercises/sets.
            const exercises =
              s.data.workout_type === REST_DAY_WORKOUT_TYPE
                ? s.data.exercises
                : s.data.exercises
                    .filter(isExerciseComplete)
                    .map((ex) => ({ ...ex, sets: completedSetsOf(ex) }));
            const payload: WorkoutFormData = {
              date: selectedDate,
              workout_type: s.data.workout_type,
              workout_type_custom:
                s.data.workout_type === OTHER_WORKOUT_TYPE
                  ? s.data.workout_type_custom?.trim() || null
                  : null,
              exercises,
              program_id: s.data.program_id ?? null,
              program_day_key: s.data.program_day_key ?? null,
            };
            return s.data.id ? updateWorkout(s.data.id, payload) : createWorkout(user.id, payload);
          }),
          ...removedIds.map((id) => deleteWorkout(id)),
        ]);
        setDirty(false);
        onDone();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save workouts.");
      } finally {
        setSaving(false);
        setSaveDialog(null);
      }
    },
    [user, initialSectionIds, selectedDate]
  );

  const attemptSave = useCallback(
    (onDone: () => void) => {
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

      // AC17/19: completeness is judged across every non-Rest-Day section
      // being saved this click — Rest Day always saves as-is regardless.
      const nonRestSections = meaningfulSections.filter(
        (s) => s.data.workout_type !== REST_DAY_WORKOUT_TYPE
      );
      const total = nonRestSections.reduce((n, s) => n + s.data.exercises.length, 0);
      const completed = nonRestSections.reduce(
        (n, s) => n + s.data.exercises.filter(isExerciseComplete).length,
        0
      );

      if (nonRestSections.length > 0 && completed === 0) {
        setPendingSave({ sections: meaningfulSections, onDone });
        setSaveDialog({ kind: "none-completed" });
        return;
      }
      if (completed < total) {
        setPendingSave({ sections: meaningfulSections, onDone });
        setSaveDialog({ kind: "some-incomplete", completed, total });
        return;
      }

      performSave(meaningfulSections, onDone);
    },
    [user, sections, performSave]
  );

  const handleSave = useCallback(
    () => attemptSave(() => router.push("/dashboard")),
    [attemptSave, router]
  );

  const handleSaveAndLeave = () => {
    const proceed = leaveDialog?.proceed;
    setLeaveDialog(null);
    if (proceed) attemptSave(proceed);
  };

  const handleLeaveWithoutSaving = () => {
    const proceed = leaveDialog?.proceed;
    setLeaveDialog(null);
    setDirty(false);
    proceed?.();
  };

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
            <Link
              href={`/programs/${selectedProgram.id}`}
              onClick={(e) => {
                e.preventDefault();
                guardedNavigate(() => router.push(`/programs/${selectedProgram.id}`));
              }}
              className="text-accent hover:underline"
            >
              {selectedProgram.name}
            </Link>
            .
          </>
        ) : (
          <>
            You are currently following your own workout program. Looking for more structure?{" "}
            <Link
              href="/programs"
              onClick={(e) => {
                e.preventDefault();
                guardedNavigate(() => router.push("/programs"));
              }}
              className="text-accent hover:underline"
            >
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

      {showRecommendation && nextProgramDay && (
        <div className="rounded-xl border border-card-border bg-card p-4 space-y-3">
          <div>
            <p className="font-medium">
              Up next: {nextProgramDay.day.title.replace(/^Day \d+ — /, "")}
            </p>
            <p className="text-sm text-neutral-500">
              Day {nextProgramDay.day.day} of your {selectedProgram?.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyProgramDay(nextProgramDay)}
              className="rounded-lg bg-accent text-accent-foreground font-medium px-4 py-2 text-sm hover:opacity-90 transition"
            >
              Use This Workout
            </button>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium hover:bg-background transition"
            >
              Choose Another Program Workout
            </button>
            <button
              type="button"
              onClick={logSomethingElse}
              className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium hover:bg-background transition"
            >
              Log Something Else
            </button>
          </div>
        </div>
      )}

      {pickerOpen && (
        <Modal onClose={() => setPickerOpen(false)}>
          <p className="font-medium mb-3">Choose a program workout</p>
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {getProgramDayList(selectedProgramId).map((ref) => {
              const done = completedProgramDayKeys.has(ref.key);
              return (
                <button
                  key={ref.key}
                  type="button"
                  onClick={() => applyProgramDay(ref)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-background transition"
                >
                  <span>{ref.day.title.replace(/^Day \d+ — /, "")}</span>
                  {done && <span className="text-xs text-accent">Completed</span>}
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {saveDialog?.kind === "none-completed" && (
        <Modal onClose={() => setSaveDialog(null)} showCloseButton={false}>
          <p className="font-medium">No exercises completed</p>
          <p className="mt-2 text-sm text-neutral-600">
            There are no completed exercises to save for this workout.
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => setSaveDialog(null)}
              className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium hover:bg-background"
            >
              Stay
            </button>
            <button
              onClick={() => {
                setDirty(false);
                pendingSave?.onDone();
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Leave Without Saving
            </button>
          </div>
        </Modal>
      )}

      {saveDialog?.kind === "some-incomplete" && (
        <Modal onClose={() => setSaveDialog(null)} showCloseButton={false}>
          <p className="font-medium">Some exercises aren&apos;t completed</p>
          <p className="mt-2 text-sm text-neutral-600">
            You&apos;ve completed {saveDialog.completed} of {saveDialog.total} exercises. Only
            completed exercises will be saved.
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => setSaveDialog(null)}
              className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium hover:bg-background"
            >
              Stay
            </button>
            <button
              onClick={() => pendingSave && performSave(pendingSave.sections, pendingSave.onDone)}
              disabled={saving}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save & Exit"}
            </button>
          </div>
        </Modal>
      )}

      {leaveDialog && (
        <Modal onClose={() => setLeaveDialog(null)} showCloseButton={false}>
          <p className="font-medium">Save before you leave?</p>
          <p className="mt-2 text-sm text-neutral-600">
            You have changes that haven&apos;t been saved.
          </p>
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button
              onClick={() => setLeaveDialog(null)}
              className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium hover:bg-background"
            >
              Stay
            </button>
            <button
              onClick={handleLeaveWithoutSaving}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Leave Without Saving
            </button>
            <button
              onClick={handleSaveAndLeave}
              disabled={saving}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save & Leave"}
            </button>
          </div>
        </Modal>
      )}

      {loadingSections ? (
        <p className="text-neutral-500">Loading workouts...</p>
      ) : showRecommendation ? null : (
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
              allowedTypes={allowedTypesFor(sections, idx)}
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
