"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWorkoutDetail } from "@/lib/workouts";

export default function WorkoutRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
      return;
    }
    if (user) {
      fetchWorkoutDetail(id)
        .then((w) => router.replace(`/workout/new?date=${w.date}`))
        .catch((e) => setError(e instanceof Error ? e.message : "Failed to load workout."));
    }
  }, [user, loading, router, id]);

  return (
    <main className="flex-1 flex items-center justify-center">
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-neutral-500">Loading...</p>
      )}
    </main>
  );
}
