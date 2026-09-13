import Link from "next/link";

export default function ProgramsCallout() {
  return (
    <section className="bg-[#f2efe8] py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-display text-2xl leading-tight sm:text-3xl">
          Not sure where to start?
        </h2>
        <p className="mt-3 text-base text-neutral-600">
          Explore the pre-designed workout programs and choose one that fits how you want to
          train.
        </p>
        <Link
          href="/programs"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-accent px-4 py-1.5 text-sm font-medium text-accent transition hover:bg-accent hover:text-accent-foreground"
        >
          Explore Programs
        </Link>
      </div>
    </section>
  );
}
