"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProfile } from "@/lib/profile";
import { PROGRAMS } from "@/lib/programs";
import AppShell from "@/components/AppShell";

export default function ProgramsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [loadingSelection, setLoadingSelection] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <AppShell title="Programs">
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
                  <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    Selected
                  </span>
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
    </AppShell>
  );
}
