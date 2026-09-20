/**
 * The Custom Programs block at the top of the Programs page, and the heading
 * that introduces the free programs beneath it.
 *
 * A Server Component on purpose. app/(app)/programs/page.tsx decides from the
 * `custom_programs` feature flag whether to render it at all and hands it to
 * the client-side list as a prop. When the flag is Off nothing here is sent to
 * the browser: not the copy, not the prices, not the links.
 *
 *   coming_soon  both options with a "Coming soon" label. No prices, no link.
 *   live         both options with price and a button.
 */
import Link from "next/link";

import { CUSTOM_PROGRAM_OPTIONS, customProgramHref, formatRupees } from "@/lib/customPrograms";

export function CustomProgramsSection({ state }: { state: "coming_soon" | "live" }) {
  const live = state === "live";

  return (
    <section
      aria-labelledby="custom-programs-heading"
      className="rounded-2xl border border-accent/30 bg-accent/5 p-5 sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">CUSTOM PROGRAMS</p>
      <h2 id="custom-programs-heading" className="mt-1 font-display text-3xl tracking-wide">
        Built around you.
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600">
        Your goals, experience, schedule and preferences are personal. Choose the level of support that fits what you
        need.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {CUSTOM_PROGRAM_OPTIONS.map((option) => (
          <article key={option.type} className="flex flex-col rounded-xl border border-accent/40 bg-card p-5">
            <h3 className="font-display text-xl tracking-wide">{option.name}</h3>
            {live && (
              <p className="mt-1 text-sm font-semibold text-accent">{formatRupees(option.price)} · One-time</p>
            )}
            <p className="mt-3 flex-1 text-sm">{option.description}</p>
            {live ? (
              <Link
                href={customProgramHref(option.type)}
                className="mt-4 inline-block self-start text-sm font-medium text-accent hover:underline"
              >
                {option.cta} →
              </Link>
            ) : (
              <p className="mt-4">
                <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  Coming soon
                </span>
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function FreeProgramsHeading() {
  return (
    <div className="mt-8 mb-4">
      <h2 className="font-display text-2xl tracking-wide">Free Training Programs</h2>
      <p className="text-sm text-neutral-500">Choose a program and start training right away.</p>
    </div>
  );
}
