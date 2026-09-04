export const WORKOUT_TYPES = [
  "Full Body",
  "Upper Body",
  "Lower Body",
  "Push",
  "Pull",
  "Legs",
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Biceps",
  "Triceps",
  "Core / Abs",
  "Calves",
  "Forearms",
  "Cardio",
  "HIIT",
  "Mobility / Recovery",
  "Rest Day",
  "Other",
] as const;

export const OTHER_WORKOUT_TYPE = "Other";

export const REST_DAY_WORKOUT_TYPE = "Rest Day";

// The only workout types allowed alongside Rest Day on the same date.
export const REST_DAY_COMPANION_TYPES = ["Cardio", "Mobility / Recovery", "Other"] as const;

export function isKnownWorkoutType(value: string): boolean {
  return (WORKOUT_TYPES as readonly string[]).includes(value);
}
