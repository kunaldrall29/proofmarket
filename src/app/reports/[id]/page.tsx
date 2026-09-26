import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AnalysisResultView } from "@/components/reports/analysis-result";
import { Disclaimer } from "@/components/reports/disclaimer";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ id: string }> };

export default async function ReportDetailPage({ params }: Props) {
  const session = await requireUser();
  const { id } = await params;
  const report = await prisma.report.findFirst({
    where: { id, userId: session.user.id },
    include: { analysis: true },
  });
  if (!report) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {report.category.replaceAll("_", " / ")} · {report.createdAt.toLocaleString()}
          </p>
          <h1 className="font-display text-3xl mt-1">Analysis result</h1>
        </div>
        <Link href="/reports/new">
          <Button variant="secondary">Analyze another</Button>
        </Link>
      </div>

      {report.status === "FAILED" ? (
        <div className="space-y-4">
          <Disclaimer />
          <div className="rounded-[1.25rem] border border-danger/30 bg-card p-5 text-danger">
            {report.errorMessage ||
              "We could not read this report. Try a sharper image or paste the text instead."}
          </div>
        </div>
      ) : null}

      {report.analysis ? (
        <AnalysisResultView
          summary={report.analysis.summary}
          findings={report.analysis.findings as Array<{
            parameter: string;
            value: string;
            normalRange: string;
            status: string;
            meaning: string;
          }>}
          possibleConditions={report.analysis.possibleConditions as string[]}
          nextSteps={report.analysis.nextSteps as string[]}
          trendsNoted={report.analysis.trendsNoted}
        />
      ) : report.status !== "FAILED" ? (
        <p className="text-muted-foreground">Analysis is still processing…</p>
      ) : null}
    </div>
  );
}
