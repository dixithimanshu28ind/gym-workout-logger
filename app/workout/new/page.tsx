"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createWorkout } from "@/lib/workouts";
import type { WorkoutFormData } from "@/lib/types";
import WorkoutForm from "@/components/WorkoutForm";
import AppShell from "@/components/AppShell";

export default function NewWorkoutPage() {
  return (
    <Suspense fallback={null}>
      <NewWorkoutPageInner />
    </Suspense>
  );
}

function NewWorkoutPageInner() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledDate = searchParams.get("date");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </main>
    );
  }

  const handleSubmit = async (data: WorkoutFormData) => {
    setError(null);
    try {
      await createWorkout(user.id, data);
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save workout.");
    }
  };

  return (
    <AppShell title="Log New Workout">
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <WorkoutForm
        initialData={
          prefilledDate ? { date: prefilledDate, workout_type: "", exercises: [] } : undefined
        }
        onSubmit={handleSubmit}
        submitLabel="Submit Workout"
      />
    </AppShell>
  );
}
