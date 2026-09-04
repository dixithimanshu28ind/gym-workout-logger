"use client";

import { useState } from "react";
import type { ExerciseData, EffortType, WorkoutSectionData } from "@/lib/types";
import WorkoutTypeSelect from "@/components/WorkoutTypeSelect";
import Modal from "@/components/Modal";
import { OTHER_WORKOUT_TYPE } from "@/lib/workoutTypes";

interface WorkoutSectionProps {
  label: string;
  value: WorkoutSectionData;
  onChange: (value: WorkoutSectionData) => void;
  onRemove?: () => void;
}

const emptySet = () => ({ effort_type: "weight" as EffortType, effort_value: 0, reps: 0 });
const emptyExercise = (): ExerciseData => ({ name: "", sets: [emptySet()] });

export default function WorkoutSection({ label, value, onChange, onRemove }: WorkoutSectionProps) {
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleTypeChange = (type: string) => {
    onChange({
      ...value,
      workout_type: type,
      workout_type_custom: type === OTHER_WORKOUT_TYPE ? value.workout_type_custom : null,
    });
  };

  const addExercise = () =>
    onChange({ ...value, exercises: [...value.exercises, emptyExercise()] });

  const removeExercise = (idx: number) =>
    onChange({ ...value, exercises: value.exercises.filter((_, i) => i !== idx) });

  const updateExerciseName = (idx: number, name: string) =>
    onChange({
      ...value,
      exercises: value.exercises.map((ex, i) => (i === idx ? { ...ex, name } : ex)),
    });

  const addSet = (exIdx: number) =>
    onChange({
      ...value,
      exercises: value.exercises.map((ex, i) =>
        i === exIdx ? { ...ex, sets: [...ex.sets, emptySet()] } : ex
      ),
    });

  const removeSet = (exIdx: number, setIdx: number) =>
    onChange({
      ...value,
      exercises: value.exercises.map((ex, i) =>
        i === exIdx ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIdx) } : ex
      ),
    });

  const updateSet = (
    exIdx: number,
    setIdx: number,
    field: "effort_type" | "effort_value" | "reps",
    val: string | number
  ) =>
    onChange({
      ...value,
      exercises: value.exercises.map((ex, i) =>
        i === exIdx
          ? { ...ex, sets: ex.sets.map((s, j) => (j === setIdx ? { ...s, [field]: val } : s)) }
          : ex
      ),
    });

  const hasData = value.workout_type !== "" || value.exercises.length > 0;

  const requestRemove = () => {
    if (hasData) setConfirmRemove(true);
    else onRemove?.();
  };

  return (
    <div className="space-y-4 rounded-xl border border-card-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-500">{label}</h3>
        {onRemove && (
          <button
            type="button"
            onClick={requestRemove}
            className="text-sm text-red-600 hover:underline"
          >
            Remove Workout
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Workout Type</label>
        <WorkoutTypeSelect value={value.workout_type} onChange={handleTypeChange} />
      </div>

      {value.workout_type === OTHER_WORKOUT_TYPE && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Add your own workout type (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Boxing, Swimming, Yoga"
            value={value.workout_type_custom ?? ""}
            onChange={(e) => onChange({ ...value, workout_type_custom: e.target.value })}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent sm:w-1/2"
          />
        </div>
      )}

      {value.workout_type !== "" && (
        <div className="space-y-4">
          {value.exercises.map((ex, exIdx) => (
            <div key={exIdx} className="rounded-xl border border-card-border bg-background p-4 space-y-3">
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
                    <span className="text-xs text-neutral-500 w-12">Set {setIdx + 1}</span>
                    <select
                      value={s.effort_type}
                      onChange={(e) => updateSet(exIdx, setIdx, "effort_type", e.target.value)}
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
      )}

      {confirmRemove && (
        <Modal onClose={() => setConfirmRemove(false)} showCloseButton={false}>
          <p className="text-sm">Remove this workout?</p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => setConfirmRemove(false)}
              className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium hover:bg-background"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setConfirmRemove(false);
                onRemove?.();
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Remove
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
