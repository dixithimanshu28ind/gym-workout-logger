export default function CommunityTeaser() {
  return (
    <section className="bg-accent py-8 sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-block rounded-full bg-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wide text-background">
            Coming Soon
          </span>
          <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl">
            Training is personal. Progress can be shared.
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/90">
            We&apos;re building a space to connect with others, share the journey and keep each
            other moving.
          </p>
        </div>

        <p className="font-display text-2xl tracking-wide text-white sm:text-3xl">
          LOG. TRAIN. CONNECT.
        </p>
      </div>
    </section>
  );
}
