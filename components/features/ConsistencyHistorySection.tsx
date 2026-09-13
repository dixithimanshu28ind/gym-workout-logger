const WEEK: { label: string; state: "done" | "rest" | "missed" | "upcoming" }[] = [
  { label: "M", state: "done" },
  { label: "T", state: "done" },
  { label: "W", state: "missed" },
  { label: "T", state: "done" },
  { label: "F", state: "done" },
  { label: "S", state: "rest" },
  { label: "S", state: "upcoming" },
];

const STATUS_CLASSES: Record<(typeof WEEK)[number]["state"], string> = {
  done: "bg-accent text-accent-foreground",
  rest: "bg-sidebar text-sidebar-foreground",
  missed: "border-2 border-dashed border-card-border text-neutral-300",
  upcoming: "border border-card-border text-neutral-400",
};

const STATUS_GLYPH: Record<(typeof WEEK)[number]["state"], string> = {
  done: "✓",
  rest: "z",
  missed: "–",
  upcoming: "",
};

function DashboardVisual() {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-medium">This Week</p>
        <p className="text-xs text-neutral-500">5 of 7 logged</p>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {WEEK.map((day, i) => (
          <div
            key={i}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold sm:h-8 sm:w-8 ${STATUS_CLASSES[day.state]}`}
          >
            {day.state === "upcoming" ? day.label : STATUS_GLYPH[day.state]}
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-sidebar p-3 text-sidebar-foreground">
          <p className="text-[11px] text-sidebar-foreground-muted">Current Streak</p>
          <p className="mt-1 font-display text-lg">🔥 12 days</p>
        </div>
        <div className="rounded-xl border border-card-border bg-background p-3">
          <p className="text-[11px] text-neutral-500">Longest Streak</p>
          <p className="mt-1 font-display text-lg">🏆 18 days</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-card-border bg-background p-3">
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

export default function ConsistencyHistorySection() {
  return (
    <section className="bg-[#f2efe8] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="md:order-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Consistency &amp; History
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
              See the work adding up.
            </h2>
            <p className="mt-4 text-base text-neutral-600">
              Your workout history gives you a simple view of your training consistency and
              previous activity.
            </p>

            <div className="mt-8 space-y-6">
              <Highlight
                heading="Current &amp; longest streak"
                description="See how many days you're on right now, and the best run you've ever put together."
              />
              <Highlight
                heading="Weekly workout history"
                description="A simple week-by-week view of what you logged, so you can see your consistency at a glance."
              />
              <Highlight
                heading="Workouts logged"
                description="A running total of every workout you've logged, always up to date."
              />
            </div>
          </div>

          <div className="md:order-1">
            <DashboardVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
