"use client";

import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { CUSTOM_TRAINING_QUESTIONNAIRE_PATH } from "@/lib/customPrograms";

const TONES = {
  accent: "bg-accent text-accent-foreground",
  dark: "bg-foreground text-background",
} as const;

// A success callback that does nothing. The sign-up modal's default is to send
// the user to /dashboard; passing any callback replaces that, so the visitor
// stays on this page (which is where they were reading about the program).
const stayOnThisPage = () => {};

/**
 * The button that starts the Custom Training Program. The page is public; login
 * is asked for here. Signed in: on to the questionnaire (a later card, so that
 * address does not exist yet). Signed out: the sign-up modal, then back on this
 * page.
 */
export default function CustomTrainingCta({
  label,
  tone = "accent",
}: {
  label: string;
  tone?: keyof typeof TONES;
}) {
  const { user, loading } = useAuth();
  const { openSignUp } = useAuthModal();
  const className = `inline-block rounded-lg px-6 py-3 text-sm font-medium hover:opacity-90 transition ${TONES[tone]}`;

  if (user) {
    return (
      // No prefetch for now: the questionnaire is a later card, so its address
      // does not exist yet and prefetching it would 404 in every visitor's
      // browser. Remove this once the questionnaire page is built.
      <Link href={CUSTOM_TRAINING_QUESTIONNAIRE_PATH} prefetch={false} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      // Until the session is known, a click must not open a sign-up modal for
      // someone who turns out to be signed in.
      onClick={() => {
        if (!loading) openSignUp(stayOnThisPage);
      }}
      className={className}
    >
      {label}
    </button>
  );
}
