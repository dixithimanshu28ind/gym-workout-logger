import Link from "next/link";

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
        <p className="font-display text-sm">Core</p>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
          Mobility
        </span>
      </div>
      <div className="rounded-lg border border-neutral-200 p-2">
        <p className="text-xs font-medium">Plank</p>
        <div className="mt-1 flex gap-1.5 text-[11px] text-neutral-500">
          <span className="rounded border border-neutral-200 px-1.5 py-0.5">45 sec</span>
        </div>
      </div>
    </div>
  );
}

function ProgramsVisual() {
  return (
    <div className="mt-6 space-y-2">
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-sm font-medium">Bro Split</p>
        <p className="mt-0.5 text-[11px] text-sidebar-foreground-muted">5-day split · 12 weeks</p>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-sm font-medium">PPLUL</p>
        <p className="mt-0.5 text-[11px] text-sidebar-foreground-muted">5-day split · 12 weeks</p>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-accent/30 bg-accent/10 p-3">
        <div>
          <p className="text-sm font-medium">Full Body + Conditioning</p>
          <p className="mt-0.5 text-[11px] text-sidebar-foreground-muted">Selected</p>
        </div>
        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
          Up next: Pull
        </span>
      </div>
    </div>
  );
}

export default function WorkoutProgramsSplit() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">
            Train your way. We&apos;ve got both covered.
          </h2>
          <p className="mt-4 text-base text-neutral-600">
            Follow your own routine or choose a structured program. Either way, Log &amp; Train
            keeps your training in one place.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-card-border bg-card p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Log Your Workout
            </p>
            <h3 className="mt-3 font-display text-2xl sm:text-3xl">Already have a routine?</h3>
            <p className="mt-3 text-neutral-600">
              Log strength training, cardio, mobility or whatever you train — your way.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-accent px-4 py-1.5 text-sm font-medium text-accent transition hover:bg-accent hover:text-accent-foreground"
            >
              Start logging
            </Link>
            <LogWorkoutVisual />
          </div>

          <div className="rounded-3xl bg-sidebar p-8 text-sidebar-foreground">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Follow a Program
            </p>
            <h3 className="mt-3 font-display text-2xl sm:text-3xl">Want some structure?</h3>
            <p className="mt-3 text-sidebar-foreground-muted">
              Choose a pre-designed program and always know what&apos;s up next while still
              having the flexibility to train at your own pace.
            </p>
            <Link
              href="/programs"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-accent px-4 py-1.5 text-sm font-medium text-accent transition hover:bg-accent hover:text-accent-foreground"
            >
              Explore programs
            </Link>
            <ProgramsVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
