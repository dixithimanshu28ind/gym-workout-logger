import Link from "next/link";

import { getCmsProgramDetail } from "@/lib/cmsPrograms";
import ProgramPreviewSections from "@/components/ProgramPreviewSections";

export default async function ProgramPreviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getCmsProgramDetail(id);

  if (!result) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-sm text-neutral-500">
          We couldn&apos;t find that program in the CMS.{" "}
          <Link href="/programs-preview" className="text-accent hover:underline">
            Back to CMS Preview
          </Link>
        </p>
      </div>
    );
  }

  const { program, detail } = result;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>CMS Preview</strong> — reads live from Payload, not from the real app. Temporary; not linked
        anywhere.
      </div>

      <h1 className="font-display text-2xl tracking-wide">{program.name}</h1>
      <p className="text-sm text-neutral-500">{program.subtitle}</p>
      {detail.whatIsIt.map((p, i) => (
        <p key={i} className="mt-2 text-sm">
          {p}
        </p>
      ))}
      <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500">
        {program.daysPerWeek} days/week &middot; ~{program.sessionMinutes} min/session &middot;{" "}
        {program.durationWeeks} weeks
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {program.schedule.map((d) => (
          <span key={d.day} className="rounded-md border border-card-border bg-background px-2 py-1 text-xs">
            Day {d.day}: {d.focus}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <ProgramPreviewSections detail={detail} />
      </div>
    </div>
  );
}
