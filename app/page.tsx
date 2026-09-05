import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
import CorePositioning from "@/components/landing/CorePositioning";
import WorkoutProgramsSplit from "@/components/landing/WorkoutProgramsSplit";
import ProgressConsistency from "@/components/landing/ProgressConsistency";
import CommunityTeaser from "@/components/landing/CommunityTeaser";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex-1">
      <LandingHeader />
      <main>
        <Hero />
        <CorePositioning />
        <WorkoutProgramsSplit />
        <ProgressConsistency />
        <CommunityTeaser />
      </main>
      <Footer />
    </div>
  );
}
