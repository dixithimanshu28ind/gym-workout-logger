import Link from "next/link";

const HIGHLIGHTS = [
  "Pre-designed programs",
  "Workout-by-workout guidance",
  "Exercise alternatives where available",
  "Training at your own pace",
];

function ProgramVisual() {
  return (
    <div className="mt-6 space-y-3 rounded-xl border border-card-border bg-background p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-neutral-500">Full Body + Conditioning</p>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
          Selected
        </span>
      </div>
      <p className="font-display text-lg">Up next: Pull</p>
      <p className="text-xs text-neutral-500">Day 2 of your program</p>

      <div className="rounded-lg border border-neutral-200 p-2">
        <p className="text-xs font-medium">Barbell Bench Press</p>
        <p className="mt-1 text-[11px] text-neutral-500">
          Alternative: Dumbbell Bench Press{" "}
          <span className="text-accent">Use Alternative</span>
        </p>
      </div>
    </div>
  );
}

export default function FollowProgramSection() {
  return (
    <section className="bg-[#f2efe8] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="rounded-3xl bg-sidebar p-8 text-sidebar-foreground md:order-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Follow a Program
            </p>
            <ProgramVisual />
          </div>

          <div className="md:order-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Follow a Program
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
              Want a plan? We&apos;ve got you covered.
            </h2>
            <p className="mt-4 text-base text-neutral-600">
              Choose a structured training program and always know what workout is up next.
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
            <Link
              href="/programs"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-accent px-4 py-1.5 text-sm font-medium text-accent transition hover:bg-accent hover:text-accent-foreground"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
