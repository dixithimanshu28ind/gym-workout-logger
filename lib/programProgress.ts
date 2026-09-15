import type { ExerciseRow, ProgramDay, ProgramDetail } from "@/lib/types";

export interface ProgramDayRef {
  /** Stable id for this program day, e.g. "weeks-1-5:1". Persisted on workouts.program_day_key. */
  key: string;
  weekBlockId: string;
  weekBlockTitle: string;
  day: ProgramDay;
}

/**
 * Flattens a program's training-block days into a single ordered list.
 * Deload blocks have no `days` and are skipped entirely — matching GYM-11's
 * "progression is based on saved workout completion, not elapsed calendar
 * time" rule, since there's nothing to complete during a deload week.
 *
 * Takes an already-resolved ProgramDetail rather than a program id — the
 * detail now comes from the CMS (see lib/cmsPrograms.ts / lib/programsClient.ts),
 * which is async, so callers fetch it once and pass it in here.
 */
export function getProgramDayList(detail: ProgramDetail | null | undefined): ProgramDayRef[] {
  if (!detail) return [];

  const list: ProgramDayRef[] = [];
  for (const block of detail.weekBlocks) {
    if (block.kind !== "training") continue;
    for (const day of block.days) {
      list.push({
        key: `${block.id}:${day.day}`,
        weekBlockId: block.id,
        weekBlockTitle: block.title,
        day,
      });
    }
  }
  return list;
}

/** First program day not present in `completedKeys`, in program order. */
export function getNextProgramDay(
  detail: ProgramDetail | null | undefined,
  completedKeys: Set<string>
): ProgramDayRef | undefined {
  return getProgramDayList(detail).find((d) => !completedKeys.has(d.key));
}

export function findProgramDay(
  detail: ProgramDetail | null | undefined,
  key: string
): ProgramDayRef | undefined {
  return getProgramDayList(detail).find((d) => d.key === key);
}

export interface PrescribedExerciseRef {
  /** 0-based position across the whole day's prescribed list (spans all groups in order). */
  index: number;
  groupWorkoutType: string;
  exercise: ExerciseRow;
}

/**
 * Every prescribed exercise for a day, flattened across its groups in
 * order and numbered — the numbering an ExerciseData.prescribedIndex is
 * assigned from at prefill time (GYM-11 AC29-31), so a saved exercise's
 * index can be matched back to exactly which prescribed slot it filled.
 */
export function getPrescribedExercises(day: ProgramDay): PrescribedExerciseRef[] {
  const refs: PrescribedExerciseRef[] = [];
  for (const group of day.groups ?? []) {
    for (const exercise of group.exercises) {
      refs.push({ index: refs.length, groupWorkoutType: group.workoutType ?? "", exercise });
    }
  }
  return refs;
}

/** Total exercises prescribed across all of a day's groups (0 for a HIIT/rounds-only day). */
export function prescribedExerciseCount(day: ProgramDay): number {
  return getPrescribedExercises(day).length;
}
