"use client";

import { useRowLabel } from "@payloadcms/ui";

type ExerciseGroup = { items?: unknown[] };

type DayData = {
  dayName?: string;
  dayNumber?: number;
  displayTitle?: string;
  exerciseGroups?: ExerciseGroup[];
};

export function DayRowLabel() {
  const { data } = useRowLabel<DayData>();

  const title =
    data?.displayTitle ||
    (data?.dayNumber != null && data?.dayName ? `Day ${data.dayNumber} — ${data.dayName}` : data?.dayName) ||
    "Untitled Day";

  const groups = data?.exerciseGroups ?? [];
  const exerciseCount = groups.reduce((sum, g) => sum + (g.items?.length ?? 0), 0);

  return (
    <span>
      {title} — {groups.length} group{groups.length === 1 ? "" : "s"} · {exerciseCount} exercise
      {exerciseCount === 1 ? "" : "s"}
    </span>
  );
}
