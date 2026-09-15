/**
 * Browser-safe program data fetching, for client components. Goes through
 * the /api/programs route handlers (lib/cmsPrograms.ts is server-only — it
 * uses the Payload Local API and next/cache, neither importable from a
 * "use client" component).
 */
import type { Program, ProgramDetail } from "@/lib/types";

export async function fetchAllPrograms(): Promise<Program[]> {
  const res = await fetch("/api/programs");
  if (!res.ok) throw new Error("Failed to load programs.");
  const data = await res.json();
  return data.programs as Program[];
}

export async function fetchProgramById(
  id: string
): Promise<{ program: Program; detail: ProgramDetail } | null> {
  const res = await fetch(`/api/programs/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load program.");
  return res.json();
}
