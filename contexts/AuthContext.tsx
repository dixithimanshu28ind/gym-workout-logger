"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  /**
   * True from the moment the user clicks Sign Out until they sign in again.
   * Lets `useRequireAuth` tell "the user just signed out" apart from "there is
   * no session" (direct visit, expired session, signed out in another tab).
   */
  signedOutByUser: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signedOutByUser: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signedOutByUser, setSignedOutByUser] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      // Only a real sign-in clears the flag. TOKEN_REFRESHED also carries a
      // session, and one landing mid-sign-out must not undo it.
      if (event === "SIGNED_IN") setSignedOutByUser(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Set synchronously, before the request: the protected page's redirect
    // reads this the moment `user` becomes null.
    setSignedOutByUser(true);
    const { error } = await supabase.auth.signOut();
    // Still signed in, so nothing was signed out. Don't leave the flag set.
    if (error) setSignedOutByUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signedOutByUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * For pages that need a signed-in user. It is the one place that decides where
 * a visitor without a session goes, so no page decides for itself:
 *
 * - the user just clicked Sign Out  -> the homepage (GYM-24, GYM-37)
 * - anyone else with no session     -> /signin (direct visit, expired session,
 *   signed out in another tab)
 *
 * Each page used to run its own "no user -> /signin" effect. That raced the
 * sign-out navigation to "/": the page was still mounted when the user went
 * null, so its effect could win and land the user on /signin.
 */
export function useRequireAuth() {
  const { user, loading, signedOutByUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(signedOutByUser ? "/" : "/signin");
    }
  }, [loading, user, signedOutByUser, router]);

  return { user, loading };
}
