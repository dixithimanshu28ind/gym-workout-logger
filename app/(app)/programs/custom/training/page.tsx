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
 * Public: anyone can read this page. Login is asked for at the buttons, not
 * here. It does not exist (a real 404) unless `custom_programs` is Live.
 */
export default async function CustomTrainingProgramPage() {
  await requireFeature("custom_programs");

  return (
    <div className="flex-1">
      <LandingHeader />
      <main>
        <CustomTrainingHero />
        <WhyCustomProgram />
        <WhatWeConsider />
        <SafetyAndSuitability />
        <MoreThanADocument />
        <CustomTrainingHowItWorks />
        <CustomTrainingFinalCta />
      </main>
      <Footer />
    </div>
  );
}
