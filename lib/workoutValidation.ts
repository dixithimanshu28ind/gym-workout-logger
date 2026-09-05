import type { WorkoutSectionData } from "@/lib/types";

/**
 * The only remaining hard-blocking check. GYM-11 AC16 removed the previous
 * per-exercise/per-set completeness validation (missing weight/reps/duration,
 * zero exercises, etc.) — those are now handled by the save-confirmation
 * dialogs in app/workout/new/page.tsx instead of blocking Save outright.
 */
export function validateWorkoutSection(section: WorkoutSectionData, label: string): string[] {
  const errs: string[] = [];
  if (!section.workout_type) errs.push(`${label}: workout type is required.`);
  return errs;
}
