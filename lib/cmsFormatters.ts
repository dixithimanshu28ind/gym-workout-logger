/**
 * Canonical display formatters shared by the CMS adapter (lib/cmsAdapter.ts)
 * and, eventually, the mobile app's own API consumer. These must reproduce
 * today's hardcoded lib/programDetails.ts strings exactly — that's what the
 * golden test (scripts/golden-test.ts) checks.
 */

export type StoredPrescription =
  | { prescriptionType: "range"; minReps?: number | null; maxReps?: number | null }
  | { prescriptionType: "fixed"; fixedReps?: number | null }
  | { prescriptionType: "time"; durationValue?: number | null; durationUnit?: string | null }
  | { prescriptionType: "distance"; distanceValue?: number | null; distanceUnit?: string | null }
  | { prescriptionType: "until_comfortable" }
  | { prescriptionType: "custom"; customText?: string };

/** "8–12 reps", "10–12/side" (no "reps" word when per-side), "30 sec" */
export function formatPrescription(
  p: StoredPrescription,
  perSide: boolean | null | undefined,
  perSideLabel: string | null | undefined
): string {
  const suffix = perSide ? `/${perSideLabel || "side"}` : "";
  switch (p.prescriptionType) {
    case "range": {
      if (p.minReps == null || p.maxReps == null) return "";
      return perSide ? `${p.minReps}–${p.maxReps}${suffix}` : `${p.minReps}–${p.maxReps} reps${suffix}`;
    }
    case "fixed": {
      if (p.fixedReps == null) return "";
      return perSide ? `${p.fixedReps}${suffix}` : `${p.fixedReps} reps${suffix}`;
    }
    case "time": {
      if (p.durationValue == null) return "";
      return `${p.durationValue} ${p.durationUnit || "sec"}${suffix}`;
    }
    case "distance": {
      if (p.distanceValue == null) return "";
      return `${p.distanceValue} ${p.distanceUnit || "m"}${suffix}`;
    }
    case "until_comfortable":
      return "Until comfortable";
    case "custom":
      // The raw original text (including any /side suffix) was preserved
      // verbatim at seed time — no need to reconstruct the suffix here.
      return p.customText ?? "";
    default:
      return "";
  }
}

function isMinuteValue(sec: number): boolean {
  return sec % 60 === 0 && sec >= 120;
}

function toRestLabel(sec: number): string {
  return isMinuteValue(sec) ? `${sec / 60} min` : `${sec} sec`;
}

/** "2 min", "90 sec", "60–90 sec", "2–3 min" — a range shares one trailing unit. */
export function formatRest(minRestSec: number | null | undefined, maxRestSec: number | null | undefined): string {
  if (minRestSec == null) return "";
  if (maxRestSec != null && maxRestSec !== minRestSec) {
    if (isMinuteValue(minRestSec) && isMinuteValue(maxRestSec)) {
      return `${minRestSec / 60}–${maxRestSec / 60} min`;
    }
    return `${minRestSec}–${maxRestSec} sec`;
  }
  return toRestLabel(minRestSec);
}

/**
 * "8–12" / "10/leg" — the sets×reps table cell omits the "reps" word (unlike
 * formatPrescription's standalone targetReps, e.g. "8–12 reps"); duration,
 * distance and custom prescriptions keep their unit either way.
 */
export function formatSetsRepsPrescription(
  p: StoredPrescription,
  perSide: boolean | null | undefined,
  perSideLabel: string | null | undefined
): string {
  const suffix = perSide ? `/${perSideLabel || "side"}` : "";
  switch (p.prescriptionType) {
    case "range":
      return p.minReps == null || p.maxReps == null ? "" : `${p.minReps}–${p.maxReps}${suffix}`;
    case "fixed":
      return p.fixedReps == null ? "" : `${p.fixedReps}${suffix}`;
    default:
      return formatPrescription(p, perSide, perSideLabel);
  }
}
