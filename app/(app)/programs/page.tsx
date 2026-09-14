"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProfile, leaveProgram } from "@/lib/profile";
import { PROGRAMS } from "@/lib/programs";
import AppShell from "@/components/AppShell";
import Modal from "@/components/Modal";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";

export default function ProgramsPage() {
  const { user, loading } = useAuth();

  const [loadingSelection, setLoadingSelection] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showLeaveSuccess, setShowLeaveSuccess] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    fetchProfile(user.id)
      .then((profile) => setSelectedId(profile?.selected_program_id ?? null))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load your program."))
      .finally(() => setLoadingSelection(false));
  }, [user, loading]);

  const handleLeaveConfirm = async () => {
    if (!user) return;
    setError(null);
    setLeaving(true);
    try {
      await leaveProgram(user.id);
      setSelectedId(null);
      setShowLeaveConfirm(false);
      setShowLeaveSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to leave program.");
    } finally {
      setLeaving(false);
    }
  };

  if (loading || (user && loadingSelection)) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </main>
    );
  }

  const content = (
    <>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {PROGRAMS.map((program) => {
          const isSelected = selectedId === program.id;
          return (
            <Link
              key={program.id}
              href={`/programs/${program.id}`}
              className={`block cursor-pointer rounded-xl border p-5 bg-card transition hover:border-accent ${
                isSelected ? "border-accent ring-1 ring-accent" : "border-card-border"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl tracking-wide">{program.name}</h2>
                  <p className="text-sm text-neutral-500">{program.subtitle}</p>
                </div>
                {isSelected && (
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      Selected
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowLeaveConfirm(true);
                      }}
                      className="rounded-full border border-card-border px-3 py-1 text-xs font-medium text-neutral-600 hover:border-red-300 hover:text-red-600"
                    >
                      Leave Program
                    </button>
                  </div>
                )}
              </div>

              <p className="mt-3 text-sm">{program.description}</p>

              <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500">
                {program.daysPerWeek} days/week &middot; ~{program.sessionMinutes} min/session &middot;{" "}
                {program.durationWeeks} weeks
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {program.schedule.map((d) => (
                  <span
                    key={d.day}
                    className="rounded-md bg-background border border-card-border px-2 py-1 text-xs"
                  >
                    Day {d.day}: {d.focus}
                  </span>
                ))}
              </div>

              <span className="mt-4 inline-block text-sm font-medium text-accent">
                {isSelected ? "View Plan →" : "View Plan & Select →"}
              </span>
            </Link>
          );
        })}
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
        </Modal>
      )}
    </>
  );

  if (user) {
    return <AppShell title="Programs">{content}</AppShell>;
  }

  return (
    <div className="flex-1">
      <LandingHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">{content}</main>
      <Footer />
    </div>
  );
}
