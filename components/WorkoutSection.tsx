"use client";

import { useState } from "react";
import type { DurationUnit, EffortType, ExerciseData, SetData, WorkoutSectionData } from "@/lib/types";
import WorkoutTypeSelect from "@/components/WorkoutTypeSelect";
import Modal from "@/components/Modal";
import { CollapsibleSection } from "@/components/ProgramPlan";
import { OTHER_WORKOUT_TYPE, REST_DAY_WORKOUT_TYPE } from "@/lib/workoutTypes";
import { DURATION_UNIT_OPTIONS, EFFORT_TYPE_OPTIONS } from "@/lib/effortTypes";
import { isExerciseComplete } from "@/lib/workoutCompletion";

interface WorkoutSectionProps {
  value: WorkoutSectionData;
  onChange: (value: WorkoutSectionData) => void;
  onRemove?: () => void;
  isOpen: boolean;
  onToggle: () => void;
  autoFocusType?: boolean;
  allowedTypes?: readonly string[];
}

const emptySet = (): SetData => ({ effort_type: "total_weight", effort_value: 0, reps: 0 });
const emptyExercise = (): ExerciseData => ({ name: "", sets: [emptySet()] });

export default function WorkoutSection({
  value,
  onChange,
  onRemove,
  isOpen,
  onToggle,
  autoFocusType,
  allowedTypes,
}: WorkoutSectionProps) {
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [blockedRestDayChange, setBlockedRestDayChange] = useState(false);

  const handleTypeChange = (type: string) => {
    if (type === REST_DAY_WORKOUT_TYPE && value.exercises.length > 0) {
      setBlockedRestDayChange(true);
      return;
    }
    onChange({
      ...value,
      workout_type: type,
      workout_type_custom: type === OTHER_WORKOUT_TYPE ? value.workout_type_custom : null,
      exercises: type === REST_DAY_WORKOUT_TYPE ? [] : value.exercises,
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
      exercises: value.exercises.map((ex, i) => {
        if (i !== exIdx) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const nextSet: SetData = lastSet
          ? {
              effort_type: lastSet.effort_type,
              effort_value: 0,
              reps: 0,
              duration_unit:
                lastSet.effort_type === "duration" ? lastSet.duration_unit ?? "min" : undefined,
            }
          : emptySet();
        return { ...ex, sets: [...ex.sets, nextSet] };
      }),
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
    field: "effort_value" | "reps" | "duration_unit",
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

  const toggleAlternative = (exIdx: number) =>
    onChange({
      ...value,
      exercises: value.exercises.map((ex, i) => {
        if (i !== exIdx || !ex.altToggle) return ex;
        const alt = ex.altToggle;
        const switchingTo = alt.usingAlternative ? alt.originalMeasurementType : alt.alternativeMeasurementType;
        return {
          ...ex,
          name: alt.usingAlternative ? alt.originalName : alt.alternativeName,
          altToggle: { ...alt, usingAlternative: !alt.usingAlternative },
          sets: ex.sets.map((s) => ({
            ...s,
            effort_type: switchingTo,
            duration_unit: switchingTo === "duration" ? s.duration_unit ?? "min" : s.duration_unit,
          })),
        };
      }),
    });

  const updateSetType = (exIdx: number, setIdx: number, effortType: EffortType) =>
    onChange({
      ...value,
      exercises: value.exercises.map((ex, i) =>
        i === exIdx
          ? {
              ...ex,
              sets: ex.sets.map((s, j) =>
                j === setIdx
                  ? {
                      ...s,
                      effort_type: effortType,
                      duration_unit:
                        effortType === "duration" ? s.duration_unit ?? "min" : s.duration_unit,
                    }
                  : s
              ),
            }
          : ex
      ),
    });

  const hasData = value.workout_type !== "" || value.exercises.length > 0;

  const requestRemove = () => {
    if (hasData) setConfirmRemove(true);
    else onRemove?.();
  };

  const displayType =
    value.workout_type === OTHER_WORKOUT_TYPE && value.workout_type_custom
      ? value.workout_type_custom
      : value.workout_type;
  const summaryLabel =
    value.workout_type === ""
      ? "New Workout"
      : `${displayType} · ${value.exercises.length} exercise${value.exercises.length === 1 ? "" : "s"}`;

  return (
    <CollapsibleSection title={summaryLabel} isOpen={isOpen} onToggle={onToggle} allowOverflow>
      <div className="space-y-4">
        {onRemove && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={requestRemove}
              className="text-sm text-red-600 hover:underline"
            >
              Remove Workout
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Workout Type</label>
          <WorkoutTypeSelect
            value={value.workout_type}
            onChange={handleTypeChange}
            autoFocus={autoFocusType}
            allowedTypes={allowedTypes}
          />
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

        {value.workout_type === REST_DAY_WORKOUT_TYPE && (
          <div className="rounded-xl border border-card-border bg-background p-4 space-y-2">
            <p className="font-medium">Enjoy your Rest Day 🙌</p>
            <p className="text-sm text-neutral-600">
              Recovery is an important part of training. It gives your body time to recover and
              prepare for your next workout.
            </p>
            <p className="text-sm text-neutral-600">
              Doing some light activity? You can still add Cardio, Mobility / Recovery, or Other
              for activities such as an easy walk, stretching or yoga.
            </p>
          </div>
        )}

        {value.workout_type !== "" && value.workout_type !== REST_DAY_WORKOUT_TYPE && (
        <div className="space-y-4">
          {value.exercises.map((ex, exIdx) => (
            <div key={exIdx} className="rounded-xl border border-card-border bg-background p-4 space-y-3">
              <div className="flex items-center gap-3">
                {ex.prescribedIndex != null && (
                  <span
                    aria-label={isExerciseComplete(ex) ? "Completed" : "Not yet completed"}
                    className={`shrink-0 text-sm ${
                      isExerciseComplete(ex) ? "text-green-600" : "text-neutral-400"
                    }`}
                  >
                    {isExerciseComplete(ex) ? "✓" : "○"}
                  </span>
                )}
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

              {ex.targetLabel && (
                <p className="text-xs text-neutral-500">Target: {ex.targetLabel}</p>
              )}

              {ex.altToggle && (
                <p className="text-xs text-neutral-500">
                  {ex.altToggle.usingAlternative ? (
                    <>Using alternative for {ex.altToggle.originalName}</>
                  ) : (
                    <>Alternative: {ex.altToggle.alternativeName}</>
                  )}{" "}
                  <button
                    type="button"
                    onClick={() => toggleAlternative(exIdx)}
                    className="font-medium text-accent hover:underline"
                  >
                    {ex.altToggle.usingAlternative ? "Use Original" : "Use Alternative"}
                  </button>
                </p>
              )}

              <div className="space-y-2">
                {ex.sets.map((s, setIdx) => (
                  <div key={setIdx} className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-neutral-500 w-12">Set {setIdx + 1}</span>
                    <select
                      value={s.effort_type}
                      onChange={(e) =>
                        updateSetType(exIdx, setIdx, e.target.value as EffortType)
                      }
                      className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                    >
                      {EFFORT_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {(s.effort_type === "total_weight" || s.effort_type === "weight_each") && (
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="kg"
                        value={s.effort_value || ""}
                        onChange={(e) =>
                          updateSet(exIdx, setIdx, "effort_value", Number(e.target.value))
                        }
                        className="w-24 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                      />
                    )}

                    {s.effort_type === "duration" && (
                      <>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          placeholder="duration"
                          value={s.effort_value || ""}
                          onChange={(e) =>
                            updateSet(exIdx, setIdx, "effort_value", Number(e.target.value))
                          }
                          className="w-24 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                        />
                        <select
                          value={s.duration_unit ?? "min"}
                          onChange={(e) =>
                            updateSet(exIdx, setIdx, "duration_unit", e.target.value as DurationUnit)
                          }
                          className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                        >
                          {DURATION_UNIT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </>
                    )}

                    {s.effort_type !== "duration" && (
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="reps"
                        value={s.reps || ""}
                        onChange={(e) => updateSet(exIdx, setIdx, "reps", Number(e.target.value))}
                        className="w-20 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                      />
                    )}

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

      {blockedRestDayChange && (
        <Modal onClose={() => setBlockedRestDayChange(false)} showCloseButton={false}>
          <p className="font-medium">Remove exercises first</p>
          <p className="mt-2 text-sm text-neutral-600">
            Rest Day cannot contain exercises. Please remove the exercises from this workout
            before changing it to Rest Day.
          </p>
          <div className="mt-5 flex justify-end">
            <button
              onClick={() => setBlockedRestDayChange(false)}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              Got it
            </button>
          </div>
        </Modal>
      )}
      </div>
    </CollapsibleSection>
  );
}
