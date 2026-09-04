export type EffortType = "total_weight" | "weight_each" | "bodyweight" | "duration";
export type DurationUnit = "min" | "sec";

export interface SetData {
  id?: string;
  effort_type: EffortType;
  effort_value: number;
  reps: number;
  duration_unit?: DurationUnit | null;
}

export interface ExerciseData {
  id?: string;
  name: string;
  sets: SetData[];
  /** Prescribed target shown as guidance when prefilled from a program, e.g. "8–12 reps". Display only — never persisted. */
  targetLabel?: string;
}

export interface WorkoutFormData {
  date: string;
  workout_type: string;
  workout_type_custom?: string | null;
  exercises: ExerciseData[];
  /** Which pre-designed program this workout fulfills, if any (GYM-11). */
  program_id?: string | null;
  /** Which program day (e.g. "weeks-1-5:1") this workout fulfills, if any (GYM-11). */
  program_day_key?: string | null;
}

export interface WorkoutSectionData {
  id?: string;
  workout_type: string;
  workout_type_custom?: string | null;
  exercises: ExerciseData[];
  program_id?: string | null;
  program_day_key?: string | null;
}

export interface WorkoutSummary {
  id: string;
  date: string;
  workout_type: string;
  workout_type_custom: string | null;
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
  /** Number of sets to prefill. Only populated for programs reworked for GYM-11 prefill support. */
  sets?: number;
  /** Display-only target range for the prefilled sets, e.g. "8–12 reps" or "30–60 sec". */
  targetReps?: string;
  /** Measurement type to preselect on each prefilled set. */
  measurementType?: EffortType;
  rest: string;
  /** Alternative exercise name, or "—" if none. */
  alternative: string;
}

export interface ExerciseGroup {
  heading?: string;
  /** Workout Type this group prefills as its own Workout section. Only populated for programs reworked for GYM-11 prefill support. */
  workoutType?: string;
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
