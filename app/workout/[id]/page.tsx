"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWorkoutDetail, updateWorkout, deleteWorkout } from "@/lib/workouts";
import type { WorkoutFormData } from "@/lib/types";
import WorkoutForm from "@/components/WorkoutForm";
import AppShell from "@/components/AppShell";

export default function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();

  const [workout, setWorkout] = useState<(WorkoutFormData & { id: string }) | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [loadingWorkout, setLoadingWorkout] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
      return;
    }
    if (user) {
      fetchWorkoutDetail(id)
        .then((w) => {
          setWorkout(w);
          setDate(w.date);
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Failed to load workout."))
        .finally(() => setLoadingWorkout(false));
    }
  }, [user, loading, router, id]);

  if (loading || !user || loadingWorkout) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </main>
    );
  }

  if (error && !workout) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      </main>
    );
  }

  const handleSubmit = async (data: WorkoutFormData) => {
    setError(null);
    try {
      await updateWorkout(id, data);
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save changes.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteWorkout(id);
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete workout.");
      setDeleting(false);
    }
  };

  return (
    <AppShell
      title="Edit Workout"
      actions={
        !confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm text-red-600 hover:underline"
          >
            Delete Workout
          </button>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <span>Delete this workout?</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 font-medium hover:underline disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-neutral-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        )
      }
    >
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {workout && date && (
        <WorkoutForm
          date={date}
          onDateChange={setDate}
          initialData={workout}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      )}
    </AppShell>
  );
}
