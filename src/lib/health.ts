import { prisma } from "@/lib/db";
import { SERVICE_DEFS } from "@/lib/constants";

export async function ensureServiceCategories() {
  for (const [index, svc] of SERVICE_DEFS.entries()) {
    await prisma.serviceCategory.upsert({
      where: { slug: svc.slug },
      create: {
        slug: svc.slug,
        name: svc.name,
        description: svc.description,
        iconKey: svc.iconKey,
        sortOrder: index,
        isPlaceholder: svc.isPlaceholder,
        isActive: true,
      },
      update: {
        name: svc.name,
        description: svc.description,
        iconKey: svc.iconKey,
        sortOrder: index,
        isPlaceholder: svc.isPlaceholder,
      },
    });
  }
}

export async function synthesizeHealthOverview(userId: string) {
  const reports = await prisma.report.findMany({
    where: { userId, status: "READY", analysis: { isNot: null } },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { analysis: true },
  });

  if (!reports.length) {
    return {
      headline: "No reports yet",
      body: "Upload your first medical report to start building your health picture.",
      highlights: [] as string[],
      reportCount: 0,
    };
  }

  const highlights: string[] = [];
  const paramHistory = new Map<string, Array<{ value: string; status: string; date: string }>>();

  for (const report of reports) {
    const findings = Array.isArray(report.analysis?.findings)
      ? (report.analysis!.findings as Array<{
          parameter: string;
          value: string;
          status: string;
        }>)
      : [];
    for (const f of findings) {
      const key = f.parameter.toLowerCase().trim();
      const list = paramHistory.get(key) ?? [];
      list.push({
        value: f.value,
        status: f.status,
        date: report.createdAt.toISOString().slice(0, 10),
      });
      paramHistory.set(key, list);
    }
  }

  for (const [param, entries] of paramHistory) {
    if (entries.length < 2) continue;
    const statuses = entries.map((e) => e.status);
    if (statuses.includes("high") || statuses.includes("low")) {
      highlights.push(
        `${param}: tracked across ${entries.length} reports (latest ${entries[0].status} on ${entries[0].date}).`,
      );
    }
    if (highlights.length >= 5) break;
  }

  const latest = reports[0];
  const trends = latest.analysis?.trendsNoted;

  return {
    headline: `Health picture from ${reports.length} report${reports.length === 1 ? "" : "s"}`,
    body:
      trends ||
      latest.analysis?.summary ||
      "Your recent reports are saved. Add another report to unlock clearer trend insights.",
    highlights,
    reportCount: reports.length,
    latestCategory: latest.category,
    latestDate: latest.createdAt,
  };
}
