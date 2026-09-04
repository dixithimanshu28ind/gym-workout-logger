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

export function isKnownWorkoutType(value: string): boolean {
  return (WORKOUT_TYPES as readonly string[]).includes(value);
}
