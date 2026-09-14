"use client";

import { useEffect, useState } from "react";
import { useRowLabel } from "@payloadcms/ui";

type PopulatedTarget = { name?: string };
type PopulatedExercise = { name?: string; primaryTarget?: number | PopulatedTarget | string };

type ItemData = {
  distanceUnit?: string;
  distanceValue?: number;
  durationUnit?: string;
  durationValue?: number;
  exercise?: number | PopulatedExercise | string;
  fixedReps?: number;
  maxRestSec?: number;
  maxReps?: number;
  minRestSec?: number;
  minReps?: number;
  perSide?: boolean;
  perSideLabel?: string;
  prescriptionType?: string;
  sets?: number;
};

// Nested row data (block > array > array > array) only carries the bare
// relationship id, not the populated doc, so resolve it ourselves and
// cache across row instances to avoid refetching the same exercise.
const exerciseCache = new Map<string, PopulatedExercise | null>();

function useResolvedExercise(exercise: ItemData["exercise"]): PopulatedExercise | undefined {
  const isPopulated = typeof exercise === "object" && exercise !== null;
  const id = isPopulated ? undefined : exercise;
  const [resolved, setResolved] = useState<PopulatedExercise | null | undefined>(
    id != null ? exerciseCache.get(String(id)) : undefined
  );

  useEffect(() => {
    if (id == null) return;
    const key = String(id);
    const cached = exerciseCache.get(key);
    if (cached !== undefined) {
      setResolved(cached);
      return;
    }
    let cancelled = false;
    fetch(`/api/payload/exercises/${key}?depth=1`)
      .then((res) => (res.ok ? res.json() : null))
      .then((doc: PopulatedExercise | null) => {
        exerciseCache.set(key, doc);
        if (!cancelled) setResolved(doc);
      })
      .catch(() => {
        if (!cancelled) setResolved(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isPopulated) return exercise as PopulatedExercise;
  return resolved ?? undefined;
}

function formatPrescription(data: ItemData): string | undefined {
  const suffix = data.perSide ? `/${data.perSideLabel || "side"}` : "";
  switch (data.prescriptionType) {
    case "fixed":
      return data.fixedReps != null ? `${data.fixedReps} reps${suffix}` : undefined;
    case "range":
      return data.minReps != null && data.maxReps != null
        ? `${data.minReps}–${data.maxReps} reps${suffix}`
        : undefined;
    case "time":
      return data.durationValue != null ? `${data.durationValue} ${data.durationUnit || "sec"}${suffix}` : undefined;
    case "distance":
      return data.distanceValue != null ? `${data.distanceValue} ${data.distanceUnit || "m"}${suffix}` : undefined;
    case "until_comfortable":
      return "Until comfortable";
    case "custom":
      return "Custom";
    default:
      return undefined;
  }
}

function formatRest(data: ItemData): string | undefined {
  const { minRestSec, maxRestSec } = data;
  if (minRestSec == null && maxRestSec == null) return undefined;
  const toLabel = (sec: number) => (sec % 60 === 0 && sec >= 120 ? `${sec / 60} min` : `${sec} sec`);
  if (minRestSec != null && maxRestSec != null && minRestSec !== maxRestSec) {
    return `Rest ${toLabel(minRestSec)}–${toLabel(maxRestSec)}`;
  }
  const single = minRestSec ?? maxRestSec;
  return single != null ? `Rest ${toLabel(single)}` : undefined;
}

export function ProgramExerciseItemRowLabel() {
  const { data } = useRowLabel<ItemData>();
  const exercise = useResolvedExercise(data?.exercise);

  const exerciseName = exercise?.name;
  const target = typeof exercise?.primaryTarget === "object" ? exercise.primaryTarget?.name : undefined;

  const title = exerciseName || "Select an exercise";
  const sets = data?.sets;
  const prescription = formatPrescription(data ?? {});
  const rest = formatRest(data ?? {});

  const parts = [
    target,
    sets != null && prescription ? `${sets} × ${prescription}` : prescription,
    rest,
  ].filter(Boolean);

  return (
    <span>
      {title}
      {parts.length > 0 ? ` — ${parts.join(" · ")}` : ""}
    </span>
  );
}
