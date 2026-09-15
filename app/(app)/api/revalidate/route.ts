import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Manual cache-invalidation escape hatch. Payload's own afterChange/
 * afterDelete hooks (collections/Programs.ts) already call revalidateTag
 * on every save made *through the deployed app* (admin UI, its REST API),
 * which covers normal editing. This exists for the one case that can't go
 * through that path: scripts/seed-programs.ts runs outside any Next.js
 * request, so its revalidateTag call is a no-op there (see the hook's own
 * try/catch) — Vercel's Data Cache is otherwise deployment-independent, so
 * a script-driven reseed leaves stale cached program data in production
 * until something calls this.
 *
 * Protected by PAYLOAD_SECRET (already a real, non-public secret) rather
 * than left open — this bypasses normal cache invalidation, not something
 * to expose unauthenticated.
 */
export async function POST(req: Request) {
  const secret = req.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("programs", "max");
  return NextResponse.json({ revalidated: true, tag: "programs" });
}
