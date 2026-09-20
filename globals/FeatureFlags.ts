import type { GlobalAfterChangeHook, GlobalBeforeChangeHook, GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

import { FEATURE_KEYS, FEATURE_STATE_LABELS, FEATURE_STATES, FEATURES } from "../lib/featureFlags";

export const FEATURE_FLAGS_TAG = "feature-flags";

// Payload's version history stores what a flag was, not who changed it, so the
// editor is saved as a field and travels with every version.
const stampEditor: GlobalBeforeChangeHook = ({ data, req }) => ({
  ...data,
  updatedBy: req.user?.id ?? null,
});

// Expires the cache at once, not stale-while-revalidate ("max", used for
// Programs): a flag being switched off must not keep showing for one more
// visit. revalidateTag needs a Next.js request context, so swallow the
// standalone-script case as the Programs hooks do.
const refreshFlags: GlobalAfterChangeHook = async ({ doc }) => {
  try {
    revalidateTag(FEATURE_FLAGS_TAG, { expire: 0 });
  } catch {
    // Not running inside a Next.js request, e.g. a standalone script.
  }
  return doc;
};

export const FeatureFlags: GlobalConfig = {
  slug: "feature-flags",
  label: "Feature Flags",
  admin: {
    description:
      "Switch features Off, Coming soon or Live. Production and preview deployments share this CMS, so Live here means Live in production. Test unfinished work with the FEATURE_FLAGS_OVERRIDE environment variable instead.",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  // Every save is kept as a version: changing a flag changes production, so
  // there should be a record of what it was and who changed it.
  versions: { max: 200 },
  hooks: {
    beforeChange: [stampEditor],
    afterChange: [refreshFlags],
  },
  fields: [
    ...FEATURE_KEYS.map((key) => ({
      name: key,
      type: "select" as const,
      label: FEATURES[key].label,
      required: true,
      defaultValue: FEATURES[key].default,
      options: FEATURE_STATES.map((state) => ({ label: FEATURE_STATE_LABELS[state], value: state })),
      admin: { description: FEATURES[key].description },
    })),
    {
      name: "updatedBy",
      type: "relationship",
      relationTo: "users",
      label: "Last changed by",
      admin: { readOnly: true, position: "sidebar" },
    },
  ],
};
