/**
 * Server-only read access to published Programs in the CMS, adapted into
 * the app's existing Program/ProgramDetail shapes. Wrapped in unstable_cache
 * tagged "programs" so publishing in /admin (see the afterChange/afterDelete
 * hooks in collections/Programs.ts) invalidates it immediately via
 * revalidateTag, without waiting for a redeploy.
 *
 * Used directly by server components (no HTTP round trip) and by the
 * /api/programs route handlers (which serve the same data over HTTP for
 * the future mobile app).
 */
import { unstable_cache } from "next/cache";

import type { Program, ProgramDetail } from "@/lib/types";
import { getPayloadClient } from "@/lib/payloadClient";
import { adaptCmsProgram, type CmsProgramDoc } from "@/lib/cmsAdapter";

async function fetchPublishedPrograms(): Promise<CmsProgramDoc[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "programs",
    where: { active: { equals: true } },
    depth: 2,
    limit: 100,
    sort: "id",
  });
  return result.docs as unknown as CmsProgramDoc[];
}

async function fetchPublishedProgramBySlug(slug: string): Promise<CmsProgramDoc | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "programs",
    where: { and: [{ slug: { equals: slug } }, { active: { equals: true } }] },
    depth: 2,
    limit: 1,
  });
  return (result.docs[0] as unknown as CmsProgramDoc | undefined) ?? null;
}

const getCachedPrograms = unstable_cache(
  async (): Promise<{ program: Program; detail: ProgramDetail }[]> => {
    const docs = await fetchPublishedPrograms();
    return docs.map(adaptCmsProgram);
  },
  ["cms-programs-all"],
  { tags: ["programs"] }
);

const getCachedProgramBySlug = unstable_cache(
  async (slug: string): Promise<{ program: Program; detail: ProgramDetail } | null> => {
    const doc = await fetchPublishedProgramBySlug(slug);
    if (!doc) return null;
    return adaptCmsProgram(doc);
  },
  ["cms-program-by-slug"],
  { tags: ["programs"] }
);

/** All published, active programs — for the programs list page. */
export async function getCmsPrograms(): Promise<Program[]> {
  const entries = await getCachedPrograms();
  return entries.map((e) => e.program);
}

/** One program's full detail by slug, or null if not found/unpublished. */
export async function getCmsProgramDetail(slug: string): Promise<{ program: Program; detail: ProgramDetail } | null> {
  return getCachedProgramBySlug(slug);
}
