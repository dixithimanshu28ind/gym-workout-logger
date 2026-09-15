import type {
  Block,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
  Field,
} from "payload";
import { ValidationError } from "payload";
import { revalidateTag } from "next/cache";

// ---------------------------------------------------------------------------
// Shared option lists
// ---------------------------------------------------------------------------

/** Mirrors lib/workoutTypes.ts WORKOUT_TYPES exactly — the adapter maps these
 * values back onto the app's own workout-type strings, so keep both in sync. */
const WORKOUT_TYPE_OPTIONS = [
  "Full Body",
  "Upper Body",
  "Lower Body",
  "Push",
  "Pull",
  "Legs",
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Biceps",
  "Triceps",
  "Core / Abs",
  "Calves",
  "Forearms",
  "Cardio",
  "HIIT",
  "Mobility / Recovery",
  "Rest Day",
  "Other",
].map((label) => ({ label, value: label }));

const MEASUREMENT_TYPE_OPTIONS = [
  { label: "Total Weight", value: "total_weight" },
  { label: "Weight Each (per dumbbell/side)", value: "weight_each" },
  { label: "Bodyweight", value: "bodyweight" },
  { label: "Duration", value: "duration" },
];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

type ValidateArgs = { data?: Record<string, unknown>; siblingData?: Record<string, unknown> };

function slugField(overrides: Partial<Field> = {}): Field {
  return {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    admin: {
      description: "URL-safe identifier. Auto-filled from Name, editable while in draft — locked once first published.",
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (value) return value;
          if (!data?.name) return value;
          return data.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        },
      ],
      beforeDuplicate: [({ value }) => `${value}-copy`],
    },
    ...overrides,
  } as Field;
}

// ---------------------------------------------------------------------------
// Program Exercise Item — "how is an Exercise performed in this program"
// ---------------------------------------------------------------------------

const prescriptionFields: Field[] = [
  {
    name: "prescriptionType",
    type: "select",
    required: true,
    options: [
      { label: "Fixed Repetitions", value: "fixed" },
      { label: "Repetition Range", value: "range" },
      { label: "Time", value: "time" },
      { label: "Distance", value: "distance" },
      { label: "Until Comfortable", value: "until_comfortable" },
      { label: "Custom", value: "custom" },
    ],
  },
  {
    name: "fixedReps",
    type: "number",
    admin: { condition: (_, siblingData) => siblingData?.prescriptionType === "fixed" },
  },
  {
    name: "minReps",
    type: "number",
    admin: { condition: (_, siblingData) => siblingData?.prescriptionType === "range" },
  },
  {
    name: "maxReps",
    type: "number",
    admin: { condition: (_, siblingData) => siblingData?.prescriptionType === "range" },
    validate: (value: unknown, { siblingData }: ValidateArgs) => {
      const sd = siblingData as { prescriptionType?: string; minReps?: number } | undefined;
      const num = value as number | null | undefined;
      if (sd?.prescriptionType !== "range" || num == null || sd?.minReps == null) return true;
      if (num < sd.minReps) return "Maximum Repetitions cannot be less than Minimum Repetitions.";
      return true;
    },
  },
  {
    name: "durationValue",
    type: "number",
    admin: { condition: (_, siblingData) => siblingData?.prescriptionType === "time" },
  },
  {
    name: "durationUnit",
    type: "select",
    options: [
      { label: "Seconds", value: "sec" },
      { label: "Minutes", value: "min" },
    ],
    admin: { condition: (_, siblingData) => siblingData?.prescriptionType === "time" },
  },
  {
    name: "distanceValue",
    type: "number",
    admin: { condition: (_, siblingData) => siblingData?.prescriptionType === "distance" },
  },
  {
    name: "distanceUnit",
    type: "select",
    options: [
      { label: "Meters", value: "m" },
      { label: "Kilometers", value: "km" },
      { label: "Miles", value: "mi" },
    ],
    admin: { condition: (_, siblingData) => siblingData?.prescriptionType === "distance" },
  },
  {
    name: "customPrescription",
    type: "richText",
    admin: {
      condition: (_, siblingData) => siblingData?.prescriptionType === "custom",
      description: "Use only when the prescription can't be represented by the structured fields above.",
    },
  },
];

const programExerciseItemFields: Field[] = [
  { name: "exercise", type: "relationship", relationTo: "exercises", required: true },
  {
    name: "measurementType",
    type: "select",
    options: MEASUREMENT_TYPE_OPTIONS,
    admin: { description: "Overrides the exercise's default measurement type for this item only." },
  },
  { name: "sets", type: "number" },
  ...prescriptionFields,
  { name: "perSide", type: "checkbox", defaultValue: false },
  {
    name: "perSideLabel",
    type: "select",
    options: [
      { label: "Side", value: "side" },
      { label: "Arm", value: "arm" },
      { label: "Leg", value: "leg" },
    ],
    admin: { condition: (_, siblingData) => Boolean(siblingData?.perSide) },
  },
  { name: "minRestSec", type: "number" },
  {
    name: "maxRestSec",
    type: "number",
    validate: (value: unknown, { siblingData }: ValidateArgs) => {
      const sd = siblingData as { minRestSec?: number } | undefined;
      const num = value as number | null | undefined;
      if (num == null || sd?.minRestSec == null) return true;
      if (num < sd.minRestSec) return "Maximum Rest cannot be less than Minimum Rest.";
      return true;
    },
  },
  {
    name: "alternatives",
    type: "relationship",
    relationTo: "exercises",
    hasMany: true,
    admin: { description: "Pre-populate from the exercise's Default Alternatives, then adjust for this program item only." },
  },
  { name: "notes", type: "richText" },
  { name: "extraInfo", type: "richText" },
  { name: "enabled", type: "checkbox", defaultValue: true },
];

// ---------------------------------------------------------------------------
// Warm-up / cool-down items — either a real exercise or a free-text line.
// Migration maps existing prose content to "text" items mechanically; editors
// can convert individual lines to structured "exercise" items over time.
// ---------------------------------------------------------------------------

const warmCoolItemFields: Field[] = [
  {
    name: "itemType",
    type: "select",
    required: true,
    options: [
      { label: "Exercise", value: "exercise" },
      { label: "Text", value: "text" },
    ],
  },
  {
    name: "exercise",
    type: "relationship",
    relationTo: "exercises",
    admin: { condition: (_, siblingData) => siblingData?.itemType === "exercise" },
  },
  {
    name: "prescriptionText",
    type: "text",
    admin: {
      condition: (_, siblingData) => siblingData?.itemType === "exercise",
      description: 'Free-text prescription summary, e.g. "10–15 reps" or "5 min easy".',
    },
  },
  {
    name: "textContent",
    type: "richText",
    admin: { condition: (_, siblingData) => siblingData?.itemType === "text" },
  },
  { name: "instructions", type: "richText" },
];

// ---------------------------------------------------------------------------
// Intervals (structured HIIT rounds) — optional group on a workout day
// ---------------------------------------------------------------------------

const intervalsField: Field = {
  name: "intervals",
  type: "group",
  admin: { description: "Structured interval rounds, e.g. for a HIIT day. Leave empty if this day has none." },
  fields: [
    { name: "intro", type: "richText" },
    {
      name: "rounds",
      type: "array",
      dbName: "phase_interval_rounds",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "warmUp", type: "text" },
        { name: "hardEffort", type: "text", required: true },
        { name: "recovery", type: "text", required: true },
        { name: "repeat", type: "text", required: true },
        { name: "note", type: "text" },
      ],
    },
    { name: "coolDown", type: "text" },
  ],
};

// ---------------------------------------------------------------------------
// Exercise Group — "how are Exercises organised visually within the day"
// ---------------------------------------------------------------------------

const exerciseGroupFields: Field[] = [
  { name: "name", type: "text", required: true },
  { name: "workoutType", type: "select", options: WORKOUT_TYPE_OPTIONS },
  { name: "groupTarget", type: "relationship", relationTo: "targets" },
  { name: "description", type: "richText" },
  {
    name: "items",
    type: "array",
    dbName: "phase_group_items",
    minRows: 1,
    admin: {
      components: {
        RowLabel: "@/components/payload/ProgramExerciseItemRowLabel#ProgramExerciseItemRowLabel",
      },
    },
    fields: programExerciseItemFields,
  },
  { name: "displayTableHeader", type: "checkbox", defaultValue: true },
  { name: "enabled", type: "checkbox", defaultValue: true },
];

// ---------------------------------------------------------------------------
// Workout Day
// ---------------------------------------------------------------------------

const dayFields: Field[] = [
  { name: "dayNumber", type: "number", required: true },
  { name: "dayName", type: "text", required: true },
  {
    name: "displayTitle",
    type: "text",
    admin: { description: 'Defaults to "Day {number} — {name}". Editable.' },
    hooks: {
      beforeValidate: [
        ({ value, siblingData }) => {
          if (value) return value;
          const sd = siblingData as { dayNumber?: number; dayName?: string } | undefined;
          if (sd?.dayNumber == null || !sd?.dayName) return value;
          return `Day ${sd.dayNumber} — ${sd.dayName}`;
        },
      ],
    },
  },
  { name: "description", type: "richText" },
  { name: "focusTargets", type: "relationship", relationTo: "targets", hasMany: true },
  {
    name: "warmUpBehavior",
    type: "select",
    required: true,
    defaultValue: "use_program",
    options: [
      { label: "Use Program Warm-Up", value: "use_program" },
      { label: "Add to Program Warm-Up", value: "add_to_program" },
      { label: "Replace Program Warm-Up", value: "replace_program" },
      { label: "No Warm-Up", value: "none" },
    ],
  },
  {
    name: "dayWarmUpItems",
    type: "array",
    dbName: "phase_day_warmup_items",
    admin: {
      condition: (_, siblingData) =>
        siblingData?.warmUpBehavior === "add_to_program" || siblingData?.warmUpBehavior === "replace_program",
    },
    fields: warmCoolItemFields,
  },
  {
    name: "exerciseGroups",
    type: "array",
    dbName: "phase_days_groups",
    admin: {
      components: {
        RowLabel: "@/components/payload/ExerciseGroupRowLabel#ExerciseGroupRowLabel",
      },
    },
    fields: exerciseGroupFields,
  },
  intervalsField,
  { name: "progressionNote", type: "richText" },
  { name: "extraInfo", type: "richText" },
  { name: "enabled", type: "checkbox", defaultValue: true },
];

// ---------------------------------------------------------------------------
// Sections blocks: warmUp, phase, coolDown, richText (Information), safety
// ---------------------------------------------------------------------------

const warmUpBlock: Block = {
  slug: "warmUp",
  labels: { singular: "Warm-Up Section", plural: "Warm-Up Sections" },
  fields: [
    { name: "title", type: "text", required: true, defaultValue: "General Warm-Up" },
    { name: "description", type: "richText" },
    { name: "items", type: "array", dbName: "programs_warmup_items", fields: warmCoolItemFields },
    { name: "extraInfo", type: "richText" },
    { name: "initiallyExpanded", type: "checkbox", defaultValue: false },
  ],
};

const coolDownBlock: Block = {
  slug: "coolDown",
  labels: { singular: "Cool-Down Section", plural: "Cool-Down Sections" },
  fields: [
    { name: "title", type: "text", required: true, defaultValue: "Cool-Down" },
    { name: "description", type: "richText" },
    { name: "items", type: "array", dbName: "programs_cooldown_items", fields: warmCoolItemFields },
    { name: "extraInfo", type: "richText" },
    { name: "initiallyExpanded", type: "checkbox", defaultValue: false },
  ],
};

const richTextBlock: Block = {
  slug: "richText",
  labels: { singular: "Information Section", plural: "Information Sections" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "content", type: "richText", required: true },
    {
      name: "displayStyle",
      type: "select",
      defaultValue: "standard",
      options: [
        { label: "Standard", value: "standard" },
        { label: "Information", value: "information" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Safety", value: "safety" },
      ],
    },
    { name: "collapsible", type: "checkbox", defaultValue: false },
    {
      name: "initiallyExpanded",
      type: "checkbox",
      defaultValue: true,
      admin: { condition: (_, siblingData) => Boolean(siblingData?.collapsible) },
    },
  ],
};

const safetyBlock: Block = {
  slug: "safety",
  labels: { singular: "Safety & Acknowledgement Section", plural: "Safety & Acknowledgement Sections" },
  fields: [
    { name: "title", type: "text", required: true, defaultValue: "Before You Start" },
    { name: "safetyContent", type: "richText", required: true },
    { name: "requireAcknowledgement", type: "checkbox", defaultValue: true },
    {
      name: "acknowledgementContent",
      type: "richText",
      admin: { condition: (_, siblingData) => Boolean(siblingData?.requireAcknowledgement) },
      validate: (value: unknown, { siblingData }: ValidateArgs) => {
        const sd = siblingData as { requireAcknowledgement?: boolean } | undefined;
        if (sd?.requireAcknowledgement && !value) {
          return "Acknowledgement Content is required when Require Acknowledgement is on.";
        }
        return true;
      },
    },
    { name: "actionLabel", type: "text", defaultValue: "Select & Start" },
  ],
};

const phaseBlock: Block = {
  slug: "phase",
  labels: { singular: "Phase", plural: "Phases" },
  admin: {
    components: {
      Label: "@/components/payload/PhaseRowLabel#PhaseRowLabel",
    },
  },
  fields: [
    {
      name: "phaseKey",
      type: "text",
      required: true,
      admin: { description: 'Stable identifier, e.g. "weeks-1-5". Locked once the program is first published — logged workouts reference it.' },
      validate: (value: unknown, { data }: ValidateArgs) => {
        if (!value) return "Phase Key is required.";
        const sections = ((data as { sections?: { blockType?: string; phaseKey?: string }[] })?.sections ?? []).filter(
          (b) => b.blockType === "phase"
        );
        const matches = sections.filter((b) => b.phaseKey === value).length;
        if (matches > 1) {
          return `Phase Key "${value}" is used by more than one phase — phase keys must be unique within a program.`;
        }
        return true;
      },
    },
    { name: "name", type: "text", required: true },
    { name: "displayTitle", type: "text", admin: { description: 'e.g. "Weeks 1–5 — Foundation". Editable.' } },
    {
      name: "phaseType",
      type: "select",
      required: true,
      options: [
        { label: "Introduction", value: "introduction" },
        { label: "Foundation", value: "foundation" },
        { label: "Progression", value: "progression" },
        { label: "Strength", value: "strength" },
        { label: "Hypertrophy", value: "hypertrophy" },
        { label: "Conditioning", value: "conditioning" },
        { label: "Recovery", value: "recovery" },
        { label: "Deload", value: "deload" },
        { label: "Assessment", value: "assessment" },
        { label: "Custom", value: "custom" },
      ],
    },
    {
      name: "customTypeLabel",
      type: "text",
      admin: { condition: (_, siblingData) => siblingData?.phaseType === "custom" },
    },
    { name: "description", type: "richText" },
    {
      name: "internalNotes",
      type: "richText",
      admin: { description: "Admin-only. Never exposed through the public API." },
      access: {
        read: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
      },
    },
    {
      name: "contentMode",
      type: "select",
      required: true,
      defaultValue: "create",
      options: [
        { label: "Create New Workouts", value: "create" },
        { label: "Reuse Another Phase", value: "reuse" },
        { label: "Information Only", value: "info" },
      ],
    },
    { name: "startWeek", type: "number" },
    {
      name: "endWeek",
      type: "number",
      validate: (value: unknown, { data, siblingData }: ValidateArgs) => {
        const num = value as number | null | undefined;
        if (num == null) return true;
        const sd = siblingData as { startWeek?: number } | undefined;
        if (sd?.startWeek != null && num < sd.startWeek) return "End Week cannot be before Start Week.";
        const totalWeeks = (data as { weeks?: number })?.weeks;
        if (totalWeeks != null && num > totalWeeks) {
          return `End Week (${num}) cannot exceed the program's total Number of Weeks (${totalWeeks}).`;
        }
        return true;
      },
    },
    // --- Reuse mode ---
    {
      name: "sourcePhaseKey",
      type: "text",
      admin: {
        condition: (_, siblingData) => siblingData?.contentMode === "reuse",
        description: "Must reference another phase in this program whose Content Mode is Create (no chaining reuse-of-reuse, which also rules out circular references).",
      },
      validate: (value: unknown, { data, siblingData }: ValidateArgs) => {
        const sd = siblingData as { contentMode?: string; phaseKey?: string } | undefined;
        if (sd?.contentMode !== "reuse") return true;
        if (!value) return "Source Phase is required when Content Mode is Reuse.";
        if (value === sd?.phaseKey) return "A phase cannot reuse itself.";
        const sections = ((data as { sections?: { blockType?: string; phaseKey?: string; contentMode?: string }[] })?.sections ?? []).filter(
          (b) => b.blockType === "phase"
        );
        const source = sections.find((b) => b.phaseKey === value);
        if (!source) return `No phase found with key "${value}" in this program.`;
        if (source.contentMode === "reuse") return "Cannot reuse a phase that itself reuses another phase.";
        return true;
      },
    },
    {
      name: "setsScale",
      type: "number",
      defaultValue: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.contentMode === "reuse",
        description: "Multiplier applied to the source phase's set counts (e.g. 0.5 for a deload). Prefill rounds up, minimum 1.",
      },
      validate: (value: unknown) => {
        const num = value as number | null | undefined;
        if (num == null) return true;
        if (num <= 0) return "Sets Scale must be greater than 0.";
        return true;
      },
    },
    {
      name: "dayOverrides",
      type: "array",
      dbName: "phase_reuse_day_overrides",
      admin: { condition: (_, siblingData) => siblingData?.contentMode === "reuse" },
      fields: [
        { name: "dayNumber", type: "number", required: true },
        { name: "excluded", type: "checkbox", defaultValue: false },
        { name: "notes", type: "richText" },
      ],
    },
    // --- Create mode ---
    {
      name: "days",
      type: "array",
      dbName: "phase_create_days",
      admin: {
        condition: (_, siblingData) => siblingData?.contentMode === "create",
        components: {
          RowLabel: "@/components/payload/DayRowLabel#DayRowLabel",
        },
      },
      fields: dayFields,
    },
    // --- Guidance (all modes) ---
    { name: "instructions", type: "richText" },
    { name: "progressionGuidance", type: "richText" },
    { name: "recoveryGuidance", type: "richText" },
    { name: "initiallyExpanded", type: "checkbox", defaultValue: false },
    { name: "enabled", type: "checkbox", defaultValue: true },
  ],
};

// ---------------------------------------------------------------------------
// Lock slug + phaseKey once the program has ever been published — both are
// persisted on user data (profiles.selected_program_id, workouts.program_id,
// workouts.program_day_key), so renaming them after the fact would silently
// orphan users' saved progress.
// ---------------------------------------------------------------------------

const lockImmutableFieldsAfterPublish: CollectionBeforeValidateHook = async ({
  req,
  originalDoc,
  data,
  operation,
}) => {
  if (operation !== "update" || !originalDoc?.id || !data) return data;

  const publishedVersions = await req.payload.findVersions({
    collection: "programs",
    where: {
      and: [{ parent: { equals: originalDoc.id } }, { "version._status": { equals: "published" } }],
    },
    limit: 1,
    req,
  });

  if (publishedVersions.totalDocs === 0) return data;

  const published = publishedVersions.docs[0]?.version as
    | { slug?: string; sections?: { id?: string; blockType?: string; phaseKey?: string }[] }
    | undefined;
  if (!published) return data;

  if (data.slug !== undefined && published.slug !== undefined && data.slug !== published.slug) {
    throw new ValidationError({
      collection: "programs",
      id: originalDoc.id,
      errors: [
        {
          path: "slug",
          message: `Slug cannot be changed after the program has been published (currently published as "${published.slug}").`,
        },
      ],
      req,
    });
  }

  const publishedPhaseKeysById = new Map<string, string>();
  for (const block of published.sections ?? []) {
    if (block.blockType === "phase" && block.id && block.phaseKey) {
      publishedPhaseKeysById.set(block.id, block.phaseKey);
    }
  }

  const sections = (data.sections ?? []) as { id?: string; blockType?: string; phaseKey?: string }[];
  for (let i = 0; i < sections.length; i++) {
    const block = sections[i];
    if (block.blockType !== "phase" || !block.id) continue;
    const lockedKey = publishedPhaseKeysById.get(block.id);
    if (lockedKey !== undefined && block.phaseKey !== lockedKey) {
      throw new ValidationError({
        collection: "programs",
        id: originalDoc.id,
        errors: [
          {
            path: `sections.${i}.phaseKey`,
            message: `Phase Key "${lockedKey}" cannot be changed after publishing — it's referenced by users' saved progress. Rename the phase's display title instead.`,
          },
        ],
        req,
      });
    }
  }

  return data;
};

// ---------------------------------------------------------------------------
// Live cache invalidation — publishing/unpublishing/deleting a program (or
// saving a draft, which doesn't affect the published-only read the app
// uses, but costs nothing to also invalidate) should go live immediately
// rather than waiting for a redeploy. revalidateTag needs a Next.js
// request-scoped context, which doesn't exist when Payload runs outside
// the app (e.g. scripts/seed-programs.ts) — swallow that case rather than
// letting it break seeding.
// ---------------------------------------------------------------------------

const revalidateProgramsAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  try {
    revalidateTag("programs", "max");
  } catch {
    // Not running inside a Next.js request — e.g. a standalone script.
  }
  return doc;
};

const revalidateProgramsAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  try {
    revalidateTag("programs", "max");
  } catch {
    // Not running inside a Next.js request — e.g. a standalone script.
  }
  return doc;
};

// ---------------------------------------------------------------------------
// Programs collection
// ---------------------------------------------------------------------------

export const Programs: CollectionConfig = {
  slug: "programs",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "programType", "difficulty", "weeks", "daysPerWeek", "featured", "_status"],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  hooks: {
    beforeValidate: [lockImmutableFieldsAfterPublish],
    afterChange: [revalidateProgramsAfterChange],
    afterDelete: [revalidateProgramsAfterDelete],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "subtitle", type: "text" },
    slugField(),
    { name: "abbreviation", type: "text", required: true, admin: { description: 'Short label for tiles and the logger, e.g. "Bro", "PPLUL".' } },
    { name: "shortDescription", type: "richText", required: true },
    { name: "fullDescription", type: "richText" },
    { name: "weeks", type: "number", required: true, min: 1 },
    { name: "daysPerWeek", type: "number", required: true, min: 1, max: 7 },
    { name: "sessionMinutes", type: "number" },
    {
      name: "difficulty",
      type: "select",
      required: true,
      options: [
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
        { label: "All Levels", value: "all_levels" },
      ],
    },
    {
      name: "programType",
      type: "select",
      required: true,
      options: [
        { label: "Bro Split", value: "bro_split" },
        { label: "Push/Pull/Legs", value: "ppl" },
        { label: "Upper/Lower", value: "upper_lower" },
        { label: "Full Body", value: "full_body" },
        { label: "Strength", value: "strength" },
        { label: "Mobility", value: "mobility" },
        { label: "Custom", value: "custom" },
      ],
    },
    {
      name: "customProgramTypeLabel",
      type: "text",
      admin: { condition: (_, siblingData) => siblingData?.programType === "custom" },
    },
    { name: "coverImage", type: "upload", relationTo: "media" },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "active", type: "checkbox", defaultValue: true },
    {
      name: "sections",
      type: "blocks",
      blocks: [warmUpBlock, phaseBlock, coolDownBlock, richTextBlock, safetyBlock],
    },
  ],
};
