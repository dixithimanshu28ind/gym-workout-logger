/**
 * Seeds the 3 real programs (bro-split, pplul, full-body) into Payload CMS
 * from the existing hardcoded lib/programs.ts / lib/programDetails.ts.
 *
 * Idempotent: Targets and Exercises are skipped if a doc with the same
 * name already exists. Programs are deleted-and-recreated by slug on each
 * run, so re-running after a script change picks up the fix.
 *
 * Run with: node --env-file=.env.local ./node_modules/.bin/tsx scripts/seed-programs.ts
 */
import { getPayload } from "payload";

import config from "../payload.config";
import { PROGRAMS } from "../lib/programs";
import { getProgramDetail } from "../lib/programDetails";
import { inferMeasurementType } from "../lib/measurementHeuristic";
import type {
  DeloadBlock,
  EffortType,
  ExerciseGroup,
  ExerciseRow,
  HiitDetail,
  ProgramDay,
  ProgramDetail,
  ProgramTextBlock,
  TrainingBlock,
} from "../lib/types";

// ---------------------------------------------------------------------------
// Lexical rich-text helpers — hand-built minimal Lexical JSON rather than
// convertMarkdownToLexical, which needs a SanitizedServerEditorConfig that's
// awkward to construct outside a request. This is plain valid Lexical state.
// ---------------------------------------------------------------------------

function textNode(text: string) {
  return { type: "text", version: 1, text, format: 0, detail: 0, mode: "normal", style: "" };
}

function paragraphNode(text: string) {
  return {
    type: "paragraph",
    version: 1,
    children: [textNode(text)],
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    textStyle: "",
  };
}

function bulletListNode(items: string[]) {
  return {
    type: "list",
    version: 1,
    listType: "bullet",
    start: 1,
    tag: "ul",
    direction: "ltr",
    format: "",
    indent: 0,
    children: items.map((item, i) => ({
      type: "listitem",
      version: 1,
      value: i + 1,
      children: [textNode(item)],
      direction: "ltr",
      format: "",
      indent: 0,
    })),
  };
}

// Payload's generated richText field type is deep and generic-parameterized;
// these builders hand-construct plain Lexical JSON (empirically verified to
// round-trip correctly through the API), so `any` sidesteps fighting that
// generated type rather than reflecting genuine type-safety risk.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function richTextParagraphs(texts: (string | undefined)[]): any {
  const filtered = texts.filter((t): t is string => Boolean(t && t.trim()));
  if (filtered.length === 0) return undefined;
  return {
    root: {
      type: "root",
      version: 1,
      children: filtered.map(paragraphNode),
      direction: "ltr",
      format: "",
      indent: 0,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function richTextBulletList(items: string[]): any {
  if (items.length === 0) return undefined;
  return {
    root: {
      type: "root",
      version: 1,
      children: [bulletListNode(items)],
      direction: "ltr",
      format: "",
      indent: 0,
    },
  };
}

// ---------------------------------------------------------------------------
// Target taxonomy — the one human-authored input. Splits compound exercise
// target strings ("Chest + Core") into atomic targets, and groups those
// atomic targets under a handful of parent regions.
// ---------------------------------------------------------------------------

type TargetType = "muscle_region" | "core";

const TARGET_TAXONOMY: Record<string, { parent?: string; targetType: TargetType }> = {
  Chest: { targetType: "muscle_region" },
  Back: { targetType: "muscle_region" },
  Shoulders: { targetType: "muscle_region" },
  Arms: { targetType: "muscle_region" },
  Legs: { targetType: "muscle_region" },
  Core: { targetType: "core" },

  "Upper Chest": { parent: "Chest", targetType: "muscle_region" },

  Lats: { parent: "Back", targetType: "muscle_region" },
  "Mid Back": { parent: "Back", targetType: "muscle_region" },
  "Upper Traps": { parent: "Back", targetType: "muscle_region" },
  "Upper Back": { parent: "Back", targetType: "muscle_region" },

  "Side Shoulders": { parent: "Shoulders", targetType: "muscle_region" },
  "Front Shoulders": { parent: "Shoulders", targetType: "muscle_region" },
  "Rear Shoulders": { parent: "Shoulders", targetType: "muscle_region" },

  Biceps: { parent: "Arms", targetType: "muscle_region" },
  Triceps: { parent: "Arms", targetType: "muscle_region" },
  Forearms: { parent: "Arms", targetType: "muscle_region" },
  Grip: { parent: "Forearms", targetType: "muscle_region" },

  Quads: { parent: "Legs", targetType: "muscle_region" },
  Hamstrings: { parent: "Legs", targetType: "muscle_region" },
  Glutes: { parent: "Legs", targetType: "muscle_region" },
  Calves: { parent: "Legs", targetType: "muscle_region" },

  Abs: { parent: "Core", targetType: "core" },
  Obliques: { parent: "Core", targetType: "core" },
};

// Mirrors the beforeValidate slug hook on Targets/Exercises/Programs — computed
// here too since the generated create-data types require `slug` up front.
function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitTargets(targetStr: string): string[] {
  return targetStr
    .split("+")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Equipment inference — best-effort, optional field.
// ---------------------------------------------------------------------------

type EquipmentValue =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "machine"
  | "bench"
  | "bodyweight"
  | "resistance_band"
  | "treadmill"
  | "stationary_bike"
  | "other";

function inferEquipment(name: string): EquipmentValue[] {
  const n = name.toLowerCase();
  const eq: EquipmentValue[] = [];
  if (/\bbarbell\b/.test(n)) eq.push("barbell");
  if (/\b(dumbbell|db)\b/.test(n)) eq.push("dumbbell");
  if (/\bcable\b/.test(n)) eq.push("cable");
  if (/\bmachine\b|\bpulldown\b|\bpec deck\b|\bleg press\b|\bleg curl\b|\bleg extension\b/.test(n)) eq.push("machine");
  if (/\bbench\b/.test(n)) eq.push("bench");
  if (eq.length === 0 && /push-up|plank|dead bug|hanging|crunch|russian twist|calf raise$/.test(n)) eq.push("bodyweight");
  return eq;
}

// ---------------------------------------------------------------------------
// Prescription / rest text parsers — mechanical conversion of the free-text
// "targetReps" / "rest" strings into the CMS's structured fields. Duration
// ranges ("30–60 sec") have no structured min/max in the schema, so they
// fall back to prescriptionType "custom" with the raw text preserved.
// ---------------------------------------------------------------------------

type ParsedPrescription =
  | { prescriptionType: "range"; minReps: number; maxReps: number }
  | { prescriptionType: "fixed"; fixedReps: number }
  | { prescriptionType: "time"; durationValue: number; durationUnit: "sec" | "min" }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { prescriptionType: "custom"; customPrescription: any };

function parsePrescription(targetReps: string): {
  base: ParsedPrescription;
  perSide: boolean;
  perSideLabel?: "side" | "arm" | "leg";
} {
  let text = targetReps.trim();
  let perSide = false;
  let perSideLabel: "side" | "arm" | "leg" | undefined;

  const sideMatch = text.match(/\/(side|leg|arm)$/i);
  if (sideMatch) {
    perSide = true;
    perSideLabel = sideMatch[1].toLowerCase() as "side" | "arm" | "leg";
    text = text.slice(0, sideMatch.index).trim();
  }

  const isDuration = /\bsec\b|\bmin\b/i.test(text);
  const rangeMatch = text.match(/^(\d+)\s*[–-]\s*(\d+)/);

  if (isDuration) {
    const unit: "sec" | "min" = /\bmin\b/i.test(text) ? "min" : "sec";
    if (rangeMatch) {
      return {
        base: { prescriptionType: "custom", customPrescription: richTextParagraphs([targetReps]) },
        perSide,
        perSideLabel,
      };
    }
    const singleMatch = text.match(/^(\d+)/);
    if (singleMatch) {
      return {
        base: { prescriptionType: "time", durationValue: Number(singleMatch[1]), durationUnit: unit },
        perSide,
        perSideLabel,
      };
    }
    return {
      base: { prescriptionType: "custom", customPrescription: richTextParagraphs([targetReps]) },
      perSide,
      perSideLabel,
    };
  }

  if (rangeMatch) {
    return {
      base: { prescriptionType: "range", minReps: Number(rangeMatch[1]), maxReps: Number(rangeMatch[2]) },
      perSide,
      perSideLabel,
    };
  }
  const singleMatch = text.match(/^(\d+)/);
  if (singleMatch) {
    return { base: { prescriptionType: "fixed", fixedReps: Number(singleMatch[1]) }, perSide, perSideLabel };
  }
  return {
    base: { prescriptionType: "custom", customPrescription: richTextParagraphs([targetReps]) },
    perSide,
    perSideLabel,
  };
}

function parseRestSeconds(restText: string): { minRestSec: number; maxRestSec: number } {
  const text = restText.trim();
  const unit: "sec" | "min" = /\bmin\b/i.test(text) ? "min" : "sec";
  const toSec = (n: number) => (unit === "min" ? n * 60 : n);
  const rangeMatch = text.match(/^(\d+)\s*[–-]\s*(\d+)/);
  if (rangeMatch) {
    return { minRestSec: toSec(Number(rangeMatch[1])), maxRestSec: toSec(Number(rangeMatch[2])) };
  }
  const singleMatch = text.match(/^(\d+)/);
  const val = singleMatch ? toSec(Number(singleMatch[1])) : 0;
  return { minRestSec: val, maxRestSec: val };
}

function prescriptionToFields(p: ParsedPrescription): Record<string, unknown> {
  switch (p.prescriptionType) {
    case "range":
      return { prescriptionType: "range", minReps: p.minReps, maxReps: p.maxReps };
    case "fixed":
      return { prescriptionType: "fixed", fixedReps: p.fixedReps };
    case "time":
      return { prescriptionType: "time", durationValue: p.durationValue, durationUnit: p.durationUnit };
    case "custom":
      return { prescriptionType: "custom", customPrescription: p.customPrescription };
  }
}

// ---------------------------------------------------------------------------
// Title parsing — titles use an em dash (—) as the major separator and an en
// dash (–) inside week ranges, e.g. "Weeks 1–5 — Foundation".
// ---------------------------------------------------------------------------

function parsePhaseWeeks(id: string): { startWeek?: number; endWeek?: number } {
  const m = id.match(/(\d+)(?:-(\d+))?$/);
  if (!m) return {};
  const start = Number(m[1]);
  const end = m[2] ? Number(m[2]) : start;
  return { startWeek: start, endWeek: end };
}

function derivePhaseName(title: string): string {
  const parts = title.split("—").map((s) => s.trim());
  return parts[parts.length - 1] || title;
}

function deriveDayName(title: string): string {
  const parts = title.split("—").map((s) => s.trim());
  return parts.slice(1).join(" — ") || title;
}

// ---------------------------------------------------------------------------
// Exercise extraction — walk every training block's exercise rows across all
// 3 programs, recording each distinct exercise name once (primary or
// alternative-only), so every exercise is seeded exactly once.
// ---------------------------------------------------------------------------

type ExerciseInfo = { targetStr: string; measurementType: EffortType };

function forEachRow(details: ProgramDetail[], fn: (row: ExerciseRow) => void): void {
  for (const detail of details) {
    for (const block of detail.weekBlocks) {
      if (block.kind !== "training") continue;
      for (const day of block.days) {
        for (const group of day.groups ?? []) {
          for (const row of group.exercises) {
            fn(row);
          }
        }
      }
    }
  }
}

// Two passes: an exercise's own primary occurrence must always win its
// target/measurementType, even if it was also seen earlier as someone
// else's *alternative* (which would otherwise wrongly inherit the target
// of the row it stood in for) — confirmed by e.g. "Barbell Row", which is
// both its own primary exercise (target "Mid Back + Lats") and used as the
// alternative for "One-Arm Dumbbell Row" (target "Lats + Mid Back").
function collectExercises(details: ProgramDetail[]): Map<string, ExerciseInfo> {
  const map = new Map<string, ExerciseInfo>();

  forEachRow(details, (row) => {
    if (!map.has(row.exercise)) {
      map.set(row.exercise, {
        targetStr: row.target,
        measurementType: row.measurementType ?? inferMeasurementType(row.exercise),
      });
    }
  });

  forEachRow(details, (row) => {
    if (row.alternative && row.alternative !== "—" && !map.has(row.alternative)) {
      map.set(row.alternative, {
        targetStr: row.target,
        measurementType: inferMeasurementType(row.alternative),
      });
    }
  });

  return map;
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildWarmUpBlock(warmUp: ProgramTextBlock) {
  const items = (warmUp.bullets ?? []).map((b) => ({
    itemType: "text",
    textContent: richTextParagraphs([b]),
  }));
  return {
    blockType: "warmUp",
    title: warmUp.title,
    description: richTextParagraphs([warmUp.intro]),
    items,
    extraInfo: warmUp.note ? richTextParagraphs([warmUp.note]) : undefined,
    initiallyExpanded: false,
  };
}

function buildCoolDownBlock(coolDown: ProgramTextBlock) {
  return {
    blockType: "coolDown",
    title: coolDown.title,
    description: richTextParagraphs([coolDown.intro]),
    items: [],
    extraInfo: coolDown.note ? richTextParagraphs([coolDown.note]) : undefined,
    initiallyExpanded: false,
  };
}

function buildSafetyBlock(safetyNote: { title: string; bullets: string[] }) {
  return {
    blockType: "safety",
    title: safetyNote.title,
    safetyContent: richTextBulletList(safetyNote.bullets),
    requireAcknowledgement: false,
  };
}

function buildItem(row: ExerciseRow, exerciseIdByName: Map<string, number>) {
  const exerciseId = exerciseIdByName.get(row.exercise);
  if (!exerciseId) throw new Error(`Exercise not found in id map: "${row.exercise}"`);
  if (!row.targetReps) throw new Error(`Row for "${row.exercise}" has no targetReps to parse`);

  const { base, perSide, perSideLabel } = parsePrescription(row.targetReps);
  const rest = parseRestSeconds(row.rest);
  const alternatives: number[] = [];
  if (row.alternative && row.alternative !== "—") {
    const altId = exerciseIdByName.get(row.alternative);
    if (altId) alternatives.push(altId);
  }

  return {
    exercise: exerciseId,
    measurementType: row.measurementType,
    sets: row.sets,
    ...prescriptionToFields(base),
    perSide,
    perSideLabel,
    minRestSec: rest.minRestSec,
    maxRestSec: rest.maxRestSec,
    alternatives,
    enabled: true,
  };
}

function buildExerciseGroup(group: ExerciseGroup, exerciseIdByName: Map<string, number>) {
  return {
    name: group.heading ?? group.workoutType ?? "Exercises",
    workoutType: group.workoutType,
    items: group.exercises.map((row) => buildItem(row, exerciseIdByName)),
    displayTableHeader: true,
    enabled: true,
  };
}

function buildIntervals(hiit: HiitDetail) {
  return {
    intro: richTextParagraphs(hiit.intro),
    rounds: hiit.rounds.map((r) => ({
      label: r.label,
      warmUp: r.warmUp,
      hardEffort: r.hardEffort,
      recovery: r.easyCycling,
      repeat: r.repeat,
      note: r.note,
    })),
    coolDown: hiit.coolDown,
  };
}

function buildDay(day: ProgramDay, exerciseIdByName: Map<string, number>) {
  return {
    dayNumber: day.day,
    dayName: deriveDayName(day.title),
    description: day.note ? richTextParagraphs([day.note]) : undefined,
    warmUpBehavior: "use_program",
    exerciseGroups: (day.groups ?? []).map((g) => buildExerciseGroup(g, exerciseIdByName)),
    intervals: day.hiit ? buildIntervals(day.hiit) : undefined,
    progressionNote: day.progressionNote ? richTextParagraphs([day.progressionNote]) : undefined,
    enabled: true,
  };
}

function buildTrainingPhaseBlock(block: TrainingBlock, exerciseIdByName: Map<string, number>) {
  const { startWeek, endWeek } = parsePhaseWeeks(block.id);
  const name = derivePhaseName(block.title);
  const phaseType = /foundation/i.test(name) ? "foundation" : /progression/i.test(name) ? "progression" : "custom";
  return {
    blockType: "phase",
    phaseKey: block.id,
    name,
    displayTitle: block.title,
    phaseType,
    description: block.intro ? richTextParagraphs([block.intro]) : undefined,
    contentMode: "create",
    startWeek,
    endWeek,
    days: block.days.map((day) => buildDay(day, exerciseIdByName)),
    initiallyExpanded: false,
    enabled: true,
  };
}

function buildDeloadPhaseBlock(block: DeloadBlock, sourcePhaseKey: string) {
  const { startWeek, endWeek } = parsePhaseWeeks(block.id);
  return {
    blockType: "phase",
    phaseKey: block.id,
    name: "Deload",
    displayTitle: block.title,
    phaseType: "deload",
    description: richTextParagraphs(block.body),
    contentMode: "reuse",
    startWeek,
    endWeek,
    sourcePhaseKey,
    setsScale: 0.5,
    initiallyExpanded: false,
    enabled: true,
  };
}

function buildSections(detail: ProgramDetail, exerciseIdByName: Map<string, number>) {
  const sections: unknown[] = [buildWarmUpBlock(detail.warmUp)];
  let lastTrainingPhaseKey: string | undefined;
  for (const block of detail.weekBlocks) {
    if (block.kind === "training") {
      sections.push(buildTrainingPhaseBlock(block, exerciseIdByName));
      lastTrainingPhaseKey = block.id;
    } else {
      if (!lastTrainingPhaseKey) throw new Error(`Deload block "${block.id}" has no preceding training block`);
      sections.push(buildDeloadPhaseBlock(block, lastTrainingPhaseKey));
    }
  }
  sections.push(buildCoolDownBlock(detail.coolDown));
  sections.push(buildSafetyBlock(detail.safetyNote));
  return sections;
}

// ---------------------------------------------------------------------------
// Program-level metadata not present in lib/programs.ts
// ---------------------------------------------------------------------------

const ABBREVIATIONS: Record<string, string> = {
  "bro-split": "Bro",
  pplul: "PPLUL",
  "full-body": "Full body",
};

type ProgramTypeValue = "bro_split" | "ppl" | "upper_lower" | "full_body" | "strength" | "mobility" | "custom";

const PROGRAM_TYPE: Record<string, ProgramTypeValue> = {
  "bro-split": "bro_split",
  pplul: "ppl",
  "full-body": "full_body",
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const payload = await getPayload({ config });

  // --- Targets --------------------------------------------------------
  const targetIdCache = new Map<string, number>();
  let remaining = Object.keys(TARGET_TAXONOMY);
  let createdTargets = 0;
  let skippedTargets = 0;
  while (remaining.length > 0) {
    const deferred: string[] = [];
    for (const name of remaining) {
      const parent = TARGET_TAXONOMY[name].parent;
      if (parent && !targetIdCache.has(parent)) {
        deferred.push(name);
        continue;
      }
      const existing = await payload.find({ collection: "targets", where: { name: { equals: name } }, limit: 1 });
      if (existing.docs.length > 0) {
        targetIdCache.set(name, existing.docs[0].id);
        skippedTargets++;
        continue;
      }
      const taxonomy = TARGET_TAXONOMY[name];
      const parentId = taxonomy.parent ? targetIdCache.get(taxonomy.parent) : undefined;
      const created = await payload.create({
        collection: "targets",
        draft: false,
        data: {
          name,
          slug: slugify(name),
          targetType: taxonomy.targetType,
          parentTarget: parentId,
          active: true,
        },
      });
      targetIdCache.set(name, created.id);
      createdTargets++;
    }
    if (deferred.length === remaining.length) {
      throw new Error(`Circular or unresolved parent reference among: ${deferred.join(", ")}`);
    }
    remaining = deferred;
  }
  console.log(`Targets: ${createdTargets} created, ${skippedTargets} already existed (${targetIdCache.size} total).`);

  // --- Exercises --------------------------------------------------------
  const programIds = ["bro-split", "pplul", "full-body"];
  const details = programIds.map((id) => {
    const detail = getProgramDetail(id);
    if (!detail) throw new Error(`No program detail found for "${id}"`);
    return detail;
  });

  const exerciseInfoMap = collectExercises(details);
  console.log(`Discovered ${exerciseInfoMap.size} distinct exercise names across all 3 programs.`);

  const exerciseIdByName = new Map<string, number>();
  let createdExercises = 0;
  let skippedExercises = 0;
  for (const [name, info] of exerciseInfoMap) {
    const existing = await payload.find({ collection: "exercises", where: { name: { equals: name } }, limit: 1 });
    if (existing.docs.length > 0) {
      exerciseIdByName.set(name, existing.docs[0].id);
      skippedExercises++;
      continue;
    }
    const atomicNames = splitTargets(info.targetStr);
    const atomicIds = atomicNames.map((n) => targetIdCache.get(n)).filter((v): v is number => v !== undefined);
    if (atomicIds.length === 0) {
      throw new Error(`No resolved target ids for exercise "${name}" (target string "${info.targetStr}")`);
    }
    const created = await payload.create({
      collection: "exercises",
      draft: false,
      data: {
        name,
        slug: slugify(name),
        targets: atomicIds,
        primaryTarget: atomicIds[0],
        category: "strength",
        equipment: inferEquipment(name),
        defaultMeasurementType: info.measurementType,
        active: true,
      },
    });
    exerciseIdByName.set(name, created.id);
    createdExercises++;
  }
  console.log(`Exercises: ${createdExercises} created, ${skippedExercises} already existed (${exerciseIdByName.size} total).`);

  // --- Programs --------------------------------------------------------
  for (const programMeta of PROGRAMS) {
    const detail = getProgramDetail(programMeta.id);
    if (!detail) throw new Error(`No program detail found for "${programMeta.id}"`);

    const existing = await payload.find({ collection: "programs", where: { slug: { equals: programMeta.id } }, limit: 1 });
    for (const doc of existing.docs) {
      await payload.delete({ collection: "programs", id: doc.id });
    }
    if (existing.docs.length > 0) {
      console.log(`Deleted ${existing.docs.length} existing "${programMeta.id}" program doc(s) to reseed.`);
    }

    const sections = buildSections(detail, exerciseIdByName);
    const created = await payload.create({
      collection: "programs",
      draft: false,
      data: {
        // _status defaults to "draft" at the field-schema level; draft:false
        // alone only prevents forcing a draft save, it doesn't publish —
        // must set this explicitly to get a published doc.
        _status: "published",
        name: programMeta.name,
        subtitle: programMeta.subtitle,
        slug: programMeta.id,
        abbreviation: ABBREVIATIONS[programMeta.id],
        shortDescription: richTextParagraphs([programMeta.description]),
        fullDescription: richTextParagraphs(detail.whatIsIt),
        weeks: programMeta.durationWeeks,
        daysPerWeek: programMeta.daysPerWeek,
        sessionMinutes: programMeta.sessionMinutes,
        difficulty: "intermediate",
        programType: PROGRAM_TYPE[programMeta.id],
        featured: false,
        active: true,
        sections: sections as never,
      },
    });

    const phaseCount = sections.filter((s) => (s as { blockType?: string }).blockType === "phase").length;
    console.log(`Seeded program "${programMeta.id}" -> id ${created.id} (${phaseCount} phases, published).`);
  }

  console.log("SEED_OK");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
