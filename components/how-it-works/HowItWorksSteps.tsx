import type { ReactNode } from "react";

function ChooseTrainingVisual() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="flex-1 rounded-lg border border-card-border bg-card px-4 py-3 text-center text-sm font-medium">
        Log My Own Workout
      </div>
      <div className="flex-1 rounded-lg border border-card-border bg-card px-4 py-3 text-center text-sm font-medium">
        Choose a Program
      </div>
    </div>
  );
}

function TrainAndLogVisual() {
  return (
    <div className="rounded-xl border border-card-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm">Push</p>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
          Strength
        </span>
      </div>
      <div className="mt-2 rounded-lg border border-neutral-200 p-2">
        <p className="text-xs font-medium">Barbell Bench Press</p>
        <div className="mt-1 flex gap-1.5 text-[11px] text-neutral-500">
          <span className="rounded border border-neutral-200 px-1.5 py-0.5">60 kg</span>
          <span className="rounded border border-neutral-200 px-1.5 py-0.5">8 reps</span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-2">
        <p className="text-xs font-medium text-neutral-500">+ Add Workout</p>
      </div>
    </div>
  );
}

function KeepGoingVisual() {
  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-card-border bg-card p-3">
        <p className="text-[11px] text-neutral-500">Up next — based on your progress</p>
        <p className="font-display text-base">Pull</p>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-card-border bg-card p-3">
        <span className="text-xs text-neutral-500">Workout not completed</span>
        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
          Resume Workout
        </span>
      </div>
    </div>
  );
}

const WEEK_DOTS = ["done", "done", "missed", "done", "done", "rest", "upcoming"] as const;
const DOT_CLASS: Record<(typeof WEEK_DOTS)[number], string> = {
  done: "bg-accent text-accent-foreground",
  rest: "bg-sidebar text-sidebar-foreground",
  missed: "border border-dashed border-neutral-300 text-neutral-400",
  upcoming: "bg-neutral-100 text-neutral-300",
};

function TrainingHistoryVisual() {
  return (
    <div className="rounded-xl border border-card-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-neutral-500">This Week</p>
        <span className="text-[10px] text-neutral-400">5 of 7 logged</span>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {WEEK_DOTS.map((state, i) => (
          <div
            key={i}
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[8px] ${DOT_CLASS[state]}`}
          >
            {state === "done" ? "✓" : state === "missed" ? "–" : ""}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-neutral-600">
        <span>🔥 12 days</span>
        <span>42 total</span>
      </div>
    </div>
  );
}

interface Step {
  number: string;
  heading: string;
  description: string;
  bullets?: string[];
  visual: ReactNode;
}

const STEPS: Step[] = [
  {
    number: "01",
    heading: "Choose how you want to train",
    description:
      "Already have a routine? Start logging it. Want some structure? Choose one of the pre-designed programs.",
    visual: <ChooseTrainingVisual />,
  },
  {
    number: "02",
    heading: "Train and log it",
    description:
      "Record the exercises you actually perform, along with their sets, reps, weight or duration.",
    bullets: [
      "Change or add exercises",
      "Log different types of training",
      "Log more than one workout on the same day",
    ],
    visual: <TrainAndLogVisual />,
  },
  {
    number: "03",
    heading: "Keep going at your pace",
    description:
      "Following a program? Log & Train shows what's up next based on your progress, not the day of the week. Miss a workout, complete only part of one, or take a rest day — continue whenever you're ready.",
    visual: <KeepGoingVisual />,
  },
  {
    number: "04",
    heading: "See your training build up",
    description:
      "Every saved workout becomes part of your training history. See what you've trained, follow your consistency and pick up where you left off.",
    visual: <TrainingHistoryVisual />,
  },
];

export default function HowItWorksSteps() {
  return (
    <section className="bg-background py-4 sm:py-8">
      <div className="mx-auto max-w-5xl divide-y divide-card-border px-6">
        {STEPS.map((step, i) => {
          const reversed = i % 2 === 1;
          return (
            <div
              key={step.number}
              className="grid items-center gap-8 py-12 md:grid-cols-2 md:gap-16"
            >
              <div className={reversed ? "md:order-2" : ""}>
                <p className="font-display text-4xl text-accent">{step.number}</p>
                <h2 className="mt-2 font-display text-2xl leading-tight sm:text-3xl">
                  {step.heading}
                </h2>
                <p className="mt-3 text-base text-neutral-600">{step.description}</p>
                {step.bullets && (
                  <ul className="mt-4 space-y-2">
                    {step.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="mt-0.5 text-accent" aria-hidden>
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={reversed ? "md:order-1" : ""}>{step.visual}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
