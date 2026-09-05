"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigationGuard } from "@/contexts/NavigationGuardContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workout/new", label: "Log Workout" },
  { href: "/programs", label: "Programs" },
  { href: "/profile", label: "Profile" },
];

function initials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export default function AppShell({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { guardedNavigate } = useNavigationGuard();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const navigateTo = (href: string) => {
    if (href === pathname) return;
    guardedNavigate(() => router.push(href));
  };

  const handleSignOut = () => guardedNavigate(() => signOut());

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden sm:flex w-56 shrink-0 flex-col justify-between bg-sidebar text-sidebar-foreground px-4 py-6">
        <div className="space-y-8">
          <div className="font-display text-xl tracking-wide px-2">
            GYM<span className="text-accent">LOG</span>
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(item.href);
                }}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-sidebar-foreground-muted hover:bg-white/10 hover:text-sidebar-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {user && (
          <div className="flex items-center gap-2 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              {initials(user.email ?? "??")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{user.email}</p>
              <button
                onClick={handleSignOut}
                className="text-xs text-sidebar-foreground-muted hover:text-sidebar-foreground hover:underline"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="sm:hidden flex items-center justify-between bg-sidebar text-sidebar-foreground px-4 py-3">
          <span className="font-display text-lg tracking-wide">
            GYM<span className="text-accent">LOG</span>
          </span>
          {user && (
            <button
              onClick={handleSignOut}
              className="text-xs text-sidebar-foreground-muted hover:text-sidebar-foreground"
            >
              Sign Out
            </button>
          )}
        </div>
        <nav className="sm:hidden flex items-center gap-4 overflow-x-auto border-b border-card-border bg-card px-4 py-2 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                navigateTo(item.href);
              }}
              className={`whitespace-nowrap ${
                isActive(item.href) ? "font-semibold text-accent" : "text-neutral-500"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border px-6 py-4">
          <h1 className="font-display text-2xl tracking-wide">{title}</h1>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-neutral-500">{today}</span>
            {actions}
          </div>
        </div>

        <main className="flex-1 w-full px-6 py-8">
          <div className="max-w-3xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
