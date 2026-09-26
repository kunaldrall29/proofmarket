import { StatusBadge } from "@/components/reports/status-badge";
import { Disclaimer } from "@/components/reports/disclaimer";

type Finding = {
  parameter: string;
  value: string;
  normalRange: string;
  status: string;
  meaning: string;
};

type Props = {
  summary: string;
  findings: Finding[];
  possibleConditions: string[];
  nextSteps: string[];
  trendsNoted?: string | null;
};

export function AnalysisResultView({
  summary,
  findings,
  possibleConditions,
  nextSteps,
  trendsNoted,
}: Props) {
  return (
    <div className="space-y-6 animate-fade-up">
      <Disclaimer />
      <section className="rounded-[1.25rem] border bg-card p-4 sm:p-6">
        <h2 className="font-display text-xl sm:text-2xl">Summary</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed text-[15px] sm:text-base">
          {summary}
        </p>
        {trendsNoted ? (
          <p className="mt-4 rounded-2xl bg-secondary/70 px-4 py-3 text-sm text-secondary-foreground">
            <span className="font-medium">Trends: </span>
            {trendsNoted}
          </p>
        ) : null}
      </section>

      <section className="rounded-[1.25rem] border bg-card p-4 sm:p-6">
        <h2 className="font-display text-xl sm:text-2xl mb-4">Values</h2>

        {/* Mobile: stacked cards */}
        <div className="space-y-3 md:hidden stagger">
          {findings.map((f) => (
            <article
              key={`${f.parameter}-${f.value}`}
              className="rounded-2xl border bg-[color-mix(in_oklab,var(--muted)_35%,var(--card))] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium leading-snug">{f.parameter}</h3>
                <StatusBadge status={f.status} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Value</dt>
                  <dd className="mt-0.5 font-medium">{f.value}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Normal range</dt>
                  <dd className="mt-0.5">{f.normalRange}</dd>
                </div>
              </dl>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.meaning}</p>
            </article>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="pb-3 font-medium">Parameter</th>
                <th className="pb-3 font-medium">Value</th>
                <th className="pb-3 font-medium">Normal range</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Meaning</th>
              </tr>
            </thead>
            <tbody className="stagger">
              {findings.map((f) => (
                <tr key={`${f.parameter}-${f.value}`} className="border-b last:border-0">
                  <td className="py-3 font-medium">{f.parameter}</td>
                  <td className="py-3">{f.value}</td>
                  <td className="py-3 text-muted-foreground">{f.normalRange}</td>
                  <td className="py-3">
                    <StatusBadge status={f.status} />
                  </td>
                  <td className="py-3 text-muted-foreground">{f.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-[1.25rem] border bg-card p-4 sm:p-5">
          <h3 className="font-display text-lg sm:text-xl">Discuss with a doctor</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {possibleConditions.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden>•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-[1.25rem] border bg-card p-4 sm:p-5">
          <h3 className="font-display text-lg sm:text-xl">Next steps</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {nextSteps.map((s) => (
              <li key={s} className="flex gap-2">
                <span aria-hidden>•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
