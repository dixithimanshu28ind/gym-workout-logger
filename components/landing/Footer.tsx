"use client";

import Link from "next/link";
import { useAuthModal } from "@/contexts/AuthModalContext";

const FOCUS_CLASS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar rounded-sm";

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Use" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/fitness-disclaimer", label: "Fitness Disclaimer" },
];

function FooterLinkGroup({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground-muted">
        {heading}
      </p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`text-sm text-sidebar-foreground transition hover:text-accent ${FOCUS_CLASS}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const { openSignUp, openSignIn } = useAuthModal();

  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <p className="font-display text-2xl">
              LOG<span className="text-accent">&amp;</span>TRAIN
            </p>
            <p className="mt-2 text-sm text-sidebar-foreground-muted">Log. Train. Connect.</p>
            <p className="mt-4 text-sm text-sidebar-foreground-muted">
              Simple workout logging, structured programs and the flexibility to train your way.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground-muted">
              Product
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="#features"
                  className={`text-sm text-sidebar-foreground transition hover:text-accent ${FOCUS_CLASS}`}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className={`text-sm text-sidebar-foreground transition hover:text-accent ${FOCUS_CLASS}`}
                >
                  Programs
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className={`text-sm text-sidebar-foreground transition hover:text-accent ${FOCUS_CLASS}`}
                >
                  How It Works
                </Link>
              </li>
              <li className="flex items-center gap-1.5 text-sm text-sidebar-foreground-muted">
                Community
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium">
                  Coming Soon
                </span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground-muted">
              Account
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => openSignUp()}
                  className={`text-sm text-sidebar-foreground transition hover:text-accent ${FOCUS_CLASS}`}
                >
                  Start Training
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openSignIn()}
                  className={`text-sm text-sidebar-foreground transition hover:text-accent ${FOCUS_CLASS}`}
                >
                  Sign In
                </button>
              </li>
              <li>
                <Link
                  href="/support"
                  className={`text-sm text-sidebar-foreground transition hover:text-accent ${FOCUS_CLASS}`}
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <FooterLinkGroup heading="Legal" links={LEGAL_LINKS} />
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-sidebar-foreground-muted">
            © {year} Log &amp; Train. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
