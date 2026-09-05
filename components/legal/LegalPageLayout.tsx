import { ReactNode } from "react";
import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";

export default function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="flex-1">
      <LandingHeader />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-neutral-500">Last updated: {lastUpdated}</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-neutral-700 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
