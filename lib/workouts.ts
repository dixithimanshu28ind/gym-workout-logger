import { supabase } from "@/lib/supabaseClient";
import type { WorkoutFormData, WorkoutSummary } from "@/lib/types";

export async function fetchWorkoutSummaries(userId: string): Promise<WorkoutSummary[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("id, date, workout_type, exercises(id)")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((w) => ({
    id: w.id,
    date: w.date,
    workout_type: w.workout_type,
    exerciseCount: Array.isArray(w.exercises) ? w.exercises.length : 0,
  }));
}

export async function fetchWorkoutDetail(
  workoutId: string
): Promise<WorkoutFormData & { id: string }> {
  const { data, error } = await supabase
    .from("workouts")
    .select("id, date, workout_type, exercises(id, name, sets(id, effort_type, effort_value, reps))")
    .eq("id", workoutId)
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    date: data.date,
    workout_type: data.workout_type,
    exercises: (data.exercises ?? []).map((ex) => ({
      id: ex.id,
      name: ex.name,
      sets: (ex.sets ?? []).map((s) => ({
        id: s.id,
        effort_type: s.effort_type,
        effort_value: s.effort_value,
        reps: s.reps,
      })),
    })),
  };
}

export async function createWorkout(userId: string, form: WorkoutFormData): Promise<string> {
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .insert({ user_id: userId, date: form.date, workout_type: form.workout_type })
    .select("id")
    .single();

  if (workoutError) throw new Error(workoutError.message);

  await insertExercises(workout.id, form.exercises);

  return workout.id;
}

export async function updateWorkout(workoutId: string, form: WorkoutFormData): Promise<void> {
  const { error: updateError } = await supabase
    .from("workouts")
    .update({ date: form.date, workout_type: form.workout_type })
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
    }));

    const { error: setsError } = await supabase.from("sets").insert(setsPayload);
    if (setsError) throw new Error(setsError.message);
  }
}
