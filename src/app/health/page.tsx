import Link from "next/link";
import { requireUser } from "@/lib/session";
import { synthesizeHealthOverview } from "@/lib/health";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/reports/disclaimer";

export default async function HealthOverviewPage() {
  const session = await requireUser();
  const overview = await synthesizeHealthOverview(session.user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <div>
        <h1 className="font-display text-3xl">Health overview</h1>
        <p className="mt-2 text-muted-foreground">
          A running picture synthesized from your report history — not a diagnosis.
        </p>
      </div>
      <Disclaimer />
      <section className="rounded-[1.5rem] border bg-card p-6 shadow-[var(--shadow-soft)] animate-fade-up">
        <h2 className="font-display text-2xl">{overview.headline}</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">{overview.body}</p>
        {overview.highlights.length > 0 ? (
          <ul className="mt-5 space-y-2 text-sm">
            {overview.highlights.map((h) => (
              <li key={h} className="rounded-2xl bg-secondary/60 px-4 py-3">
                {h}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-6">
          <Link href="/reports/new">
            <Button>Add another report</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
