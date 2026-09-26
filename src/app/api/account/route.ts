import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      reports: { include: { analysis: true }, orderBy: { createdAt: "desc" } },
      doctors: true,
      appointments: true,
      medicines: true,
      wellnessEntries: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { passwordHash: _, ...safe } = user;
  return NextResponse.json(safe);
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.user.delete({ where: { id: session.user.id } });
  return NextResponse.json({ ok: true });
}
