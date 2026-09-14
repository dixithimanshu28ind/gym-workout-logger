import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surface a clear warning instead of crashing every route at import time
  // when the Supabase environment variables are not configured.
  console.warn(
    "[v0] Supabase environment variables are missing (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). Auth features will be unavailable until they are set.",
  );
}

// Fall back to harmless placeholders so importing this module never throws.
// Requests will fail at call time (rather than crashing render) if unconfigured.
export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "public-anon-key-placeholder",
);
