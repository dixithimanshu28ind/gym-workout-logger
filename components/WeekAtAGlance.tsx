import { addDays, formatDateKey, getWeekRange } from "@/lib/dates";
import type { WorkoutSummary } from "@/lib/types";
import { REST_DAY_WORKOUT_TYPE } from "@/lib/workoutTypes";

const WEEKDAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

type DayStatus = "done" | "rest" | "missed" | "upcoming";

interface DayInfo {
  dateKey: string;
  letter: string;
  status: DayStatus;
  isFirstProgramDay: boolean;
}

const STATUS_LABEL: Record<DayStatus, string> = {
  done: "Workout logged",
  rest: "Rest day",
  missed: "Missed",
  upcoming: "Upcoming",
};

const STATUS_CLASSES: Record<DayStatus, string> = {
  done: "bg-accent text-accent-foreground",
  rest: "bg-sidebar text-sidebar-foreground",
  missed: "border-2 border-dashed border-card-border text-neutral-300",
  upcoming: "border border-card-border text-neutral-400",
};

const STATUS_GLYPH: Record<DayStatus, string> = {
  done: "✓",
  rest: "z",
  missed: "–",
  upcoming: "",
};

export default function WeekAtAGlance({
  workouts,
  firstProgramDayKey,
}: {
  workouts: WorkoutSummary[];
  firstProgramDayKey: string | null;
}) {
  const today = new Date();
  const todayKey = formatDateKey(today);
  const { start } = getWeekRange(today);

  const byDate = new Map<string, WorkoutSummary[]>();
  for (const w of workouts) {
    const list = byDate.get(w.date) ?? [];
    list.push(w);
    byDate.set(w.date, list);
  }

  const days: DayInfo[] = Array.from({ length: 7 }, (_, i) => {
    const dateKey = formatDateKey(addDays(start, i));
    const dayWorkouts = byDate.get(dateKey) ?? [];

    let status: DayStatus;
    if (dayWorkouts.length > 0) {
      status = dayWorkouts.every((w) => w.workout_type === REST_DAY_WORKOUT_TYPE)
        ? "rest"
        : "done";
    } else if (dateKey < todayKey) {
      status = "missed";
    } else {
      status = "upcoming";
    }

    return {
      dateKey,
      letter: WEEKDAY_LETTERS[i],
      status,
      isFirstProgramDay: dateKey === firstProgramDayKey,
    };
  });

  const loggedCount = days.filter((d) => d.status === "done" || d.status === "rest").length;

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-medium">This Week</p>
        <p className="text-sm text-neutral-500">{loggedCount} of 7 logged</p>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day.dateKey} className="flex flex-col items-center">
            <div
              title={
                day.isFirstProgramDay
                  ? `${STATUS_LABEL[day.status]} · First day of this program`
                  : STATUS_LABEL[day.status]
              }
              className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${STATUS_CLASSES[day.status]}`}
            >
              {day.status === "upcoming" ? day.letter : STATUS_GLYPH[day.status]}
              {day.isFirstProgramDay && (
                <span
                  className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-card"
                  aria-hidden
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
