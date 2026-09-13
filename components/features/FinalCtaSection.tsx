"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";

export default function FinalCtaSection() {
  const { user } = useAuth();
  const { openSignUp } = useAuthModal();
  const router = useRouter();

  return (
    <section className="bg-sidebar py-16 text-sidebar-foreground sm:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-3xl leading-tight sm:text-4xl">
          Ready for your next workout?
        </h2>
        <div className="mt-8 flex justify-center">
          {user ? (
            <button
              type="button"
              onClick={() => router.push("/workout/new")}
              className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition"
            >
              Log a Workout
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openSignUp()}
              className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition"
            >
              Start Training
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
