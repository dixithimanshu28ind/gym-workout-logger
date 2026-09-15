import { NextResponse } from "next/server";

import { getCmsPrograms } from "@/lib/cmsPrograms";

/**
 * Published programs, adapted to the app's existing Program shape. Backed by
 * the CMS (see lib/cmsPrograms.ts), cached and revalidated on publish.
 * Consumed by the web app's server components directly (no HTTP round
 * trip needed there) and by the future mobile app over this endpoint.
 */
export async function GET() {
  const programs = await getCmsPrograms();
  return NextResponse.json({ programs });
}
