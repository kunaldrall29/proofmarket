import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-8">
        <p>© {new Date().getFullYear()} MED-Health Locker. Your records, your control.</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="min-h-10 inline-flex items-center hover:text-foreground focus-ring rounded">
            Privacy
          </Link>
          <Link href="/terms" className="min-h-10 inline-flex items-center hover:text-foreground focus-ring rounded">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
