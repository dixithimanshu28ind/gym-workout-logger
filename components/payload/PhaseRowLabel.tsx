"use client";

import { useRowLabel } from "@payloadcms/ui";

type ExerciseItem = { enabled?: boolean };
type ExerciseGroup = { items?: ExerciseItem[] };
type Day = { enabled?: boolean; exerciseGroups?: ExerciseGroup[] };

type PhaseData = {
  contentMode?: "create" | "info" | "reuse";
  days?: Day[];
  displayTitle?: string;
  name?: string;
  phaseKey?: string;
  sourcePhaseKey?: string;
};

const CONTENT_MODE_LABEL: Record<string, string> = {
  create: "Create",
  info: "Info Only",
  reuse: "Reuse",
};

export function PhaseRowLabel() {
  const { data } = useRowLabel<PhaseData>();

  const title = data?.displayTitle || data?.name || data?.phaseKey || "Untitled Phase";
  const modeLabel = data?.contentMode ? CONTENT_MODE_LABEL[data.contentMode] : undefined;

  let detail: string;
  if (data?.contentMode === "reuse") {
    detail = data?.sourcePhaseKey ? `Reuses "${data.sourcePhaseKey}"` : "Reuse (no source set)";
  } else if (data?.contentMode === "create") {
    const days = data?.days ?? [];
    const exerciseCount = days.reduce(
      (dayTotal, day) =>
        dayTotal +
        (day.exerciseGroups ?? []).reduce(
          (groupTotal, group) => groupTotal + (group.items?.length ?? 0),
          0
        ),
      0
    );
    detail = `${days.length} day${days.length === 1 ? "" : "s"} · ${exerciseCount} exercise${exerciseCount === 1 ? "" : "s"}`;
  } else {
    detail = "Information only";
  }

  return (
    <span>
      {title}
      {modeLabel ? ` · ${modeLabel}` : ""} — {detail}
    </span>
  );
}
