import Link from "next/link";
import type { WorkoutSummary } from "@/lib/types";
import { weekdayName } from "@/lib/dates";
import { OTHER_WORKOUT_TYPE } from "@/lib/workoutTypes";

function displayType(w: WorkoutSummary): string {
  return w.workout_type === OTHER_WORKOUT_TYPE && w.workout_type_custom
    ? w.workout_type_custom
    : w.workout_type;
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
  return (
    <Link
      href={`/workout/new?date=${dateKey}`}
      className="flex items-center gap-4 rounded-xl border border-card-border bg-card p-4 hover:border-accent transition"
    >
      <div className="w-24 shrink-0">
        <p className="font-medium">{dateKey}</p>
        <p className="text-xs text-neutral-400">{weekdayName(dateKey)}</p>
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
