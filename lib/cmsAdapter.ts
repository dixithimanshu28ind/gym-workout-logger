/**
 * Converts a populated CMS Program doc (fetched with depth >= 2, so
 * exercise/target relationships are real objects, not bare ids) into the
 * app's existing `Program` + `ProgramDetail` shapes (lib/types.ts).
 *
 * This is the inverse of scripts/seed-programs.ts. Its output must exactly
 * match today's hardcoded lib/programs.ts / lib/programDetails.ts for the 3
 * real programs — that equivalence is what scripts/golden-test.ts checks.
 *
 * Local, loosely-typed interfaces are used for the CMS shapes read here
 * (rather than payload-types.ts's deeply nested anonymous union types) for
 * readability; Program/ProgramDetail (the output) are the real app types.
 */
import type {
  DeloadBlock,
  EffortType,
  ExerciseGroup as LegacyExerciseGroup,
  ExerciseRow,
  HiitDetail,
  Program as LegacyProgram,
  ProgramDay,
  ProgramDetail as LegacyProgramDetail,
  ProgramWeekBlock,
  TrainingBlock,
} from "@/lib/types";
import { richTextToBullets, richTextToParagraphs, richTextToString, type LexicalRichText } from "@/lib/cmsRichText";
import { formatPrescription, formatRest, formatSetsRepsPrescription, type StoredPrescription } from "@/lib/cmsFormatters";

type CmsTarget = { id: number; name: string };
type CmsExercise = {
  id: number;
  name: string;
  targets: (number | CmsTarget)[];
  defaultMeasurementType: EffortType;
};

type CmsItem = {
  exercise: number | CmsExercise;
  measurementType?: EffortType | null;
  sets?: number | null;
  prescriptionType?: string | null;
  minReps?: number | null;
  maxReps?: number | null;
  fixedReps?: number | null;
  durationValue?: number | null;
  durationUnit?: string | null;
  distanceValue?: number | null;
  distanceUnit?: string | null;
  customPrescription?: LexicalRichText;
  perSide?: boolean | null;
  perSideLabel?: string | null;
  minRestSec?: number | null;
  maxRestSec?: number | null;
  alternatives?: (number | CmsExercise)[] | null;
};

type CmsGroup = {
  name: string;
  workoutType?: string | null;
  items: CmsItem[];
};

type CmsIntervalRound = {
  label: string;
  warmUp?: string | null;
  hardEffort: string;
  recovery: string;
  repeat: string;
  note?: string | null;
};

type CmsIntervals =
  | { intro?: LexicalRichText; rounds?: CmsIntervalRound[] | null; coolDown?: string | null }
  | null
  | undefined;

type CmsDay = {
  dayNumber: number;
  dayName: string;
  displayTitle?: string | null;
  description?: LexicalRichText;
  exerciseGroups?: CmsGroup[] | null;
  intervals?: CmsIntervals;
  progressionNote?: LexicalRichText;
};

type CmsDayOverride = {
  dayNumber: number;
  excluded?: boolean | null;
  notes?: LexicalRichText;
};

type CmsPhaseBlock = {
  blockType: "phase";
  phaseKey: string;
  name: string;
  displayTitle?: string | null;
  contentMode: "create" | "reuse" | "info";
  description?: LexicalRichText;
  days?: CmsDay[] | null;
  sourcePhaseKey?: string | null;
  setsScale?: number | null;
  dayOverrides?: CmsDayOverride[] | null;
};

type CmsWarmUpBlock = {
  blockType: "warmUp";
  title: string;
  description?: LexicalRichText;
  items?: { textContent?: LexicalRichText }[] | null;
  extraInfo?: LexicalRichText;
};

type CmsCoolDownBlock = {
  blockType: "coolDown";
  title: string;
  description?: LexicalRichText;
  extraInfo?: LexicalRichText;
};

type CmsSafetyBlock = {
  blockType: "safety";
  title: string;
  safetyContent?: LexicalRichText;
};

type CmsSection = CmsPhaseBlock | CmsWarmUpBlock | CmsCoolDownBlock | CmsSafetyBlock | { blockType: string };

export type CmsProgramDoc = {
  slug: string;
  name: string;
  subtitle?: string | null;
  shortDescription?: LexicalRichText;
  fullDescription?: LexicalRichText;
  weeks: number;
  daysPerWeek: number;
  sessionMinutes?: number | null;
  sections?: CmsSection[] | null;
};

function asPopulated<T extends { id: number }>(value: number | T | null | undefined, what: string): T {
  if (value == null || typeof value === "number") {
    throw new Error(`Expected a populated ${what} (fetch with depth >= 2), got a bare id`);
  }
  return value;
}

function targetNames(exercise: CmsExercise): string {
  return exercise.targets.map((t) => asPopulated(t, "target").name).join(" + ");
}

function toStoredPrescription(item: CmsItem): StoredPrescription {
  if (item.prescriptionType === "custom") {
    return { prescriptionType: "custom", customText: richTextToString(item.customPrescription) };
  }
  return {
    prescriptionType: item.prescriptionType,
    minReps: item.minReps,
    maxReps: item.maxReps,
    fixedReps: item.fixedReps,
    durationValue: item.durationValue,
    durationUnit: item.durationUnit,
    distanceValue: item.distanceValue,
    distanceUnit: item.distanceUnit,
  } as StoredPrescription;
}

function buildExerciseRow(item: CmsItem, setsScale = 1): ExerciseRow {
  const exercise = asPopulated(item.exercise, "exercise");
  const target = targetNames(exercise);
  const stored = toStoredPrescription(item);
  const targetReps = formatPrescription(stored, item.perSide, item.perSideLabel);
  const setsRepsPrescription = formatSetsRepsPrescription(stored, item.perSide, item.perSideLabel);
  const rawSets = item.sets ?? undefined;
  // Deload phases scale down set counts (e.g. 0.5×) — round up, minimum 1,
  // matching the CMS field's own documented prefill rule.
  const sets = rawSets != null ? Math.max(1, Math.ceil(rawSets * setsScale)) : undefined;
  const setsReps = sets != null ? `${sets} × ${setsRepsPrescription}` : setsRepsPrescription;
  const rest = formatRest(item.minRestSec, item.maxRestSec);
  const firstAlt = item.alternatives?.[0];
  const alternative = firstAlt != null ? asPopulated(firstAlt, "alternative exercise").name : "—";
  const measurementType = item.measurementType ?? exercise.defaultMeasurementType;

  return {
    exercise: exercise.name,
    target,
    setsReps,
    sets,
    targetReps,
    measurementType,
    rest,
    alternative,
  };
}

function buildGroup(group: CmsGroup, showHeading: boolean, setsScale = 1): LegacyExerciseGroup {
  return {
    heading: showHeading ? group.name : undefined,
    workoutType: group.workoutType ?? undefined,
    exercises: group.items.map((item) => buildExerciseRow(item, setsScale)),
  };
}

function buildHiit(intervals: CmsIntervals): HiitDetail | undefined {
  const rounds = intervals?.rounds ?? [];
  if (rounds.length === 0) return undefined;
  return {
    intro: richTextToParagraphs(intervals?.intro),
    rounds: rounds.map((r) => ({
      label: r.label,
      warmUp: r.warmUp ?? undefined,
      hardEffort: r.hardEffort,
      easyCycling: r.recovery,
      repeat: r.repeat,
      note: r.note ?? undefined,
    })),
    coolDown: intervals?.coolDown ?? "",
  };
}

function buildDay(day: CmsDay, setsScale = 1): ProgramDay {
  const groups = day.exerciseGroups ?? [];
  const showHeading = groups.length > 1;
  return {
    day: day.dayNumber,
    title: day.displayTitle || `Day ${day.dayNumber} — ${day.dayName}`,
    note: richTextToString(day.description),
    groups: groups.length > 0 ? groups.map((g) => buildGroup(g, showHeading, setsScale)) : undefined,
    hiit: buildHiit(day.intervals),
    progressionNote: richTextToString(day.progressionNote),
  };
}

/**
 * A reuse-mode (deload) phase's loggable days: the source phase's days,
 * scaled sets and with dayOverrides applied (excluded days dropped, notes
 * appended). " (Deload)" is appended to each day's title since the
 * "Choose a program workout" picker lists every phase's days in one flat
 * list, where an unmodified title would be indistinguishable from the
 * source day it was copied from.
 */
function buildDeloadDays(phase: CmsPhaseBlock, sourcePhase: CmsPhaseBlock | undefined): ProgramDay[] | undefined {
  if (!sourcePhase?.days || sourcePhase.days.length === 0) return undefined;
  const setsScale = phase.setsScale ?? 1;
  const overridesByDay = new Map((phase.dayOverrides ?? []).map((o) => [o.dayNumber, o]));

  const days: ProgramDay[] = [];
  for (const sourceDay of sourcePhase.days) {
    const override = overridesByDay.get(sourceDay.dayNumber);
    if (override?.excluded) continue;

    const built = buildDay(sourceDay, setsScale);
    const overrideNote = richTextToString(override?.notes);
    days.push({
      ...built,
      title: `${built.title} (Deload)`,
      note: [built.note, overrideNote].filter(Boolean).join(" ") || undefined,
    });
  }
  return days.length > 0 ? days : undefined;
}

function buildWeekBlock(phase: CmsPhaseBlock, phaseByKey: Map<string, CmsPhaseBlock>): ProgramWeekBlock {
  const title = phase.displayTitle || phase.name;
  if (phase.contentMode === "reuse") {
    const sourcePhase = phase.sourcePhaseKey ? phaseByKey.get(phase.sourcePhaseKey) : undefined;
    const block: DeloadBlock = {
      kind: "deload",
      id: phase.phaseKey,
      title,
      body: richTextToParagraphs(phase.description),
      days: buildDeloadDays(phase, sourcePhase),
    };
    return block;
  }
  const block: TrainingBlock = {
    kind: "training",
    id: phase.phaseKey,
    title,
    intro: richTextToString(phase.description),
    days: (phase.days ?? []).map((d) => buildDay(d)),
  };
  return block;
}

function isPhaseBlock(s: CmsSection): s is CmsPhaseBlock {
  return s.blockType === "phase";
}

function buildSchedule(firstTrainingPhase: CmsPhaseBlock | undefined): LegacyProgram["schedule"] {
  const byNumber = new Map((firstTrainingPhase?.days ?? []).map((d) => [d.dayNumber, d.dayName]));
  const schedule: LegacyProgram["schedule"] = [];
  for (let day = 1; day <= 7; day++) {
    schedule.push({ day, focus: byNumber.get(day) ?? "Rest" });
  }
  return schedule;
}

export function adaptCmsProgram(doc: CmsProgramDoc): { program: LegacyProgram; detail: LegacyProgramDetail } {
  const sections = doc.sections ?? [];
  const warmUpBlock = sections.find((s): s is CmsWarmUpBlock => s.blockType === "warmUp");
  const coolDownBlock = sections.find((s): s is CmsCoolDownBlock => s.blockType === "coolDown");
  const safetyBlock = sections.find((s): s is CmsSafetyBlock => s.blockType === "safety");
  const phaseBlocks = sections.filter(isPhaseBlock);
  const phaseByKey = new Map(phaseBlocks.map((p) => [p.phaseKey, p]));
  const firstTrainingPhase = phaseBlocks.find((p) => p.contentMode === "create");

  const program: LegacyProgram = {
    id: doc.slug,
    name: doc.name,
    subtitle: doc.subtitle ?? "",
    description: richTextToString(doc.shortDescription) ?? "",
    durationWeeks: doc.weeks,
    daysPerWeek: doc.daysPerWeek,
    sessionMinutes: doc.sessionMinutes ?? 0,
    schedule: buildSchedule(firstTrainingPhase),
  };

  const detail: LegacyProgramDetail = {
    id: doc.slug,
    whatIsIt: richTextToParagraphs(doc.fullDescription),
    warmUp: {
      title: warmUpBlock?.title ?? "Warm-Up",
      intro: richTextToString(warmUpBlock?.description),
      bullets: (warmUpBlock?.items ?? []).map((i) => richTextToString(i.textContent) ?? "").filter(Boolean),
      note: richTextToString(warmUpBlock?.extraInfo),
    },
    weekBlocks: phaseBlocks.map((p) => buildWeekBlock(p, phaseByKey)),
    coolDown: {
      title: coolDownBlock?.title ?? "Cool-Down",
      intro: richTextToString(coolDownBlock?.description),
      note: richTextToString(coolDownBlock?.extraInfo),
    },
    safetyNote: {
      title: safetyBlock?.title ?? "Safety",
      bullets: richTextToBullets(safetyBlock?.safetyContent),
    },
  };

  return { program, detail };
}
