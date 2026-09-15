"use client";

import { useState } from "react";
import type { ProgramDetail } from "@/lib/types";
import { CollapsibleSection, TextBlockContent, WeekBlockContent } from "@/components/ProgramPlan";

/**
 * Accordion state wrapper for the temporary CMS preview pages
 * (app/(app)/programs-preview). Mirrors the same section layout as the real
 * program detail page (app/(app)/programs/[id]/page.tsx), minus the
 * auth/select/leave logic, which doesn't apply to a read-only preview.
 */
export default function ProgramPreviewSections({ detail }: { detail: ProgramDetail }) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <CollapsibleSection
        title={detail.warmUp.title}
        isOpen={openSection === "warmup"}
        onToggle={() => setOpenSection(openSection === "warmup" ? null : "warmup")}
      >
        <TextBlockContent block={detail.warmUp} />
      </CollapsibleSection>

      {detail.weekBlocks.map((block) => (
        <CollapsibleSection
          key={block.id}
          title={block.title}
          isOpen={openSection === block.id}
          onToggle={() => setOpenSection(openSection === block.id ? null : block.id)}
        >
          <WeekBlockContent block={block} />
        </CollapsibleSection>
      ))}

      <CollapsibleSection
        title={detail.coolDown.title}
        isOpen={openSection === "cooldown"}
        onToggle={() => setOpenSection(openSection === "cooldown" ? null : "cooldown")}
      >
        <TextBlockContent block={detail.coolDown} />
      </CollapsibleSection>

      <div className="rounded-xl border border-card-border bg-card p-5">
        <h3 className="font-display text-lg tracking-wide">{detail.safetyNote.title}</h3>
        <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
          {detail.safetyNote.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
