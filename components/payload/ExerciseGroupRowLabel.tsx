"use client";

import { useRowLabel } from "@payloadcms/ui";

type ExerciseGroupData = {
  items?: unknown[];
  name?: string;
  workoutType?: string;
};

export function ExerciseGroupRowLabel() {
  const { data } = useRowLabel<ExerciseGroupData>();

  const title = data?.name || data?.workoutType || "Untitled Group";
  const count = data?.items?.length ?? 0;

  return (
    <span>
      {title} — {count} exercise{count === 1 ? "" : "s"}
    </span>
  );
}
