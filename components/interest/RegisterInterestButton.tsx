"use client";

import { useState } from "react";

import Modal from "@/components/Modal";
import type { InterestKey } from "@/lib/interest";
import InterestForm from "./InterestForm";

const TONES = {
  accent: "bg-accent text-accent-foreground",
  dark: "bg-foreground text-background",
} as const;

/** A button that opens the "Register your interest" form in a modal. No login needed. */
export default function RegisterInterestButton({
  label,
  interest,
  tone = "accent",
}: {
  label: string;
  interest: InterestKey;
  tone?: keyof typeof TONES;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-block rounded-lg px-6 py-3 text-sm font-medium transition hover:opacity-90 ${TONES[tone]}`}
      >
        {label}
      </button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <InterestForm interest={interest} onClose={() => setOpen(false)} />
        </Modal>
      )}
    </>
  );
}
