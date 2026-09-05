"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "/programs", label: "Programs" },
  { href: "#how-it-works", label: "How It Works" },
];

export default function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-card-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl tracking-tight">
          LOG<span className="text-accent">&amp;</span>TRAIN
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-600 hover:text-foreground transition"
            >
              {item.label}
            </Link>
          ))}
          <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-400">
            Community
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
              Coming Soon
            </span>
          </span>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/signin" className="text-sm font-medium hover:text-accent transition">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition"
          >
            Start Training
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-card-border md:hidden"
        >
          <span className="sr-only">Toggle menu</span>
          {menuOpen ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-card-border px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-neutral-600"
              >
                {item.label}
              </Link>
            ))}
            <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-400">
              Community
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                Coming Soon
              </span>
            </span>
            <div className="mt-2 flex flex-col gap-3 border-t border-card-border pt-4">
              <Link href="/signin" className="text-sm font-medium">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-medium text-accent-foreground hover:opacity-90 transition"
              >
                Start Training
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
