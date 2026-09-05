import Link from "next/link";

type DayState = "done" | "missed" | "today" | "upcoming";

const WEEK: { label: string; state: DayState }[] = [
  { label: "Mon", state: "done" },
  { label: "Tue", state: "done" },
  { label: "Wed", state: "missed" },
  { label: "Thu", state: "done" },
  { label: "Fri", state: "done" },
  { label: "Sat", state: "today" },
  { label: "Sun", state: "upcoming" },
];

function DayDot({ label, state }: { label: string; state: DayState }) {
  const dotClass =
    state === "done"
      ? "bg-accent text-accent-foreground"
      : state === "missed"
        ? "border border-dashed border-neutral-300 text-neutral-400"
        : state === "today"
          ? "border-2 border-accent text-accent"
          : "bg-neutral-100 text-neutral-300";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-neutral-400">{label}</span>
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-medium sm:h-8 sm:w-8 ${dotClass}`}
      >
        {state === "done" ? "✓" : state === "missed" ? "–" : label[0]}
      </div>
    </div>
  );
}

function DashboardVisual() {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-neutral-500">Dashboard</p>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
          Full Body + Conditioning
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-card-border bg-background p-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-neutral-500">This Week</p>
          <span className="text-[10px] text-neutral-400">5 of 7 logged</span>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {WEEK.map((day) => (
            <DayDot key={day.label} label={day.label} state={day.state} />
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-card-border bg-background p-3">
          <p className="text-[11px] text-neutral-500">Current Streak</p>
          <p className="mt-1 font-display text-lg">🔥 12 days</p>
        </div>
        <div className="rounded-lg border border-card-border bg-background p-3">
          <p className="text-[11px] text-neutral-500">Longest Streak</p>
          <p className="mt-1 font-display text-lg">🏆 18 days</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-card-border bg-background p-3">
        <p className="text-[11px] text-neutral-500">Workouts Logged</p>
        <p className="mt-1 font-display text-lg">42 total</p>
      </div>
    </div>
  );
}

function Highlight({ heading, description }: { heading: string; description: string }) {
  return (
    <div>
      <p className="font-display text-lg">{heading}</p>
      <p className="mt-1 text-sm text-neutral-600">{description}</p>
    </div>
  );
}

export default function ProgressConsistency() {
  return (
    <section className="bg-[#f2efe8] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="md:order-2">
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              See the work adding up.
            </h2>
            <p className="mt-4 text-base text-neutral-600">
              Every workout you log becomes part of your training history. See your consistency,
              follow your streaks and keep building from where you left off.
            </p>

            <div className="mt-8 space-y-6">
              <Highlight
                heading="Build consistency"
                description="Your workout history makes it easy to see the days you showed up and keep your training moving forward."
              />
              <Highlight
                heading="Your training, in one place"
                description="Look back at what you trained and quickly return to previous workouts when you need them."
              />
            </div>

            <div className="mt-6 border-t border-neutral-300 pt-6">
              <p className="text-sm font-medium">Progress doesn&apos;t require a perfect week.</p>
              <p className="mt-1 text-sm text-neutral-600">
                Miss a session? Keep going. Your previous workouts and progress stay right where
                you left them.
              </p>
            </div>

            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-accent px-4 py-1.5 text-sm font-medium text-accent transition hover:bg-accent hover:text-accent-foreground"
            >
              Start building your history
            </Link>
          </div>

          <div className="md:order-1">
            <DashboardVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
