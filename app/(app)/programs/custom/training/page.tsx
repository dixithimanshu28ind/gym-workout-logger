import type { Metadata } from "next";

import Footer from "@/components/landing/Footer";
import LandingHeader from "@/components/landing/LandingHeader";
import {
  CustomTrainingFinalCta,
  CustomTrainingHero,
  CustomTrainingHowItWorks,
  MoreThanADocument,
  SafetyAndSuitability,
  WhatWeConsider,
  WhyCustomProgram,
} from "@/components/custom-training/CustomTrainingSections";
import { requireFeature } from "@/lib/features";

export const metadata: Metadata = {
  title: "Custom Training Program | Log & Train",
  description:
    "A personalized training program built around your goals, experience, schedule, equipment and preferences.",
};

// Evaluated on every request so a flag change is never served from a cached page.
export const dynamic = "force-dynamic";

/**
 * Public: anyone can read this page. It does not exist (a real 404) while
 * `custom_programs` is Off.
 *
 *   Coming soon  the page shows without a price, and its buttons open
 *                "Register your interest" (no login) so we can learn whether
 *                anyone wants this before building the paid flow (GYM-47).
 *   Live         the full offer; login is asked for at the buttons (GYM-41).
 */
export default async function CustomTrainingProgramPage() {
  const state = await requireFeature("custom_programs", "coming_soon");
  const mode = state === "live" ? "live" : "interest";

  return (
    <div className="flex-1">
      <LandingHeader />
      <main>
        <CustomTrainingHero mode={mode} />
        <WhyCustomProgram />
        <WhatWeConsider />
        <SafetyAndSuitability />
        <MoreThanADocument />
        <CustomTrainingHowItWorks mode={mode} />
        <CustomTrainingFinalCta mode={mode} />
      </main>
      <Footer />
    </div>
  );
}
