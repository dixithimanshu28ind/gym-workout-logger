"use client";

import { ReactNode } from "react";

export default function Modal({
  onClose,
  showCloseButton = true,
  children,
}: {
  onClose: () => void;
  showCloseButton?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-xl border border-card-border bg-card p-6 shadow-lg"
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-800"
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
