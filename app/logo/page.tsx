import type { Metadata } from "next";
import LogoMark from "@/components/logo/LogoMark";

export const metadata: Metadata = {
  title: "Log & Train — Logo Mark Study",
  description:
    "A minimal review of the custom Log & Train ampersand-arrow mark: wordmark, standalone samples, and small-size legibility.",
  openGraph: {
    title: "Log & Train — Logo Mark Study",
    description:
      "A minimal review of the custom Log & Train ampersand-arrow mark: wordmark, standalone samples, and small-size legibility.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Log & Train — Logo Mark Study",
    description:
      "A minimal review of the custom Log & Train ampersand-arrow mark.",
  },
};

const SMALL_SIZES = [96, 64, 44, 32];

export default function LogoReviewPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-16 px-6 py-16 md:py-24">
      {/* Review header */}
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-foreground/50">
          Logo mark study
        </p>
        <h1
          className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 800 }}
        >
          Log &amp; Train — ampersand-arrow mark
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-foreground/60">
          One custom mark built from a heavy, rounded Poppins ExtraBold ampersand
          whose lower-right exit becomes an upward progress arrow. Reviewed in the
          wordmark, in isolation, and at small sizes.
        </p>
      </header>

      {/* Primary wordmark composition */}
      <section className="flex flex-col gap-4">
        <SectionLabel>Wordmark</SectionLabel>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-6">
          <span
            className="text-5xl leading-none text-foreground md:text-7xl"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            LOG
          </span>
          <LogoMark
            size={110}
            className="text-[#E8622A] md:h-auto md:w-[130px]"
            title="Log & Train ampersand-arrow mark"
          />
          <span
            className="text-5xl leading-none text-foreground md:text-7xl"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            TRAIN
          </span>
        </div>
      </section>

      {/* Standalone samples */}
      <section className="flex flex-col gap-4">
        <SectionLabel>Mark in isolation</SectionLabel>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SampleCard label="Orange on off-white" className="bg-[#FAF9F7]">
            <LogoMark size={140} className="text-[#E8622A]" />
          </SampleCard>
          <SampleCard label="App icon tile" className="bg-[#FAF9F7]">
            <div className="flex aspect-square w-40 items-center justify-center rounded-[28px] bg-[#171717] shadow-sm">
              <LogoMark size={104} className="text-[#E8622A]" />
            </div>
          </SampleCard>
        </div>
      </section>

      {/* Small-size strip */}
      <section className="flex flex-col gap-4">
        <SectionLabel>Small sizes</SectionLabel>
        <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-10">
          {SMALL_SIZES.map((px) => (
            <div key={px} className="flex flex-col items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg border border-card-border bg-card"
                style={{ width: 120, height: 120 }}
              >
                <LogoMark size={px} className="text-[#E8622A]" />
              </div>
              <span className="font-mono text-xs text-foreground/50">{px}px</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-xs uppercase tracking-widest text-foreground/40">
      {children}
    </h2>
  );
}

function SampleCard({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={`flex min-h-56 items-center justify-center rounded-xl border border-card-border ${className ?? ""}`}
      >
        {children}
      </div>
      <span className="font-mono text-xs text-foreground/50">{label}</span>
    </div>
  );
}
