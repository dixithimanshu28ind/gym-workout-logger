import type { ProgramDay } from "@/lib/types";
import { getProgramDetail } from "@/lib/programDetails";

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
 */
export function getProgramDayList(programId: string | null | undefined): ProgramDayRef[] {
  const detail = getProgramDetail(programId ?? undefined);
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
  programId: string | null | undefined,
  completedKeys: Set<string>
): ProgramDayRef | undefined {
  return getProgramDayList(programId).find((d) => !completedKeys.has(d.key));
}

export function findProgramDay(
  programId: string | null | undefined,
  key: string
): ProgramDayRef | undefined {
  return getProgramDayList(programId).find((d) => d.key === key);
}

/** Total exercises prescribed across all of a day's groups (0 for a HIIT/rounds-only day). */
export function prescribedExerciseCount(day: ProgramDay): number {
  return (day.groups ?? []).reduce((sum, g) => sum + g.exercises.length, 0);
}
