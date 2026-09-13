export default function TrainYourWaySection() {
  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-2xl leading-tight sm:text-3xl">
          A program when you need structure.
        </h2>
        <p className="mt-3 text-base text-neutral-600">
          Follow a pre-designed program, or log your own training your way — Log &amp; Train
          doesn&apos;t lock you into one approach.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full border border-card-border bg-card px-4 py-1.5 text-sm font-medium">
            Follow a Program
          </span>
          <span className="text-sm text-neutral-400">or</span>
          <span className="rounded-full border border-card-border bg-card px-4 py-1.5 text-sm font-medium">
            Train Your Own Way
          </span>
        </div>
      </div>
    </section>
  );
}
