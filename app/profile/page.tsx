"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProfile, upsertProfile } from "@/lib/profile";
import type { GymExperience, Profile } from "@/lib/types";
import AppShell from "@/components/AppShell";

const EXPERIENCE_OPTIONS: { value: GymExperience; label: string }[] = [
  { value: "rookie", label: "Rookie" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [targetWeightKg, setTargetWeightKg] = useState("");
  const [gymExperience, setGymExperience] = useState<GymExperience | "">("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
      return;
    }
    if (user) {
      fetchProfile(user.id)
        .then((profile) => {
          if (!profile) return;
          setName(profile.name ?? "");
          setAge(profile.age?.toString() ?? "");
          setWeightKg(profile.weight_kg?.toString() ?? "");
          setTargetWeightKg(profile.target_weight_kg?.toString() ?? "");
          setGymExperience(profile.gym_experience ?? "");
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Failed to load profile."))
        .finally(() => setLoadingProfile(false));
    }
  }, [user, loading, router]);

  if (loading || !user || loadingProfile) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </main>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const profile: Profile = {
      name: name.trim(),
      age: age ? Number(age) : null,
      weight_kg: weightKg ? Number(weightKg) : null,
      target_weight_kg: targetWeightKg ? Number(targetWeightKg) : null,
      gym_experience: gymExperience || null,
    };

    setSubmitting(true);
    try {
      await upsertProfile(user.id, profile);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="Profile">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium mb-1">
              Age
            </label>
            <input
              id="age"
              type="number"
              min="0"
              step="1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="gymExperience" className="block text-sm font-medium mb-1">
              Gym Experience
            </label>
            <select
              id="gymExperience"
              value={gymExperience}
              onChange={(e) => setGymExperience(e.target.value as GymExperience)}
              className={inputClass}
            >
              <option value="">Select...</option>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="weightKg" className="block text-sm font-medium mb-1">
              Weight (kg)
            </label>
            <input
              id="weightKg"
              type="number"
              min="0"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="targetWeightKg" className="block text-sm font-medium mb-1">
              Target Weight (kg)
            </label>
            <input
              id="targetWeightKg"
              type="number"
              min="0"
              step="0.1"
              value={targetWeightKg}
              onChange={(e) => setTargetWeightKg(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {saved && (
          <p className="text-sm text-green-700" role="status">
            Profile saved.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent text-accent-foreground font-medium py-2.5 hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </AppShell>
  );
}
