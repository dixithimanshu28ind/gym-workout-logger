"use client";

import { ReactNode } from "react";
import type {
  ExerciseRow,
  HiitDetail,
  ProgramDay,
  ProgramTextBlock,
  ProgramWeekBlock,
} from "@/lib/types";

export function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-card-border bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-display text-lg tracking-wide">{title}</span>
        <span className={`shrink-0 text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`}>
          &#9662;
        </span>
      </button>
      {isOpen && <div className="border-t border-card-border px-5 pb-5 pt-4">{children}</div>}
    </div>
  );
}

export function TextBlockContent({ block }: { block: ProgramTextBlock }) {
  return (
    <div className="space-y-3 text-sm">
      {block.intro && <p>{block.intro}</p>}
      {block.bullets && (
        <ul className="list-disc list-inside space-y-1">
          {block.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      {block.note && <p className="text-neutral-500">{block.note}</p>}
    </div>
  );
}

function ExerciseTable({ exercises }: { exercises: ExerciseRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm border-collapse">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 border-b border-card-border">
            <th className="py-2 pr-3">Exercise</th>
            <th className="py-2 pr-3">Target</th>
            <th className="py-2 pr-3">Sets &times; Reps</th>
            <th className="py-2 pr-3">Rest</th>
            <th className="py-2">Alternative</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, i) => (
            <tr key={i} className="border-b border-card-border last:border-0">
              <td className="py-2 pr-3 font-medium">{ex.exercise}</td>
              <td className="py-2 pr-3 text-neutral-500">{ex.target}</td>
              <td className="py-2 pr-3">{ex.setsReps}</td>
              <td className="py-2 pr-3 text-neutral-500">{ex.rest}</td>
              <td className="py-2 text-neutral-500">{ex.alternative}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HiitBlock({ hiit }: { hiit: HiitDetail }) {
  return (
    <div className="space-y-3 text-sm">
      {hiit.intro.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {hiit.rounds.map((r, i) => (
        <div key={i} className="rounded-lg border border-card-border p-3">
          <p className="font-medium">{r.label}</p>
          {r.warmUp && <p className="mt-1 text-xs text-neutral-500">Warm-up: {r.warmUp}</p>}
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div>
              <span className="block text-xs text-neutral-500">Hard effort</span>
              {r.hardEffort}
            </div>
            <div>
              <span className="block text-xs text-neutral-500">Easy cycling</span>
              {r.easyCycling}
            </div>
            <div>
              <span className="block text-xs text-neutral-500">Repeat</span>
              {r.repeat}
            </div>
          </div>
          {r.note && <p className="mt-2 text-xs text-neutral-500">{r.note}</p>}
        </div>
      ))}
      <p>
        <span className="font-medium">Cool-down: </span>
        {hiit.coolDown}
      </p>
    </div>
  );
}

function DayBlock({ day }: { day: ProgramDay }) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium">{day.title}</h4>
      {day.note && <p className="text-sm text-neutral-500">{day.note}</p>}
      {day.groups?.map((g, i) => (
        <div key={i} className="space-y-2">
          {g.heading && (
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{g.heading}</p>
          )}
          <ExerciseTable exercises={g.exercises} />
        </div>
      ))}
      {day.hiit && <HiitBlock hiit={day.hiit} />}
      {day.progressionNote && (
        <p className="text-xs italic text-neutral-500">* Progression: {day.progressionNote}</p>
      )}
    </div>
  );
}

export function WeekBlockContent({ block }: { block: ProgramWeekBlock }) {
  if (block.kind === "deload") {
    return (
      <ul className="list-disc list-inside space-y-1 text-sm">
        {block.body.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    );
  }
  return (
    <div className="space-y-6">
      {block.intro && <p className="text-sm text-neutral-500">{block.intro}</p>}
      {block.days.map((day) => (
        <DayBlock key={day.day} day={day} />
      ))}
    </div>
  );
}
