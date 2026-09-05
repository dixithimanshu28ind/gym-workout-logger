function FollowPlanVisual() {
  return (
    <div className="rounded-lg border border-card-border bg-background p-3">
      <p className="text-[11px] font-medium text-neutral-500">Full Body + Conditioning</p>
      <p className="mt-1 font-display text-base">Up next: Pull</p>
      <p className="mt-1 text-[10px] text-neutral-500">Day 2 of your program</p>
      <div className="mt-3 w-fit rounded-full bg-accent/10 px-2 py-1 text-[10px] font-medium text-accent">
        View Programs
      </div>
    </div>
  );
}

function TrainYourWayVisual() {
  return (
    <div className="rounded-lg border border-card-border bg-background p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium">Custom Workout</p>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
          No program
        </span>
      </div>
      <div className="mt-2 rounded-md border border-dashed border-neutral-300 p-2">
        <p className="text-[11px] text-neutral-500">+ Add Exercise</p>
      </div>
      <div className="mt-2 rounded-md border border-neutral-200 p-2">
        <p className="text-xs font-medium">Kettlebell Swings</p>
        <div className="mt-1 flex gap-1.5 text-[11px] text-neutral-500">
          <span className="rounded border border-neutral-200 px-1.5 py-0.5">24 kg</span>
          <span className="rounded border border-neutral-200 px-1.5 py-0.5">15 reps</span>
        </div>
      </div>
    </div>
  );
}

function KeepGoingVisual() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-lg border border-card-border bg-background p-3">
        <span className="text-xs text-neutral-500">Missed</span>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
          Log now
        </span>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-card-border bg-background p-3">
        <span className="text-xs text-neutral-500">Workout not completed</span>
        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
          Resume Workout
        </span>
      </div>
    </div>
  );
}

function FeatureCard({
  heading,
  description,
  children,
}: {
  heading: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
      <h3 className="font-display text-xl">{heading}</h3>
      <p className="mt-2 text-sm text-neutral-600">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function CorePositioning() {
  return (
    <section className="bg-[#f2efe8] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">
            Structured when you want it.
            <br />
            Flexible when you need it.
          </h2>
          <p className="mt-4 text-base text-neutral-600">
            Follow a structured program or train your own way. Miss a day, change an exercise, do
            a shorter session or take a rest day — Log &amp; Train keeps your training moving
            without forcing everything to go perfectly.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <FeatureCard
            heading="Follow a plan"
            description="Choose a pre-designed training program and always know what workout is up next."
          >
            <FollowPlanVisual />
          </FeatureCard>
          <FeatureCard
            heading="Train your way"
            description="Already have your own routine? Log exactly what you train without needing to follow one of our programs."
          >
            <TrainYourWayVisual />
          </FeatureCard>
          <FeatureCard
            heading="Life happens. Keep going."
            description="Miss a workout, use an alternative exercise, finish only part of a session or take a rest day. Pick up where you left off when you're ready."
          >
            <KeepGoingVisual />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
