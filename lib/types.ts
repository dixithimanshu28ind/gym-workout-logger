export type EffortType = "weight" | "duration";

export interface SetData {
  id?: string;
  effort_type: EffortType;
  effort_value: number;
  reps: number;
}

export interface ExerciseData {
  id?: string;
  name: string;
  sets: SetData[];
}

export interface WorkoutFormData {
  date: string;
  workout_type: string;
  exercises: ExerciseData[];
}

export interface WorkoutSummary {
  id: string;
  date: string;
  workout_type: string;
  exerciseCount: number;
}

export type GymExperience = "rookie" | "intermediate" | "expert";

export interface Profile {
  name: string;
  age: number | null;
  weight_kg: number | null;
  target_weight_kg: number | null;
  gym_experience: GymExperience | null;
}
