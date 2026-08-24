"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createWorkout } from "@/lib/workouts";
import type { WorkoutFormData } from "@/lib/types";
import WorkoutForm from "@/components/WorkoutForm";

export default function NewWorkoutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
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
    <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Log New Workout</h1>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <WorkoutForm onSubmit={handleSubmit} submitLabel="Submit Workout" />
    </main>
  );
}
