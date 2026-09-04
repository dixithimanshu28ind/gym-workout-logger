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
  selected_program_id?: string | null;
}

export interface ProgramScheduleDay {
  day: number;
  focus: string;
}

export interface Program {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  durationWeeks: number;
  daysPerWeek: number;
  sessionMinutes: number;
  schedule: ProgramScheduleDay[];
}

export interface ExerciseRow {
  exercise: string;
  target: string;
  setsReps: string;
  rest: string;
  alternative: string;
}

export interface ExerciseGroup {
  heading?: string;
  exercises: ExerciseRow[];
}

export interface HiitRound {
  label: string;
  warmUp?: string;
  hardEffort: string;
  easyCycling: string;
  repeat: string;
  note?: string;
}

export interface HiitDetail {
  intro: string[];
  rounds: HiitRound[];
  coolDown: string;
}

export interface ProgramDay {
  day: number;
  title: string;
  note?: string;
  groups?: ExerciseGroup[];
  hiit?: HiitDetail;
  progressionNote?: string;
}

export interface TrainingBlock {
  kind: "training";
  id: string;
  title: string;
  intro?: string;
  days: ProgramDay[];
}

export interface DeloadBlock {
  kind: "deload";
  id: string;
  title: string;
  body: string[];
}

export type ProgramWeekBlock = TrainingBlock | DeloadBlock;

export interface ProgramTextBlock {
  title: string;
  intro?: string;
  bullets?: string[];
  note?: string;
}

export interface ProgramDetail {
  id: string;
  whatIsIt: string[];
  warmUp: ProgramTextBlock;
  weekBlocks: ProgramWeekBlock[];
  coolDown: ProgramTextBlock;
  safetyNote: { title: string; bullets: string[] };
}
