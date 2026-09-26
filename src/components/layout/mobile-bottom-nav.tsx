"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  HeartPulse,
  Home,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/health", label: "Health", icon: HeartPulse },
  { href: "/consult", label: "Consult", icon: Stethoscope },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on auth/marketing pages
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms")
  ) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-[color-mix(in_oklab,var(--card)_94%,transparent)] backdrop-blur-md md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-0 px-1 pt-1">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href ||
            (tab.href !== "/home" && pathname.startsWith(tab.href));
          const Icon = tab.icon;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-[11px] font-medium focus-ring",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.25px]")} aria-hidden />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
