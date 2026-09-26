import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function ReportsPage() {
  const session = await requireUser();
  const reports = await prisma.report.findMany({
    where: { userId: session.user.id },
    include: { analysis: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">My reports</h1>
          <p className="mt-2 text-muted-foreground">History of uploads and AI analyses.</p>
        </div>
        <Link href="/reports/new">
          <Button>Add report</Button>
        </Link>
      </div>
      <div className="mt-8 space-y-3">
        {reports.length === 0 ? (
          <p className="rounded-[1.25rem] border bg-card p-6 text-muted-foreground">
            No reports yet. Upload your first report to get started.
          </p>
        ) : (
          reports.map((r) => (
            <Link
              key={r.id}
              href={`/reports/${r.id}`}
              className="block rounded-[1.25rem] border bg-card px-5 py-4 transition hover:border-primary/40 focus-ring"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{r.category.replaceAll("_", " / ")}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{r.status}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {r.analysis?.summary ?? r.errorMessage ?? "Processing…"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {r.createdAt.toLocaleString()}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
