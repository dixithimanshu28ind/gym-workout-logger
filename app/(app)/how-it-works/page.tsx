import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";
import HowItWorksHero from "@/components/how-it-works/HowItWorksHero";
import HowItWorksSteps from "@/components/how-it-works/HowItWorksSteps";
import ProgramsCallout from "@/components/how-it-works/ProgramsCallout";
import HowItWorksFinalCta from "@/components/how-it-works/HowItWorksFinalCta";

export default function HowItWorksPage() {
  return (
    <div className="flex-1">
      <LandingHeader />
      <main>
        <HowItWorksHero />
        <HowItWorksSteps />
        <ProgramsCallout />
        <HowItWorksFinalCta />
      </main>
      <Footer />
    </div>
  );
}
