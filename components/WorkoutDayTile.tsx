import Link from "next/link";
import type { WorkoutSummary } from "@/lib/types";
import { getOrdinalDateParts, weekdayName } from "@/lib/dates";
import { OTHER_WORKOUT_TYPE } from "@/lib/workoutTypes";
import { getProgramAbbreviation } from "@/lib/programAbbreviation";

function displayType(w: WorkoutSummary): string {
  return w.workout_type === OTHER_WORKOUT_TYPE && w.workout_type_custom
    ? w.workout_type_custom
    : w.workout_type;
}

/** One program tag for the whole day: the first program any of its entries is tied to, if any. */
function dayProgramAbbreviation(workouts: WorkoutSummary[]): string {
  const tiedProgramId = workouts.find((w) => w.program_id)?.program_id ?? null;
  return getProgramAbbreviation(tiedProgramId);
}

function WorkoutRow({ workouts, cap }: { workouts: WorkoutSummary[]; cap: number }) {
  const visible = workouts.slice(0, cap);
  const remaining = workouts.length - visible.length;

  return (
    <div className="flex min-w-0 flex-1 items-center divide-x divide-card-border">
      {visible.map((w, i) => (
        <div key={w.id} className={`min-w-0 flex-1 ${i > 0 ? "pl-4" : ""} ${i < visible.length - 1 || remaining > 0 ? "pr-4" : ""}`}>
          <p className="truncate font-medium">{displayType(w)}</p>
          <p className="text-sm text-neutral-500">
            {w.exerciseCount} exercise{w.exerciseCount === 1 ? "" : "s"}
          </p>
        </div>
      ))}
      {remaining > 0 && (
        <div className="shrink-0 pl-4 text-sm text-neutral-500">+{remaining} more</div>
      )}
    </div>
  );
}

export default function WorkoutDayTile({
  dateKey,
  workouts,
}: {
  dateKey: string;
  workouts: WorkoutSummary[];
}) {
  const { day, suffix, month, year } = getOrdinalDateParts(dateKey);

  return (
    <Link
      href={`/workout/new?date=${dateKey}`}
      className="flex items-center gap-4 rounded-xl border border-card-border bg-card p-4 hover:border-accent transition"
    >
      <div className="w-24 shrink-0 border-r border-card-border pr-4">
        <p className="font-medium">
          {day}
          <sup className="text-[0.65em]">{suffix}</sup> {month} {year}
        </p>
        <p className="text-xs text-neutral-400">{weekdayName(dateKey)}</p>
        <span className="mt-1 inline-block w-fit rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
          {dayProgramAbbreviation(workouts)}
        </span>
      </div>

      <div className="hidden min-w-0 flex-1 lg:flex">
        <WorkoutRow workouts={workouts} cap={3} />
      </div>
      <div className="hidden min-w-0 flex-1 sm:flex lg:hidden">
        <WorkoutRow workouts={workouts} cap={2} />
      </div>
      <div className="flex min-w-0 flex-1 sm:hidden">
        <WorkoutRow workouts={workouts} cap={1} />
      </div>
    </Link>
  );
}
