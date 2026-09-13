const HIGHLIGHTS = [
  "Multiple workouts on the same day",
  "Sets, reps, weight or duration",
  "Own exercises and workout types",
  "Rest days and recovery activities",
];

function LogWorkoutVisual() {
  return (
    <div className="mt-6 space-y-3 rounded-xl border border-card-border bg-background p-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm">Push</p>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
          Strength
        </span>
      </div>
      <div className="rounded-lg border border-neutral-200 p-2">
        <p className="text-xs font-medium">Barbell Bench Press</p>
        <div className="mt-1 flex gap-1.5 text-[11px] text-neutral-500">
          <span className="rounded border border-neutral-200 px-1.5 py-0.5">60 kg</span>
          <span className="rounded border border-neutral-200 px-1.5 py-0.5">8 reps</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
        <p className="font-display text-sm">Cardio</p>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
          Running
        </span>
      </div>
      <div className="rounded-lg border border-neutral-200 p-2">
        <p className="text-xs font-medium">Treadmill</p>
        <div className="mt-1 flex gap-1.5 text-[11px] text-neutral-500">
          <span className="rounded border border-neutral-200 px-1.5 py-0.5">30 min</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
        <p className="font-display text-sm">Rest Day</p>
        <span className="rounded-full bg-sidebar px-2 py-0.5 text-[10px] font-medium text-sidebar-foreground">
          Recovery
        </span>
      </div>
    </div>
  );
}

export default function LogWorkoutsSection() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Log Your Workouts
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
              Train what you want. Log what you did.
            </h2>
            <p className="mt-4 text-base text-neutral-600">
              Log strength training, cardio, HIIT, mobility and recovery, or your own activity —
              whatever you actually did that day.
            </p>
            <ul className="mt-6 space-y-2">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
                  <span className="mt-0.5 text-accent" aria-hidden>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-card-border bg-card p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Log Workout
            </p>
            <LogWorkoutVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
