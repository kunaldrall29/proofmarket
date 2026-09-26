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
      <section className="rounded-[1.25rem] border bg-card p-5 sm:p-6">
        <h2 className="font-display text-2xl">Summary</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">{summary}</p>
        {trendsNoted ? (
          <p className="mt-4 rounded-2xl bg-secondary/70 px-4 py-3 text-sm text-secondary-foreground">
            <span className="font-medium">Trends: </span>
            {trendsNoted}
          </p>
        ) : null}
      </section>

      <section className="rounded-[1.25rem] border bg-card p-5 sm:p-6 overflow-x-auto">
        <h2 className="font-display text-2xl mb-4">Values</h2>
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
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-[1.25rem] border bg-card p-5">
          <h3 className="font-display text-xl">Discuss with a doctor</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {possibleConditions.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden>•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-[1.25rem] border bg-card p-5">
          <h3 className="font-display text-xl">Next steps</h3>
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
