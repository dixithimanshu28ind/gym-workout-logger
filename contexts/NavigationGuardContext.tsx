"use client";

import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";

interface NavigationGuard {
  isDirty: () => boolean;
  onBlocked: (proceed: () => void) => void;
}

interface NavigationGuardContextValue {
  /**
   * Registers the active page's unsaved-changes check and what to do when a
   * guarded navigation is blocked by it. Only one guard is active at a time —
   * intended for the single page that currently cares (Log Workout).
   * Returns an unregister function to call on unmount.
   */
  registerGuard: (isDirty: () => boolean, onBlocked: (proceed: () => void) => void) => () => void;
  /**
   * Runs `action` immediately if no guard is registered or it reports clean;
   * otherwise defers to the guard's onBlocked handler with `action` as the
   * proceed callback (GYM-11 AC25).
   */
  guardedNavigate: (action: () => void) => void;
}

const NavigationGuardContext = createContext<NavigationGuardContextValue | null>(null);

export function NavigationGuardProvider({ children }: { children: ReactNode }) {
  const guardRef = useRef<NavigationGuard | null>(null);

  const registerGuard = useCallback(
    (isDirty: () => boolean, onBlocked: (proceed: () => void) => void) => {
      guardRef.current = { isDirty, onBlocked };
      return () => {
        guardRef.current = null;
      };
    },
    []
  );

  const guardedNavigate = useCallback((action: () => void) => {
    const guard = guardRef.current;
    if (guard && guard.isDirty()) {
      guard.onBlocked(action);
      return;
    }
    action();
  }, []);

  return (
    <NavigationGuardContext.Provider value={{ registerGuard, guardedNavigate }}>
      {children}
    </NavigationGuardContext.Provider>
  );
}

export function useNavigationGuard() {
  const ctx = useContext(NavigationGuardContext);
  if (!ctx) throw new Error("useNavigationGuard must be used within a NavigationGuardProvider");
  return ctx;
}
