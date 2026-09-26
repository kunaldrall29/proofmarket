import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signupSchema } from "@/lib/validations";
import { isAdminEmail } from "@/lib/session";
import { ensureServiceCategories } from "@/lib/health";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { name, email, password, age, sex } = parsed.data;
    const normalized = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: normalized } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const role = isAdminEmail(normalized) ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        name,
        email: normalized,
        passwordHash,
        age: age ?? null,
        sex: sex ?? null,
        role,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    await ensureServiceCategories().catch(() => undefined);
    await prisma.usageEvent.create({
      data: { eventType: "signup", metadata: { role } },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
