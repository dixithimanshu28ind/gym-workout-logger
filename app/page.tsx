import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";

export default function Home() {
  return (
    <div className="flex-1">
      <LandingHeader />
      <main>
        <Hero />
      </main>
    </div>
  );
}
