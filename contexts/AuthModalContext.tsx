"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";

type AuthMode = "signup" | "signin";

interface AuthModalContextValue {
  openSignUp: (onSuccess?: (userId: string) => void) => void;
  openSignIn: (onSuccess?: (userId: string) => void) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return ctx;
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [onSuccessCallback, setOnSuccessCallback] = useState<
    ((userId: string) => void) | undefined
  >(undefined);

  const openSignUp = useCallback((onSuccess?: (userId: string) => void) => {
    setMode("signup");
    setOnSuccessCallback(() => onSuccess);
  }, []);

  const openSignIn = useCallback((onSuccess?: (userId: string) => void) => {
    setMode("signin");
    setOnSuccessCallback(() => onSuccess);
  }, []);

  const closeAuthModal = useCallback(() => {
    setMode(null);
    setOnSuccessCallback(undefined);
  }, []);

  return (
    <AuthModalContext.Provider value={{ openSignUp, openSignIn, closeAuthModal }}>
      {children}
      {mode && (
        <AuthModal
          mode={mode}
          onSwitchMode={setMode}
          onClose={closeAuthModal}
          onSuccess={(userId: string) => {
            if (onSuccessCallback) {
              onSuccessCallback(userId);
            } else {
              router.push("/dashboard");
            }
            closeAuthModal();
          }}
        />
      )}
    </AuthModalContext.Provider>
  );
}
