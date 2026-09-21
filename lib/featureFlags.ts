/**
 * Feature flags: the registry and the pure rules for turning raw values into a
 * state. No imports and no I/O, so it is safe anywhere and easy to test
 * (scripts/feature-flags-test.ts). Reading the CMS, the cache and the guards
 * live in lib/features.ts, which is server-only.
 *
 * A feature is in one of three states:
 *   off          the feature does not exist (no entry points, pages 404, APIs refuse)
 *   coming_soon  entry points show a teaser; pages and APIs still refuse
 *   live         everything works
 *
 * To add a feature: add one entry to FEATURES below, then generate the
 * migration for its new column (see "Feature flags" in the README).
 */

export const FEATURE_STATES = ["off", "coming_soon", "live"] as const;
export type FeatureState = (typeof FEATURE_STATES)[number];

export const FEATURE_STATE_LABELS: Record<FeatureState, string> = {
  off: "Off",
  coming_soon: "Coming soon",
  live: "Live",
};

export type FeatureDefinition = {
  /** Shown in the CMS. */
  label: string;
  /** Shown under the label in the CMS, so an editor knows what they are switching. */
  description: string;
  /** Used when the CMS has no saved value yet. An unreadable CMS is always Off. */
  default: FeatureState;
};

export const FEATURES = {
  custom_programs: {
    label: "Custom Programs",
    description: "Paid, personalised programs offered on the Programs page.",
    default: "off",
  },
  community: {
    label: "Community",
    description: "Create or join a community, with posts, comments and reactions.",
    default: "off",
  },
} as const satisfies Record<string, FeatureDefinition>;

export type FeatureKey = keyof typeof FEATURES;

export const FEATURE_KEYS = Object.keys(FEATURES) as FeatureKey[];

export function isFeatureKey(value: string): value is FeatureKey {
  return Object.hasOwn(FEATURES, value);
}

export function isFeatureState(value: unknown): value is FeatureState {
  return typeof value === "string" && (FEATURE_STATES as readonly string[]).includes(value);
}

/**
 * States are ordered off < coming_soon < live. A page or API that opts in to
 * Coming soon (a "register your interest" page, say) is available in that state
 * and in Live: `isAtLeast(state, "coming_soon")`. The default everywhere else is
 * Live only.
 */
export function isAtLeast(state: FeatureState, minimum: FeatureState): boolean {
  return FEATURE_STATES.indexOf(state) >= FEATURE_STATES.indexOf(minimum);
}

export type FeatureStates = Record<FeatureKey, FeatureState>;
export type FeatureOverride = Partial<Record<FeatureKey, FeatureState>>;

/**
 * Reads FEATURE_FLAGS_OVERRIDE, a comma-separated list such as
 * `custom_programs=live,community=coming_soon`.
 *
 * It fails closed: a known feature with a value that is not a state (a typo like
 * `liev`) is forced Off rather than ignored, so a typo can never reveal
 * something. An unknown feature name is skipped with a warning.
 */
export function parseOverride(raw: string | undefined): { override: FeatureOverride; warnings: string[] } {
  const override: FeatureOverride = {};
  const warnings: string[] = [];

  for (const entry of (raw ?? "").split(",")) {
    const item = entry.trim();
    if (!item) continue;

    const eq = item.indexOf("=");
    const key = (eq === -1 ? item : item.slice(0, eq)).trim();
    const value = eq === -1 ? "" : item.slice(eq + 1).trim();

    if (!isFeatureKey(key)) {
      warnings.push(`unknown feature "${key}" ignored`);
      continue;
    }
    if (!isFeatureState(value)) {
      override[key] = "off";
      warnings.push(`"${key}=${value}" is not off, coming_soon or live; treating ${key} as off`);
      continue;
    }
    override[key] = value;
  }

  return { override, warnings };
}

/**
 * The state of every feature.
 *
 * `cms` is the saved flag values, or null when they could not be read. Order of
 * precedence for each feature:
 *   1. the environment override, if it names the feature
 *   2. CMS unreadable            -> off
 *   3. nothing saved yet         -> the registry default
 *   4. a saved value that is not a state -> off
 *   5. the saved value
 */
export function resolveFeatureStates(cms: Record<string, unknown> | null, override: FeatureOverride): FeatureStates {
  const states = {} as FeatureStates;

  for (const key of FEATURE_KEYS) {
    const forced = override[key];
    if (forced) {
      states[key] = forced;
      continue;
    }
    if (cms === null) {
      states[key] = "off";
      continue;
    }
    const saved = cms[key];
    if (saved === undefined || saved === null) {
      states[key] = FEATURES[key].default;
      continue;
    }
    states[key] = isFeatureState(saved) ? saved : "off";
  }

  return states;
}

/** What visitors may be told: only features that are Coming soon or Live. */
export function publicFeatureStates(states: FeatureStates): Partial<Record<FeatureKey, "coming_soon" | "live">> {
  const visible: Partial<Record<FeatureKey, "coming_soon" | "live">> = {};
  for (const key of FEATURE_KEYS) {
    const state = states[key];
    if (state === "coming_soon" || state === "live") visible[key] = state;
  }
  return visible;
}
