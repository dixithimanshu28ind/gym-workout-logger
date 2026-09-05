import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
import CorePositioning from "@/components/landing/CorePositioning";
import WorkoutProgramsSplit from "@/components/landing/WorkoutProgramsSplit";

export default function Home() {
  return (
    <div className="flex-1">
      <LandingHeader />
      <main>
        <Hero />
        <CorePositioning />
        <WorkoutProgramsSplit />
      </main>
    </div>
  );
}
