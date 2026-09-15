import Link from "next/link";

import { getCmsPrograms } from "@/lib/cmsPrograms";

/**
 * Temporary, unlinked preview of CMS-backed program data rendered through
 * the app's real UI components — lets us visually verify Milestone D's data
 * layer + adapter in production before cutting the real /programs pages
 * over. Delete this route (and /programs-preview/[id]) once that cutover
 * happens; nothing else depends on it.
 */
export default async function ProgramsPreviewPage() {
  const programs = await getCmsPrograms();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>CMS Preview</strong> — reads live from Payload, not from the real app. Temporary; not linked
        anywhere.
      </div>
      <h1 className="font-display text-2xl tracking-wide">Programs (CMS Preview)</h1>
      <div className="mt-6 space-y-4">
        {programs.map((program) => (
          <Link
            key={program.id}
            href={`/programs-preview/${program.id}`}
            className="block rounded-xl border border-card-border bg-card p-5 transition hover:border-accent"
          >
            <h2 className="font-display text-xl tracking-wide">{program.name}</h2>
            <p className="text-sm text-neutral-500">{program.subtitle}</p>
            <p className="mt-3 text-sm">{program.description}</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500">
              {program.daysPerWeek} days/week &middot; ~{program.sessionMinutes} min/session &middot;{" "}
              {program.durationWeeks} weeks
            </p>
          </Link>
        ))}
        {programs.length === 0 && <p className="text-sm text-neutral-500">No published programs found.</p>}
      </div>
    </div>
  );
}
