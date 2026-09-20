import { NextResponse } from "next/server";

import { getPublicFeatureStates } from "@/lib/features";

/**
 * Which features are Coming soon or Live. Features that are Off are left out,
 * so nothing unreleased is revealed. The end-to-end suite reads this to know
 * what to expect from each environment; the mobile app can use it too.
 *
 * Dynamic and uncacheable: a stale answer would misreport a flag that has just
 * been switched.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ features: await getPublicFeatureStates() }, { headers: { "Cache-Control": "no-store" } });
}
