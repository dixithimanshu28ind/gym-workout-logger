import Link from "next/link";
import type { WorkoutSummary } from "@/lib/types";
import { weekdayName } from "@/lib/dates";
import { OTHER_WORKOUT_TYPE } from "@/lib/workoutTypes";

export default function WorkoutSummaryCard({ workout }: { workout: WorkoutSummary }) {
  const displayType =
    workout.workout_type === OTHER_WORKOUT_TYPE && workout.workout_type_custom
      ? workout.workout_type_custom
      : workout.workout_type;

  return (
    <Link
      href={`/workout/${workout.id}`}
      className="block rounded-xl border border-card-border bg-card p-4 hover:border-accent transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{displayType}</p>
          <p className="text-sm text-neutral-500">{workout.date}</p>
          <p className="text-xs text-neutral-400">{weekdayName(workout.date)}</p>
        </div>
        <span className="text-sm text-neutral-500">
          {workout.exerciseCount} exercise{workout.exerciseCount === 1 ? "" : "s"}
        </span>
      </div>
    </Link>
  );
}
