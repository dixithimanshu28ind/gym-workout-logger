import type { ExerciseRow, ProgramDay, ProgramDetail } from "@/lib/types";

export interface ProgramDayRef {
  /** Stable id for this program day, e.g. "weeks-1-5:1". Persisted on workouts.program_day_key. */
  key: string;
  weekBlockId: string;
  weekBlockTitle: string;
  day: ProgramDay;
}

/**
 * Flattens a program's training-block AND (CMS-backed) deload-block days
 * into a single ordered list. A deload block only has `days` when its
 * source phase resolved on the CMS side (see lib/cmsAdapter.ts) — the
 * pre-CMS hardcoded programs' deload blocks never carried a day list, so
 * those still contribute nothing here, same as before.
 *
 * Takes an already-resolved ProgramDetail rather than a program id — the
 * detail now comes from the CMS (see lib/cmsPrograms.ts / lib/programsClient.ts),
 * which is async, so callers fetch it once and pass it in here.
 */
export function getProgramDayList(detail: ProgramDetail | null | undefined): ProgramDayRef[] {
  if (!detail) return [];

  const list: ProgramDayRef[] = [];
  for (const block of detail.weekBlocks) {
    const days = block.kind === "training" ? block.days : (block.days ?? []);
    for (const day of days) {
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

/**
 * First program day not present in `completedKeys`, in program order —
 * except never recommended from *before* the furthest block the user has
 * any logged activity in (`touchedKeys`). Without that floor, once a
 * deload week becomes loggable, a user already well past it (e.g. mid
 * Weeks 7–11) would get sent backward into the newly-available-but-never-
 * attempted deload days instead of continuing forward. Within a single
 * block, behavior is unchanged — the first uncompleted day there still
 * wins.
 *
 * `touchedKeys` defaults to `completedKeys` (today's behavior) when not
 * given, since "any logged activity" is a superset only relevant once a
 * caller distinguishes "logged something" from "met the completion bar".
 */
export function getNextProgramDay(
  detail: ProgramDetail | null | undefined,
  completedKeys: Set<string>,
  touchedKeys: Set<string> = completedKeys
): ProgramDayRef | undefined {
  const list = getProgramDayList(detail);
  if (list.length === 0) return undefined;

  const blockStartIndex = new Map<string, number>();
  list.forEach((ref, i) => {
    if (!blockStartIndex.has(ref.weekBlockId)) blockStartIndex.set(ref.weekBlockId, i);
  });

  let furthestTouchedBlockIndex = 0;
  for (const ref of list) {
    if (!touchedKeys.has(ref.key)) continue;
    const start = blockStartIndex.get(ref.weekBlockId)!;
    if (start > furthestTouchedBlockIndex) furthestTouchedBlockIndex = start;
  }

  return list.slice(furthestTouchedBlockIndex).find((d) => !completedKeys.has(d.key));
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
