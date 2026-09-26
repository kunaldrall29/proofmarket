import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ensureServiceCategories } from "@/lib/health";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await ensureServiceCategories();

  const [users, reportCount, waitlist, services, usage] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { reports: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.report.count(),
    prisma.serviceWaitlist.groupBy({
      by: ["serviceSlug"],
      _count: true,
    }),
    prisma.serviceCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.usageEvent.groupBy({
      by: ["eventType"],
      _count: true,
    }),
  ]);

  return NextResponse.json({
    users,
    aggregates: {
      userCount: users.length,
      reportCount,
      waitlist,
      usage,
    },
    services,
  });
}

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();

  if (body.action === "setRole") {
    const userId = String(body.userId || "");
    const role = body.role === "ADMIN" ? "ADMIN" : "USER";
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true },
    });
    return NextResponse.json({ user });
  }

  if (body.action === "toggleService") {
    const slug = String(body.slug || "");
    const service = await prisma.serviceCategory.findUnique({ where: { slug } });
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = await prisma.serviceCategory.update({
      where: { slug },
      data: { isActive: !service.isActive },
    });
    return NextResponse.json({ service: updated });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
