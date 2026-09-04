"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProfile, selectProgram, leaveProgram } from "@/lib/profile";
import { getProgramById } from "@/lib/programs";
import { getProgramDetail } from "@/lib/programDetails";
import AppShell from "@/components/AppShell";
import Modal from "@/components/Modal";
import { CollapsibleSection, TextBlockContent, WeekBlockContent } from "@/components/ProgramPlan";

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();

  const program = getProgramById(id);
  const detail = getProgramDetail(id);

  const [loadingSelection, setLoadingSelection] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showLeaveSuccess, setShowLeaveSuccess] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const disclaimerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
      return;
    }
    if (user) {
      fetchProfile(user.id)
        .then((profile) => setSelectedId(profile?.selected_program_id ?? null))
        .catch((e) => setError(e instanceof Error ? e.message : "Failed to load your program."))
        .finally(() => setLoadingSelection(false));
    }
  }, [user, loading, router]);

  if (loading || !user || loadingSelection) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </main>
    );
  }

  if (!program || !detail) {
    return (
      <AppShell title="Program not found">
        <p className="text-sm text-neutral-500">
          We couldn&apos;t find that program.{" "}
          <Link href="/programs" className="text-accent hover:underline">
            Back to Programs
          </Link>
        </p>
      </AppShell>
    );
  }

  const isSelected = selectedId === program.id;

  const scrollToDisclaimer = () => {
    disclaimerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleConfirm = async () => {
    if (!agreed) return;
    setError(null);
    setSaving(true);
    try {
      await selectProgram(user.id, program.id);
      setSelectedId(program.id);
      setJustSelected(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to select program.");
    } finally {
      setSaving(false);
    }
  };

  const handleLeaveConfirm = async () => {
    setError(null);
    setLeaving(true);
    try {
      await leaveProgram(user.id);
      setSelectedId(null);
      setJustSelected(false);
      setShowLeaveConfirm(false);
      setShowLeaveSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to leave program.");
    } finally {
      setLeaving(false);
    }
  };

  return (
    <AppShell title={program.name}>
      {!isSelected && (
        <button
          onClick={scrollToDisclaimer}
          className="hidden sm:block fixed left-60 top-1/2 z-20 -translate-y-1/2 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-foreground shadow-lg transition hover:opacity-90"
        >
          Select & Start ↓
        </button>
      )}

      <div className="space-y-6">
        <div>
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
              <span
                key={d.day}
                className="rounded-md border border-card-border bg-background px-2 py-1 text-xs"
              >
                Day {d.day}: {d.focus}
              </span>
            ))}
          </div>
        </div>

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

        <div ref={disclaimerRef} className="space-y-4 rounded-xl border border-card-border bg-card p-5">
          <h3 className="font-display text-lg tracking-wide">Before You Start</h3>
          <p className="text-sm text-neutral-500">
            This workout plan provides general fitness guidance and is not medical advice. Exercise
            involves a risk of injury, and individual fitness levels and health conditions vary.
          </p>
          <p className="text-sm text-neutral-500">
            Start with weights and intensity appropriate for your ability. Stop exercising if you
            experience pain, dizziness, unusual shortness of breath, or feel unwell. If you have a
            medical condition, injury, are pregnant, or have concerns about starting an exercise
            program, consult a qualified healthcare professional first.
          </p>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5"
            />
            I understand and will exercise according to my own ability and health condition.
          </label>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {justSelected && (
            <p className="text-sm text-green-700" role="status">
              You&apos;re on the {program.name} program. See it on your Profile.
            </p>
          )}

          <button
            onClick={handleConfirm}
            disabled={!agreed || saving || isSelected}
            className="w-full rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
          >
            {isSelected ? "Current Program" : saving ? "Selecting..." : "Select & Start"}
          </button>
        </div>

        {isSelected && (
          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="w-full rounded-lg border border-card-border px-6 py-2.5 text-sm font-medium text-neutral-600 transition hover:border-red-300 hover:text-red-600 sm:w-auto"
          >
            Leave Program
          </button>
        )}
      </div>

      {showLeaveConfirm && (
        <Modal onClose={() => setShowLeaveConfirm(false)} showCloseButton={false}>
          <p className="text-sm">Are you sure you want to leave this program?</p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => setShowLeaveConfirm(false)}
              className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium hover:bg-background"
            >
              No
            </button>
            <button
              onClick={handleLeaveConfirm}
              disabled={leaving}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {leaving ? "Leaving..." : "Yes, Leave Program"}
            </button>
          </div>
        </Modal>
      )}

      {showLeaveSuccess && (
        <Modal onClose={() => setShowLeaveSuccess(false)}>
          <p className="text-sm">You&apos;ve left the program.</p>
          <div className="mt-5 flex justify-end">
            <Link
              href="/programs"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              Select Another Program
            </Link>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}
