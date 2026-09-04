import type { DurationUnit, EffortType } from "@/lib/types";

export const EFFORT_TYPE_OPTIONS: { value: EffortType; label: string }[] = [
  { value: "total_weight", label: "Total Weight" },
  { value: "weight_each", label: "Weight — Each" },
  { value: "bodyweight", label: "Bodyweight" },
  { value: "duration", label: "Duration" },
];

export const DURATION_UNIT_OPTIONS: { value: DurationUnit; label: string }[] = [
  { value: "min", label: "Min" },
  { value: "sec", label: "Sec" },
];

// Legacy sets were stored with effort_type "weight" (now Total Weight) or
// "duration" (unchanged). Normalize on read so old data still displays.
export function normalizeEffortType(raw: string): EffortType {
  if (raw === "weight") return "total_weight";
  if (
    raw === "total_weight" ||
    raw === "weight_each" ||
    raw === "bodyweight" ||
    raw === "duration"
  ) {
    return raw;
  }
  return "total_weight";
}
