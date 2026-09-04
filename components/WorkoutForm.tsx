"use client";

import { useState } from "react";
import type { WorkoutFormData, ExerciseData, EffortType } from "@/lib/types";
import WorkoutDatePicker from "@/components/WorkoutDatePicker";

interface WorkoutFormProps {
  date: string;
  onDateChange: (date: string) => void;
  loggedDates?: Set<string>;
  initialData?: Pick<WorkoutFormData, "workout_type" | "exercises">;
  onSubmit: (data: WorkoutFormData) => Promise<void>;
  submitLabel: string;
}

const emptySet = () => ({ effort_type: "weight" as EffortType, effort_value: 0, reps: 0 });
const emptyExercise = (): ExerciseData => ({ name: "", sets: [emptySet()] });

export default function WorkoutForm({
  date,
  onDateChange,
  loggedDates,
  initialData,
  onSubmit,
  submitLabel,
}: WorkoutFormProps) {
  const [workoutType, setWorkoutType] = useState(initialData?.workout_type ?? "");
  const [exercises, setExercises] = useState<ExerciseData[]>(
    initialData?.exercises ?? []
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addExercise = () => setExercises((prev) => [...prev, emptyExercise()]);

  const removeExercise = (idx: number) =>
    setExercises((prev) => prev.filter((_, i) => i !== idx));

  const updateExerciseName = (idx: number, name: string) =>
    setExercises((prev) =>
      prev.map((ex, i) => (i === idx ? { ...ex, name } : ex))
    );

  const addSet = (exIdx: number) =>
    setExercises((prev) =>
      prev.map((ex, i) => (i === exIdx ? { ...ex, sets: [...ex.sets, emptySet()] } : ex))
    );

  const removeSet = (exIdx: number, setIdx: number) =>
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === exIdx ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIdx) } : ex
      )
    );

  const updateSet = (
    exIdx: number,
    setIdx: number,
    field: "effort_type" | "effort_value" | "reps",
    value: string | number
  ) =>
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === exIdx
          ? {
              ...ex,
              sets: ex.sets.map((s, j) =>
                j === setIdx ? { ...s, [field]: value } : s
              ),
            }
          : ex
      )
    );

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!date) errs.push("Date is required.");
    if (!workoutType.trim()) errs.push("Workout type is required.");
    if (exercises.length === 0) errs.push("Add at least one exercise.");

    exercises.forEach((ex, i) => {
      if (!ex.name.trim()) errs.push(`Exercise ${i + 1}: name is required.`);
      if (ex.sets.length === 0) errs.push(`Exercise ${i + 1}: add at least one set.`);
      ex.sets.forEach((s, j) => {
        if (!(s.effort_value > 0))
          errs.push(`Exercise ${i + 1}, Set ${j + 1}: effort must be a positive number.`);
        if (!(s.reps > 0))
          errs.push(`Exercise ${i + 1}, Set ${j + 1}: reps must be a positive number.`);
      });
    });

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({ date, workout_type: workoutType.trim(), exercises });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <WorkoutDatePicker value={date} onChange={onDateChange} loggedDates={loggedDates} />
        </div>
        <div>
          <label htmlFor="workoutType" className="block text-sm font-medium mb-1">
            Workout Type
          </label>
          <input
            id="workoutType"
            type="text"
            placeholder="e.g. Push, Pull, Legs, Cardio"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="space-y-4">
        {exercises.map((ex, exIdx) => (
          <div key={exIdx} className="rounded-xl border border-card-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder={`Exercise ${exIdx + 1} name`}
                value={ex.name}
                onChange={(e) => updateExerciseName(exIdx, e.target.value)}
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                onClick={() => removeExercise(exIdx)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>

            <div className="space-y-2">
              {ex.sets.map((s, setIdx) => (
                <div key={setIdx} className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-neutral-500 w-12">
                    Set {setIdx + 1}
                  </span>
                  <select
                    value={s.effort_type}
                    onChange={(e) =>
                      updateSet(exIdx, setIdx, "effort_type", e.target.value)
                    }
                    className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                  >
                    <option value="weight">Weight</option>
                    <option value="duration">Duration</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder={s.effort_type === "weight" ? "kg" : "min"}
                    value={s.effort_value || ""}
                    onChange={(e) =>
                      updateSet(exIdx, setIdx, "effort_value", Number(e.target.value))
                    }
                    className="w-24 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="reps"
                    value={s.reps || ""}
                    onChange={(e) => updateSet(exIdx, setIdx, "reps", Number(e.target.value))}
                    className="w-20 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeSet(exIdx, setIdx)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSet(exIdx)}
                className="text-sm font-medium text-neutral-700 hover:underline"
              >
                + Add Set
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addExercise}
          className="w-full rounded-lg border border-dashed border-accent py-2.5 text-sm font-medium text-neutral-700 hover:bg-accent/10 transition"
        >
          + Add Exercise
        </button>
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <ul className="text-sm text-red-700 list-disc list-inside space-y-0.5">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-accent text-accent-foreground font-medium py-2.5 hover:opacity-90 transition disabled:opacity-50"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
