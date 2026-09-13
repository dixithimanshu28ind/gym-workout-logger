function FlexibleVisual() {
  return (
    <div className="mt-6 space-y-2">
      <div className="flex items-center justify-between rounded-lg border border-card-border bg-background p-3">
        <span className="text-xs text-neutral-500">Missed</span>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
          Log now
        </span>
      </div>
      <div className="rounded-lg border border-card-border bg-background p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Workout not completed</span>
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
            Resume Workout
          </span>
        </div>
        <p className="mt-1 text-[11px] text-neutral-500">
          You completed 3 of 6 prescribed exercises.
        </p>
      </div>
      <div className="rounded-lg border border-card-border bg-background p-3">
        <p className="text-xs font-medium">Barbell Bench Press</p>
        <p className="mt-1 text-[11px] text-neutral-500">
          Alternative: Dumbbell Bench Press{" "}
          <span className="text-accent">Use Alternative</span>
        </p>
      </div>
    </div>
  );
}

export default function FlexibleTrainingSection() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Flexible Training
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            Your training doesn&apos;t have to be perfect.
          </h2>
          <p className="mt-4 text-base text-neutral-600">
            Miss a workout, complete only part of a session, swap in an alternative exercise, or
            train something different — you can always continue without restarting your plan.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-md rounded-3xl border border-card-border bg-card p-8">
          <FlexibleVisual />
        </div>
      </div>
    </section>
  );
}
