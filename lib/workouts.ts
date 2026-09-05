import { supabase } from "@/lib/supabaseClient";
import type { WorkoutFormData, WorkoutSummary } from "@/lib/types";
import { normalizeEffortType } from "@/lib/effortTypes";
import { isSetComplete } from "@/lib/workoutCompletion";
import { findProgramDay, prescribedExerciseCount } from "@/lib/programProgress";

export async function fetchWorkoutSummaries(userId: string): Promise<WorkoutSummary[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("id, date, workout_type, workout_type_custom, exercises(id)")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((w) => ({
    id: w.id,
    date: w.date,
    workout_type: w.workout_type,
    workout_type_custom: w.workout_type_custom,
    exerciseCount: Array.isArray(w.exercises) ? w.exercises.length : 0,
  }));
}

export async function fetchWorkoutDetail(
  workoutId: string
): Promise<WorkoutFormData & { id: string }> {
  const { data, error } = await supabase
    .from("workouts")
    .select(
      "id, date, workout_type, workout_type_custom, program_id, program_day_key, exercises(id, name, is_prescribed, sets(id, effort_type, effort_value, reps, duration_unit))"
    )
    .eq("id", workoutId)
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    date: data.date,
    workout_type: data.workout_type,
    workout_type_custom: data.workout_type_custom,
    program_id: data.program_id,
    program_day_key: data.program_day_key,
    exercises: (data.exercises ?? []).map((ex) => ({
      id: ex.id,
      name: ex.name,
      isPrescribed: ex.is_prescribed,
      sets: (ex.sets ?? []).map((s) => {
        const effort_type = normalizeEffortType(s.effort_type);
        return {
          id: s.id,
          effort_type,
          effort_value: s.effort_value,
          reps: s.reps,
          duration_unit: effort_type === "duration" ? (s.duration_unit ?? "min") : undefined,
        };
      }),
    })),
  };
}

export async function createWorkout(userId: string, form: WorkoutFormData): Promise<string> {
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .insert({
      user_id: userId,
      date: form.date,
      workout_type: form.workout_type,
      workout_type_custom: form.workout_type_custom ?? null,
      program_id: form.program_id ?? null,
      program_day_key: form.program_day_key ?? null,
    })
    .select("id")
    .single();

  if (workoutError) throw new Error(workoutError.message);

  await insertExercises(workout.id, form.exercises);

  return workout.id;
}

export async function updateWorkout(workoutId: string, form: WorkoutFormData): Promise<void> {
  const { error: updateError } = await supabase
    .from("workouts")
    .update({
      date: form.date,
      workout_type: form.workout_type,
      workout_type_custom: form.workout_type_custom ?? null,
      program_id: form.program_id ?? null,
      program_day_key: form.program_day_key ?? null,
    })
    .eq("id", workoutId);

  if (updateError) throw new Error(updateError.message);

  // Replace exercises/sets wholesale — simplest consistent way to handle edits.
  const { error: deleteError } = await supabase
    .from("exercises")
    .delete()
    .eq("workout_id", workoutId);

  if (deleteError) throw new Error(deleteError.message);

  await insertExercises(workoutId, form.exercises);
}

/**
 * Program day keys that meet GYM-11's 50% completion rule (AC20-24), derived
 * fresh from every saved exercise/set tagged with each program day rather
 * than a persisted flag — see the "derive over persist" note in project
 * memory. Aggregating across *all* saved workout rows for a given key (not
 * just the most recent) is what lets a later Resume session (AC29-31)
 * combine with an earlier partial save without any extra bookkeeping.
 */
export async function fetchCompletedProgramDayKeys(
  userId: string,
  programId: string
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("workouts")
    .select(
      "program_day_key, exercises(is_prescribed, sets(effort_type, effort_value, reps, duration_unit))"
    )
    .eq("user_id", userId)
    .eq("program_id", programId)
    .not("program_day_key", "is", null);

  if (error) throw new Error(error.message);

  const byKey = new Map<string, { prescribedComplete: number; anyComplete: boolean }>();
  for (const row of data ?? []) {
    const key = row.program_day_key as string;
    const entry = byKey.get(key) ?? { prescribedComplete: 0, anyComplete: false };
    for (const ex of row.exercises ?? []) {
      if ((ex.sets ?? []).some(isSetComplete)) {
        entry.anyComplete = true;
        if (ex.is_prescribed) entry.prescribedComplete += 1;
      }
    }
    byKey.set(key, entry);
  }

  const completed = new Set<string>();
  for (const [key, { prescribedComplete, anyComplete }] of byKey) {
    const ref = findProgramDay(programId, key);
    const total = ref ? prescribedExerciseCount(ref.day) : 0;
    // A 0-prescribed day (HIIT/rounds-only) has no ratio to compute — treat
    // any saved exercise as meeting the bar instead of dividing by zero.
    const meetsThreshold = total === 0 ? anyComplete : prescribedComplete / total >= 0.5;
    if (meetsThreshold) completed.add(key);
  }
  return completed;
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  const { error } = await supabase.from("workouts").delete().eq("id", workoutId);
  if (error) throw new Error(error.message);
}

async function insertExercises(workoutId: string, exercises: WorkoutFormData["exercises"]) {
  for (const exercise of exercises) {
    const { data: insertedExercise, error: exerciseError } = await supabase
      .from("exercises")
      .insert({ workout_id: workoutId, name: exercise.name, is_prescribed: exercise.isPrescribed ?? false })
      .select("id")
      .single();

    if (exerciseError) throw new Error(exerciseError.message);

    const setsPayload = exercise.sets.map((s) => ({
      exercise_id: insertedExercise.id,
      effort_type: s.effort_type,
      effort_value: s.effort_value,
      reps: s.reps,
      duration_unit: s.effort_type === "duration" ? (s.duration_unit ?? "min") : null,
    }));

    const { error: setsError } = await supabase.from("sets").insert(setsPayload);
    if (setsError) throw new Error(setsError.message);
  }
}
