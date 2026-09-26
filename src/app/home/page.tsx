import Link from "next/link";
import { requireUser } from "@/lib/session";
import { SERVICE_DEFS, HEALTH_LINKS } from "@/lib/constants";
import { ServiceCard } from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { ensureServiceCategories } from "@/lib/health";

export default async function HomePage() {
  const session = await requireUser();
  await ensureServiceCategories().catch(() => undefined);

  const [recentReports, services] = await Promise.all([
    prisma.report.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { analysis: true },
    }),
    prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const serviceCards =
    services.length > 0
      ? services.map((s) => {
          const def = SERVICE_DEFS.find((d) => d.slug === s.slug);
          return {
            href: def?.href ?? `/services/${s.slug}`,
            name: s.name,
            description: s.description,
            iconKey: s.iconKey,
            badge: s.isPlaceholder ? "Coming soon" : undefined,
          };
        })
      : SERVICE_DEFS.map((s) => ({
          href: s.href,
          name: s.name,
          description: s.description,
          iconKey: s.iconKey,
          badge: s.isPlaceholder ? "Coming soon" : undefined,
        }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 space-y-10 sm:space-y-14">
      <section className="animate-fade-up rounded-[1.5rem] sm:rounded-[2rem] border bg-[linear-gradient(135deg,var(--hero-from),var(--card))] p-5 sm:p-10 shadow-[var(--shadow-soft)]">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary sm:text-sm">
          Hello{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-2xl sm:text-4xl leading-tight">
          Report uploaded → AI analysis → Health summary
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:mt-4 sm:text-base">
          Add a new report to refresh your health picture. Analysis stays private to your account.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
          <Link href="/reports/new" className="w-full sm:w-auto">
            <Button size="lg" className="w-full min-h-12 sm:w-auto">
              Add report
            </Button>
          </Link>
          <Link href="/health" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full min-h-12 sm:w-auto">
              View health overview
            </Button>
          </Link>
        </div>
        {recentReports.length > 0 ? (
          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">
            {recentReports.map((r) => (
              <Link
                key={r.id}
                href={`/reports/${r.id}`}
                className="rounded-2xl border bg-card/80 px-4 py-3.5 text-sm hover:border-primary/40 focus-ring active:scale-[0.99]"
              >
                <p className="font-medium">{r.category.replace("_", " / ")}</p>
                <p className="mt-1 text-muted-foreground line-clamp-2">
                  {r.analysis?.summary ?? r.status}
                </p>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section>
        <div className="mb-5 sm:mb-6">
          <h2 className="font-display text-2xl sm:text-3xl">Care services</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Everything adjacent to your records, in one grid.
          </p>
        </div>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
          {serviceCards.map((s) => (
            <ServiceCard key={s.href} {...s} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl sm:text-3xl">Health</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Your personal health workspace.
        </p>
        <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
          {HEALTH_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-[1.25rem] border bg-card px-4 py-4 transition hover:border-primary/40 focus-ring active:scale-[0.99] sm:px-5"
            >
              <h3 className="font-display text-lg sm:text-xl">{l.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{l.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
