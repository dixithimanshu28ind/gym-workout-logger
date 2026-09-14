import type { CollectionConfig } from "payload";

export const Targets: CollectionConfig = {
  slug: "targets",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "targetType", "parentTarget", "active"],
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
      name: "targetType",
      type: "select",
      required: true,
      options: [
        { label: "Body Part", value: "body_part" },
        { label: "Muscle Region", value: "muscle_region" },
        { label: "Core", value: "core" },
        { label: "Warm-Up", value: "warm_up" },
        { label: "Cool-Down", value: "cool_down" },
        { label: "Mobility", value: "mobility" },
        { label: "Conditioning", value: "conditioning" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "parentTarget",
      type: "relationship",
      relationTo: "targets",
      hasMany: false,
      admin: {
        description: 'e.g. "Upper Chest" → "Chest", "Rear Shoulders" → "Shoulders"',
      },
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Inactive targets stay attached to existing content but are hidden from new selections.",
      },
    },
    {
      name: "displayOrder",
      type: "number",
    },
    {
      name: "relatedExercises",
      type: "join",
      collection: "exercises",
      on: "targets",
    },
  ],
};
