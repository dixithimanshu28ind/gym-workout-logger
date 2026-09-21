/**
 * Server-only feature-flag reads and guards (the registry and the rules are in
 * lib/featureFlags.ts). Everything here runs on the server, so a hidden feature
 * never reaches the browser, not even to flash on screen. Never read a flag
 * from a NEXT_PUBLIC_ variable: those are fixed at build time.
 *
 * The saved flags are read from the CMS through unstable_cache, tagged
 * "feature-flags". Saving the Feature Flags page expires that tag at once (see
 * globals/FeatureFlags.ts), and a 5-minute lifetime is a backstop for a flag
 * changed some other way.
 *
 * If the flags cannot be read, every feature is Off. A failure must never
 * reveal something.
 */
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

import { FEATURE_FLAGS_TAG } from "@/globals/FeatureFlags";
import { getPayloadClient } from "@/lib/payloadClient";
import {
  FEATURE_KEYS,
  isAtLeast,
  parseOverride,
  publicFeatureStates,
  resolveFeatureStates,
  type FeatureKey,
  type FeatureOverride,
  type FeatureState,
  type FeatureStates,
} from "@/lib/featureFlags";

const readSavedFlags = unstable_cache(
  async (): Promise<Record<string, unknown>> => {
    const payload = await getPayloadClient();
    const doc = (await payload.findGlobal({ slug: "feature-flags", depth: 0 })) as unknown as Record<string, unknown>;
    return Object.fromEntries(FEATURE_KEYS.map((key) => [key, doc[key] ?? null]));
  },
  ["cms-feature-flags"],
  { tags: [FEATURE_FLAGS_TAG], revalidate: 300 }
);

let warnedAboutProductionOverride = false;

/**
 * The environment override. Ignored on Vercel Production: production is
 * controlled by the CMS alone, and this stops a variable set on the wrong
 * environment (Vercel offers "all environments" by default) from bypassing it.
 *
 * Both checks are needed. `vercel env pull` writes VERCEL_ENV="production" into
 * a local .env.local, so VERCEL_ENV alone would also switch the override off in
 * `next dev`. NODE_ENV tells a dev server apart from a deployed one.
 */
function readOverride(): FeatureOverride {
  const raw = process.env.FEATURE_FLAGS_OVERRIDE;
  if (!raw) return {};

  if (process.env.VERCEL_ENV === "production" && process.env.NODE_ENV === "production") {
    if (!warnedAboutProductionOverride) {
      warnedAboutProductionOverride = true;
      console.warn("[features] FEATURE_FLAGS_OVERRIDE is set on Production and is ignored; use the CMS.");
    }
    return {};
  }

  const { override, warnings } = parseOverride(raw);
  for (const warning of warnings) console.warn(`[features] FEATURE_FLAGS_OVERRIDE: ${warning}`);
  return override;
}

// A database that accepts the connection and then never answers would hang the
// page instead of failing safe. The read carries on in the background and is
// cached if it finishes, so a merely slow CMS shows Off for one request only.
const READ_TIMEOUT_MS = 4000;

function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`no answer from the CMS within ${ms}ms`)), ms);
  });
  return Promise.race([work, timeout]).finally(() => clearTimeout(timer));
}

export async function getFeatureStates(): Promise<FeatureStates> {
  const override = readOverride();
  let saved: Record<string, unknown> | null;
  try {
    saved = await withTimeout(readSavedFlags(), READ_TIMEOUT_MS);
  } catch (err) {
    // Not cached, so the next request tries again.
    console.error("[features] could not read the flags from the CMS; treating every feature as off", err);
    saved = null;
  }
  return resolveFeatureStates(saved, override);
}

export async function getFeatureState(key: FeatureKey): Promise<FeatureState> {
  return (await getFeatureStates())[key];
}

/** Features that are Coming soon or Live, and nothing else. For GET /api/features. */
export async function getPublicFeatureStates() {
  return publicFeatureStates(await getFeatureStates());
}

/**
 * For a page (or layout) that belongs to a feature: a real 404 unless the
 * feature has reached `minimum`, so a hidden feature cannot be reached by typing
 * its URL. `minimum` defaults to Live; pass "coming_soon" for a page that is
 * meant to exist while the feature is only a teaser (it is then reachable in
 * Coming soon and Live, never in Off). Returns the state, so the page can
 * render the version that fits it. Give such a page
 * `export const dynamic = "force-dynamic"`.
 */
export async function requireFeature(
  key: FeatureKey,
  minimum: "coming_soon" | "live" = "live"
): Promise<FeatureState> {
  const state = await getFeatureState(key);
  if (!isAtLeast(state, minimum)) notFound();
  return state;
}

/**
 * For an API route or webhook that belongs to a feature. Returns a 404 response
 * unless the feature has reached `minimum` (Live by default), and null when the
 * request may go ahead:
 *
 *   const blocked = await requireFeatureForApi("custom_programs");
 *   if (blocked) return blocked;
 */
export async function requireFeatureForApi(
  key: FeatureKey,
  minimum: "coming_soon" | "live" = "live"
): Promise<NextResponse | null> {
  if (isAtLeast(await getFeatureState(key), minimum)) return null;
  return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
}
