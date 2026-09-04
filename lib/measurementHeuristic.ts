import type { EffortType } from "@/lib/types";

// Names that are timed holds regardless of equipment — checked first since a
// name like "Heavy DB Hold" would otherwise match the dumbbell pattern below.
const HOLD_OR_PLANK_NAMES = new Set([
  "plank",
  "side plank",
  "farmer's carry",
  "farmers carry",
  "heavy dumbbell hold",
  "heavy db hold",
  "plate hold",
]);

const BODYWEIGHT_NAMES = new Set([
  "push-ups",
  "push-up",
  "knee push-ups",
  "hanging knee raise",
  "hanging leg raise",
  "lying leg raise",
  "reverse crunch",
  "dead bug",
  "russian twist",
  "single-leg calf raise",
  "crunch",
  "floor crunch",
]);

const DUMBBELL_NAME = /\b(dumbbell|db)\b/i;

/**
 * Infers the measurement type for an exercise name using the same mechanical
 * rules used when authoring lib/programDetails.ts. Used at runtime when the
 * user switches to an Alternative exercise that has no separately-authored
 * measurement type of its own (GYM-11 AC12).
 */
export function inferMeasurementType(exerciseName: string): EffortType {
  const lower = exerciseName.trim().toLowerCase();
  if (HOLD_OR_PLANK_NAMES.has(lower)) return "duration";
  if (BODYWEIGHT_NAMES.has(lower)) return "bodyweight";
  if (DUMBBELL_NAME.test(lower)) return "weight_each";
  return "total_weight";
}
