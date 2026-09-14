import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/landing/Footer";
import FeaturesHero from "@/components/features/FeaturesHero";
import LogWorkoutsSection from "@/components/features/LogWorkoutsSection";
import FollowProgramSection from "@/components/features/FollowProgramSection";
import FlexibleTrainingSection from "@/components/features/FlexibleTrainingSection";
import ConsistencyHistorySection from "@/components/features/ConsistencyHistorySection";
import TrainYourWaySection from "@/components/features/TrainYourWaySection";
import FinalCtaSection from "@/components/features/FinalCtaSection";

export default function FeaturesPage() {
  return (
    <div className="flex-1">
      <LandingHeader />
      <main>
        <FeaturesHero />
        <LogWorkoutsSection />
        <FollowProgramSection />
        <FlexibleTrainingSection />
        <ConsistencyHistorySection />
        <TrainYourWaySection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
