import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/lib/types";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("name, age, weight_kg, target_weight_kg, gym_experience, selected_program_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function upsertProfile(userId: string, profile: Profile): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert({ user_id: userId, ...profile }, { onConflict: "user_id" });

  if (error) throw new Error(error.message);
}

export async function selectProgram(userId: string, programId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert({ user_id: userId, selected_program_id: programId }, { onConflict: "user_id" });

  if (error) throw new Error(error.message);
}
