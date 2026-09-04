import { supabase } from "@/lib/supabaseClient";
import type { WorkoutFormData, WorkoutSummary } from "@/lib/types";
import { normalizeEffortType } from "@/lib/effortTypes";

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
      "id, date, workout_type, workout_type_custom, program_id, program_day_key, exercises(id, name, sets(id, effort_type, effort_value, reps, duration_unit))"
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
 * Program day keys that already have at least one saved workout for this
 * user + program. GYM-11 Pass 1 treats a program day as "done" purely on
 * this existence check (no partial-completion percentage yet — see
 * lib/programProgress.ts).
 */
export async function fetchCompletedProgramDayKeys(
  userId: string,
  programId: string
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("workouts")
    .select("program_day_key")
    .eq("user_id", userId)
    .eq("program_id", programId)
    .not("program_day_key", "is", null);

  if (error) throw new Error(error.message);

  return new Set((data ?? []).map((w) => w.program_day_key as string));
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  const { error } = await supabase.from("workouts").delete().eq("id", workoutId);
  if (error) throw new Error(error.message);
}

async function insertExercises(workoutId: string, exercises: WorkoutFormData["exercises"]) {
  for (const exercise of exercises) {
    const { data: insertedExercise, error: exerciseError } = await supabase
      .from("exercises")
      .insert({ workout_id: workoutId, name: exercise.name })
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
