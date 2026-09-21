/**
 * The sections of the Custom Training Program landing page (GYM-41), in page
 * order. Server Components: nothing here is interactive except the button,
 * which is its own client component. The page itself is guarded by the
 * `custom_programs` feature flag (see app/(app)/programs/custom/training).
 *
 * Copy follows the card. Say "program", never "plan". The price and the
 * delivery time come from lib/customPrograms.ts so they are written once.
 */
import Link from "next/link";

import {
  CUSTOM_PROGRAM_DELIVERY_TIME,
  formatRupees,
  getCustomProgramOption,
} from "@/lib/customPrograms";
import RegisterInterestButton from "@/components/interest/RegisterInterestButton";
import CustomTrainingCta from "./CustomTrainingCta";

/**
 * Which version of the page to show, from the `custom_programs` flag:
 *   live      the full offer: price, delivery time, "start the questionnaire".
 *   interest  Coming soon: no price and no delivery promise, and the buttons
 *             open the "Register your interest" form instead (GYM-47).
 */
export type LandingMode = "live" | "interest";

const price = () => `${formatRupees(getCustomProgramOption("training").price)} · One-time`;

// Shown in place of the price while the price is not final (GST and tax wording,
// business bank account), so nothing is promised that may change.
const FEE_COPY = "A small one-time fee";

const EYEBROW = "text-sm font-semibold tracking-[0.2em] text-accent";
const H2 = "font-display text-3xl leading-tight sm:text-4xl";

export function CustomTrainingHero({ mode }: { mode: LandingMode }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
      <p className={EYEBROW}>CUSTOM TRAINING PROGRAM</p>
      <h1 className="mt-4 font-display text-4xl leading-[1.1] sm:text-6xl">Built around you.</h1>
      <p className="mt-6 text-base text-neutral-600">
        No two people train exactly the same way. Your goals, experience, available time, equipment and preferences
        all affect what a practical training program should look like.
      </p>
      <p className="mt-4 text-base font-medium">
        Get a personalized training program built around how you actually train.
      </p>
      <p className="mt-8 font-display text-2xl text-accent">{mode === "live" ? price() : FEE_COPY}</p>
      <div className="mt-4">
        {mode === "live" ? (
          <CustomTrainingCta label="Build My Program →" />
        ) : (
          <RegisterInterestButton label="Register your interest →" interest="custom-training-program" />
        )}
      </div>
      <p className="mt-4 text-sm text-neutral-500">
        {mode === "live"
          ? `Personalized for you · Ready within ${CUSTOM_PROGRAM_DELIVERY_TIME}`
          : "Personalized for you · No payment needed now"}
      </p>
    </section>
  );
}

const FIT_EXAMPLES = [
  "One person can train five days; another can train three.",
  "One trains in a fully equipped gym; another has limited equipment.",
  "One is beginning; another has years of training experience.",
  "People may enjoy, dislike or need alternatives to different exercises.",
];

export function WhyCustomProgram() {
  return (
    <section className="border-t border-card-border bg-card py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className={`${H2} text-center`}>A good program has to fit your life, too.</h2>
        <p className="mt-4 text-center text-base text-neutral-600">
          Two people with the same goal may still need different training programs.
        </p>
        {/* Bullets read best left-aligned, so the list is a block centred on the page. */}
        <ul className="mx-auto mt-6 w-fit max-w-full space-y-3">
          {FIT_EXAMPLES.map((example) => (
            <li key={example} className="flex gap-3 text-base">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {example}
            </li>
          ))}
        </ul>
        {/* The conclusion of the section, so it is set apart from the examples above it. */}
        <p className="mx-auto mt-10 max-w-2xl text-balance rounded-xl border border-accent/30 bg-accent/5 px-6 py-5 text-center font-display text-2xl leading-snug tracking-wide">
          That&apos;s where a <span className="whitespace-nowrap text-accent">Custom Training Program</span> becomes useful.
        </p>
      </div>
    </section>
  );
}

const FACTORS = [
  { title: "Your Goal", body: "What you want to achieve through your training." },
  { title: "Your Experience", body: "The program should reflect your current training experience." },
  { title: "Your Schedule", body: "The number of days and amount of time you can realistically train." },
  { title: "Your Equipment", body: "Whether you have access to a full gym, limited equipment or another setup." },
  { title: "Your Preferences", body: "Exercises and training styles you enjoy or prefer to avoid." },
  {
    title: "Your Needs",
    body: "Other relevant information you provide that may affect how the program is structured.",
  },
];

export function WhatWeConsider() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className={`${H2} text-center`}>Your program starts with you.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FACTORS.map((factor) => (
            <div key={factor.title} className="rounded-xl border border-card-border bg-card p-5">
              <h3 className="font-display text-xl tracking-wide">{factor.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{factor.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SafetyAndSuitability() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-14 sm:pb-20">
      <div className="rounded-xl border border-card-border bg-card p-6">
        <h2 className="font-display text-2xl tracking-wide">Is it right for you?</h2>
        <p className="mt-3 text-sm text-neutral-600">
          The Custom Training Program is intended for people for whom general fitness programming is appropriate.
          Before you pay, a short questionnaire includes a suitability check.
        </p>
        <p className="mt-3 text-sm text-neutral-600">
          If your answers suggest this may not be right for your circumstances, we won&apos;t take payment or create a
          program. We&apos;ll suggest getting guidance from a qualified healthcare or fitness professional instead.
        </p>
      </div>
    </section>
  );
}

const IN_LOG_AND_TRAIN = [
  "Access your Training Program within Log & Train.",
  "Follow your program workout by workout.",
  "Log the workouts you complete.",
  "Keep your training history together.",
  "Keep using the Log & Train workout experience you already know.",
];

export function MoreThanADocument() {
  return (
    <section className="border-t border-card-border bg-card py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className={`${H2} text-center`}>More than a workout document.</h2>
        <p className="mt-4 text-center text-base text-neutral-600">
          Your Custom Training Program becomes part of your Log &amp; Train experience. You can:
        </p>
        <ul className="mx-auto mt-6 w-fit max-w-full space-y-3">
          {IN_LOG_AND_TRAIN.map((item) => (
            <li key={item} className="flex gap-3 text-base">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const steps = (mode: LandingMode) => [
  {
    title: "Tell us about yourself",
    body: "Answer questions about your goals, training experience, schedule, equipment and preferences.",
  },
  {
    title: "We build your program",
    body: "Your answers are used to create your personalized Training Program.",
  },
  {
    title: "Start training",
    // No delivery promise until the process that keeps it exists.
    body:
      mode === "live"
        ? `Your Training Program will be available in Log & Train within ${CUSTOM_PROGRAM_DELIVERY_TIME}.`
        : "Your Training Program will be available in Log & Train.",
  },
];

export function CustomTrainingHowItWorks({ mode }: { mode: LandingMode }) {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className={`${H2} text-center`}>How it works</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps(mode).map((step, index) => (
            <li key={step.title} className="rounded-xl border border-card-border bg-card p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                {index + 1}
              </span>
              <h3 className="mt-3 font-display text-xl tracking-wide">{step.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-center text-sm text-neutral-500">
          You don&apos;t need to stay on the page while your program is being prepared.
        </p>
      </div>
    </section>
  );
}

export function CustomTrainingFinalCta({ mode }: { mode: LandingMode }) {
  return (
    <>
      <section className="bg-accent py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl">
            Ready for a program built around you?
          </h2>
          <p className="mt-4 font-display text-2xl text-white">{mode === "live" ? price() : FEE_COPY}</p>
          <div className="mt-6">
            {mode === "live" ? (
              <CustomTrainingCta label="Start My Questionnaire →" tone="dark" />
            ) : (
              <RegisterInterestButton label="Tell us what you'd want →" interest="custom-training-program" tone="dark" />
            )}
          </div>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/90">
            {mode === "live"
              ? "You only pay after you've answered the questions, completed a short suitability check and reviewed your answers."
              : "No payment needed now. We'll email you when it's ready."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 text-center sm:py-16">
        <h2 className="font-display text-2xl tracking-wide">Not sure you need a Custom Training Program?</h2>
        <p className="mt-2 text-base text-neutral-600">Our ready-made Training Programs are free to use.</p>
        <Link href="/programs" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          Explore Free Programs →
        </Link>
      </section>
    </>
  );
}
