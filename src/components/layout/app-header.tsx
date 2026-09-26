"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/reports", label: "Reports" },
  { href: "/health", label: "Health" },
  { href: "/consult", label: "Consult" },
  { href: "/profile", label: "Profile" },
];

type Props = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  logoutAction: () => Promise<void>;
};

export function AppHeader({ isLoggedIn, isAdmin, logoutAction }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    ...(isLoggedIn ? NAV_LINKS : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-[color-mix(in_oklab,var(--background)_92%,transparent)] backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href={isLoggedIn ? "/home" : "/"}
          className="min-w-0 font-display text-lg tracking-tight sm:text-xl"
        >
          <span className="sm:hidden">
            MED<span className="text-primary">-Health</span>
          </span>
          <span className="hidden sm:inline">
            MED-Health <span className="text-primary">Locker</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm focus-ring",
                pathname === l.href || pathname.startsWith(`${l.href}/`)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {isLoggedIn ? (
            <form action={logoutAction} className="hidden md:block">
              <Button type="submit" variant="ghost" size="sm">
                Log out
              </Button>
            </form>
          ) : (
            <>
              <Link href="/login" className="hidden xs:block sm:block">
                <Button variant="ghost" size="sm" className="min-h-10 px-3">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="min-h-10">
                  Sign up
                </Button>
              </Link>
            </>
          )}

          {isLoggedIn ? (
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-card text-foreground focus-ring md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          ) : (
            <Link href="/login" className="sm:hidden">
              <Button variant="ghost" size="sm" className="min-h-10 px-3">
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>

      {isLoggedIn && open ? (
        <div
          id="mobile-menu"
          className="border-t bg-card px-4 py-4 md:hidden animate-fade-up"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-2xl px-4 py-3 text-base focus-ring",
                  pathname === l.href || pathname.startsWith(`${l.href}/`)
                    ? "bg-secondary text-secondary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/medicines"
              className="rounded-2xl px-4 py-3 text-base hover:bg-muted focus-ring"
            >
              Medicines
            </Link>
            <Link
              href="/appointments"
              className="rounded-2xl px-4 py-3 text-base hover:bg-muted focus-ring"
            >
              Appointments
            </Link>
            <Link
              href="/wellness"
              className="rounded-2xl px-4 py-3 text-base hover:bg-muted focus-ring"
            >
              Wellness
            </Link>
            <form action={logoutAction} className="mt-2">
              <Button type="submit" variant="secondary" className="w-full min-h-12">
                Log out
              </Button>
            </form>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
