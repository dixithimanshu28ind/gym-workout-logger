import Link from "next/link";
import type { WorkoutSummary } from "@/lib/types";

export default function WorkoutSummaryCard({ workout }: { workout: WorkoutSummary }) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="block rounded-xl border border-neutral-200 p-4 hover:border-neutral-400 transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{workout.workout_type}</p>
          <p className="text-sm text-neutral-500">{workout.date}</p>
        </div>
        <span className="text-sm text-neutral-500">
          {workout.exerciseCount} exercise{workout.exerciseCount === 1 ? "" : "s"}
        </span>
      </div>
    </Link>
  );
}
