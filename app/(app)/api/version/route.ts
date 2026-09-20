import { NextResponse } from "next/server";

/**
 * Which commit this deployment was built from.
 *
 * The end-to-end suite polls this after a deploy, so it only runs once the URL
 * is actually serving the new build instead of guessing with a fixed wait.
 * Without it, a slow alias switch means tests run against the previous build
 * and report a pass for a commit they never saw.
 *
 * Deliberately tiny: just the commit SHA and the Vercel environment. Nothing
 * about the branch, commit message or author. The SHA is null outside a Vercel
 * build (local dev and `next start`).
 *
 * Dynamic and uncacheable on purpose, so a cached response can never make an
 * old build look like the new one.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      sha: process.env.VERCEL_GIT_COMMIT_SHA || null,
      environment: process.env.VERCEL_ENV || null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
