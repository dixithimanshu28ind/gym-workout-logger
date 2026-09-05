import Link from "next/link";

const FOCUS_CLASS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar rounded-sm";

const ACCOUNT_LINKS = [
  { href: "/signup", label: "Start Training" },
  { href: "/signin", label: "Sign In" },
];

const PLACEHOLDER_LEGAL_LINKS = ["Terms of Use", "Privacy Policy", "Fitness Disclaimer"];

function FooterPlaceholderGroup({ heading, labels }: { heading: string; labels: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground-muted">
        {heading}
      </p>
      <ul className="mt-4 space-y-3">
        {labels.map((label) => (
          <li key={label} className="text-sm text-sidebar-foreground-muted">
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

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
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm text-sidebar-foreground transition hover:text-accent ${FOCUS_CLASS}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="text-sm text-sidebar-foreground-muted">Support</li>
            </ul>
          </div>

          <FooterPlaceholderGroup heading="Legal" labels={PLACEHOLDER_LEGAL_LINKS} />
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
