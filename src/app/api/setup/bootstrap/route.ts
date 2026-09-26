import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { ensureServiceCategories } from "@/lib/health";

/**
 * One-time bootstrap to create seeded accounts after DATABASE_URL is connected.
 * POST /api/setup/bootstrap
 * Header: x-seed-secret: <SEED_SECRET>
 */
export async function POST(req: Request) {
  const secret = req.headers.get("x-seed-secret") || "";
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await ensureServiceCategories();

    const adminEmail = (process.env.ADMIN_EMAILS || "ygulia3012@gmail.com")
      .split(",")[0]
      .trim()
      .toLowerCase();
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || "MedHealthAdmin!2026";
    const demoEmail = "demo@medhealthlocker.app";
    const demoPassword = process.env.DEMO_SEED_PASSWORD || "MedHealthDemo!2026";

    const adminHash = await bcrypt.hash(adminPassword, 12);
    const demoHash = await bcrypt.hash(demoPassword, 12);

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        name: "Ygulia",
        passwordHash: adminHash,
        role: "ADMIN",
        age: null,
        sex: null,
      },
      update: {
        passwordHash: adminHash,
        role: "ADMIN",
        name: "Ygulia",
      },
      select: { id: true, email: true, role: true },
    });

    const demo = await prisma.user.upsert({
      where: { email: demoEmail },
      create: {
        email: demoEmail,
        name: "Demo User",
        passwordHash: demoHash,
        role: "USER",
        age: 34,
        sex: "PREFER_NOT",
      },
      update: {
        passwordHash: demoHash,
        role: "USER",
      },
      select: { id: true, email: true, role: true },
    });

    return NextResponse.json({
      ok: true,
      users: [admin, demo],
      login: {
        admin: { email: adminEmail, password: adminPassword },
        demo: { email: demoEmail, password: demoPassword },
        adminUrl: "/admin",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Bootstrap failed. Is DATABASE_URL a reachable Postgres instance?",
      },
      { status: 500 },
    );
  }
}
