import type { CollectionConfig } from "payload";

/** Relationship values arrive as a raw id, or (when populated) a document with an id. */
function extractId(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "object" && value !== null && "id" in value) {
    return (value as { id: number }).id;
  }
  return undefined;
}

export const Exercises: CollectionConfig = {
  slug: "exercises",
  // The app's own Supabase table is already named "exercises" (logged
  // workout exercises: workout_id, prescribed_index, ...) — a completely
  // different schema. Keep Payload's REST/admin-facing slug as "exercises"
  // but generate its Postgres table under a distinct name so the two never
  // collide.
  dbName: "cms_exercises",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "primaryTarget", "category", "active"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-safe identifier. Auto-filled from Name, editable.",
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
      },
    },
    {
      name: "targets",
      type: "relationship",
      relationTo: "targets",
      hasMany: true,
      required: true,
    },
    {
      name: "primaryTarget",
      type: "relationship",
      relationTo: "targets",
      hasMany: false,
      validate: (value, { data }) => {
        if (!value) return true;
        const rawTargets = (data as { targets?: unknown[] } | undefined)?.targets ?? [];
        const targetIds = rawTargets.map(extractId).filter((v): v is number => v !== undefined);
        const primaryId = extractId(value);
        if (primaryId !== undefined && !targetIds.includes(primaryId)) {
          return "Primary Target must also be included in Targets.";
        }
        return true;
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Strength", value: "strength" },
        { label: "Core", value: "core" },
        { label: "Warm-Up", value: "warm_up" },
        { label: "Cool-Down", value: "cool_down" },
        { label: "Mobility", value: "mobility" },
        { label: "Cardio", value: "cardio" },
        { label: "Recovery", value: "recovery" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "equipment",
      type: "select",
      hasMany: true,
      options: [
        { label: "Barbell", value: "barbell" },
        { label: "Dumbbell", value: "dumbbell" },
        { label: "Cable", value: "cable" },
        { label: "Machine", value: "machine" },
        { label: "Bench", value: "bench" },
        { label: "Bodyweight", value: "bodyweight" },
        { label: "Resistance Band", value: "resistance_band" },
        { label: "Treadmill", value: "treadmill" },
        { label: "Stationary Bike", value: "stationary_bike" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "defaultMeasurementType",
      type: "select",
      required: true,
      admin: {
        description: "How sets are measured by default. Individual program items can override this.",
      },
      options: [
        { label: "Total Weight", value: "total_weight" },
        { label: "Weight Each (per dumbbell/side)", value: "weight_each" },
        { label: "Bodyweight", value: "bodyweight" },
        { label: "Duration", value: "duration" },
      ],
    },
    {
      name: "instructions",
      type: "richText",
    },
    {
      name: "coachingNotes",
      type: "richText",
    },
    {
      name: "defaultAlternatives",
      type: "relationship",
      relationTo: "exercises",
      hasMany: true,
      admin: {
        description: "General alternatives. Individual program items may override these.",
      },
      validate: (value, { id }) => {
        if (!value || id === undefined) return true;
        const ids = (value as unknown[]).map(extractId).filter((v): v is number => v !== undefined);
        if (ids.includes(id as number)) {
          return "An exercise cannot be its own alternative.";
        }
        return true;
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "demoVideo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Inactive exercises stay visible in programs already using them but are hidden from new selections.",
      },
    },
  ],
};
