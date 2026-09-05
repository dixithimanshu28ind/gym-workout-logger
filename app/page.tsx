import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
import CorePositioning from "@/components/landing/CorePositioning";

export default function Home() {
  return (
    <div className="flex-1">
      <LandingHeader />
      <main>
        <Hero />
        <CorePositioning />
      </main>
    </div>
  );
}
