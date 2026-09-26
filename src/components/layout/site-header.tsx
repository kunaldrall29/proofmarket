import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/home", label: "Home" },
  { href: "/reports", label: "Reports" },
  { href: "/health", label: "Health" },
  { href: "/consult", label: "Consult" },
  { href: "/profile", label: "Profile" },
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b bg-[color-mix(in_oklab,var(--background)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={session ? "/home" : "/"} className="font-display text-xl tracking-tight">
          MED-Health <span className="text-primary">Locker</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {session
            ? links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-ring"
                >
                  {l.label}
                </Link>
              ))
            : null}
          {session?.user.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="rounded-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-ring"
            >
              Admin
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          {session ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="ghost" size="sm">
                Log out
              </Button>
            </form>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
