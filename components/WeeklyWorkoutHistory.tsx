"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { WorkoutSummary } from "@/lib/types";
import { addDays, formatDateKey, getWeekRange, parseLocalDateKey, weekdayName } from "@/lib/dates";
import WorkoutSummaryCard from "@/components/WorkoutSummaryCard";

function enumerateDateKeys(startKey: string, endKey: string): string[] {
  if (startKey > endKey) return [];
  const keys: string[] = [];
  let cursor = parseLocalDateKey(startKey);
  while (formatDateKey(cursor) <= endKey) {
    keys.push(formatDateKey(cursor));
    cursor = addDays(cursor, 1);
  }
  return keys;
}

function MissedDayTile({ dateKey }: { dateKey: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-card-border bg-card p-4">
      <p className="font-medium text-neutral-400">{weekdayName(dateKey)}</p>
      <div className="text-right">
        <p className="text-sm text-neutral-500">Missed</p>
        <Link href={`/workout/new?date=${dateKey}`} className="text-sm text-accent hover:underline">
          Log now
        </Link>
      </div>
    </div>
  );
}

export default function WeeklyWorkoutHistory({ workouts }: { workouts: WorkoutSummary[] }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const todayKey = useMemo(() => formatDateKey(new Date()), []);
  const firstWorkoutDateKey = useMemo(
    () => workouts.reduce((min, w) => (w.date < min ? w.date : min), workouts[0].date),
    [workouts]
  );

  const referenceDate = addDays(new Date(), -7 * weekOffset);
  const { start: weekStart, end: weekEnd } = getWeekRange(referenceDate);
  const weekStartKey = formatDateKey(weekStart);
  const weekEndKey = formatDateKey(weekEnd);

  const firstWorkoutWeekStartKey = formatDateKey(
    getWeekRange(parseLocalDateKey(firstWorkoutDateKey)).start
  );
  const canGoPrevious = weekStartKey > firstWorkoutWeekStartKey;
  const canGoNext = weekOffset > 0;

  const rangeStartKey = weekStartKey > firstWorkoutDateKey ? weekStartKey : firstWorkoutDateKey;
  const rangeEndKey = weekEndKey < todayKey ? weekEndKey : todayKey;
  const dateKeys = enumerateDateKeys(rangeStartKey, rangeEndKey);

  const weekLabel = `${weekStart.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} – ${weekEnd.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((o) => o + 1)}
          disabled={!canGoPrevious}
          className="text-sm text-accent hover:underline disabled:text-neutral-300 disabled:no-underline disabled:cursor-not-allowed"
        >
          ← Previous Week
        </button>
        <span className="text-sm text-neutral-500">{weekLabel}</span>
        <button
          onClick={() => setWeekOffset((o) => Math.max(0, o - 1))}
          disabled={!canGoNext}
          className="text-sm text-accent hover:underline disabled:text-neutral-300 disabled:no-underline disabled:cursor-not-allowed"
        >
          Next Week →
        </button>
      </div>

      {dateKeys.length === 0 ? (
        <p className="text-neutral-500 text-sm text-center py-4">No workout history for this week.</p>
      ) : (
        <div className="space-y-3">
          {dateKeys.map((dateKey) => {
            const dayWorkouts = workouts.filter((w) => w.date === dateKey);
            if (dayWorkouts.length === 0) {
              return <MissedDayTile key={dateKey} dateKey={dateKey} />;
            }
            return dayWorkouts.map((w) => <WorkoutSummaryCard key={w.id} workout={w} />);
          })}
        </div>
      )}
    </div>
  );
}
