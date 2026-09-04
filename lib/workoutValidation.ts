import type { WorkoutSectionData } from "@/lib/types";
import { REST_DAY_WORKOUT_TYPE } from "@/lib/workoutTypes";

export function validateWorkoutSection(section: WorkoutSectionData, label: string): string[] {
  const errs: string[] = [];
  if (!section.workout_type) errs.push(`${label}: workout type is required.`);
  if (section.workout_type !== REST_DAY_WORKOUT_TYPE && section.exercises.length === 0)
    errs.push(`${label}: add at least one exercise.`);

  section.exercises.forEach((ex, i) => {
    if (!ex.name.trim()) errs.push(`${label}, Exercise ${i + 1}: name is required.`);
    if (ex.sets.length === 0) errs.push(`${label}, Exercise ${i + 1}: add at least one set.`);
    ex.sets.forEach((s, j) => {
      const setLabel = `${label}, Exercise ${i + 1}, Set ${j + 1}`;
      switch (s.effort_type) {
        case "total_weight":
        case "weight_each":
          if (!(s.effort_value > 0)) errs.push(`${setLabel}: weight must be a positive number.`);
          if (!(s.reps > 0)) errs.push(`${setLabel}: reps must be a positive number.`);
          break;
        case "bodyweight":
          if (!(s.reps > 0)) errs.push(`${setLabel}: reps must be a positive number.`);
          break;
        case "duration":
          if (!(s.effort_value > 0)) errs.push(`${setLabel}: duration must be a positive number.`);
          if (!s.duration_unit) errs.push(`${setLabel}: duration unit is required.`);
          break;
      }
    });
  });

  return errs;
}
