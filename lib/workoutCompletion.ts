import type { ExerciseData, SetData } from "@/lib/types";

/**
 * GYM-11 AC15: a set is "complete" once it has the values needed for its
 * measurement type. Mirrors the field requirements the old hard validation
 * (lib/workoutValidation.ts) used to enforce before saving was blocked on it.
 */
export function isSetComplete(set: Pick<SetData, "effort_type" | "effort_value" | "reps" | "duration_unit">): boolean {
  switch (set.effort_type) {
    case "total_weight":
    case "weight_each":
      return set.effort_value > 0 && set.reps > 0;
    case "bodyweight":
      return set.reps > 0;
    case "duration":
      return set.effort_value > 0 && !!set.duration_unit;
    default:
      return false;
  }
}

/** AC15: an exercise counts as completed once at least one of its sets is complete. */
export function isExerciseComplete(exercise: Pick<ExerciseData, "sets">): boolean {
  return exercise.sets.some(isSetComplete);
}

/** AC18: only completed sets within a completed exercise are saved. */
export function completedSetsOf(exercise: Pick<ExerciseData, "sets">): SetData[] {
  return exercise.sets.filter(isSetComplete);
}
