import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { wellnessSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const entries = await prisma.wellnessEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { entryDate: "desc" },
    take: 30,
  });
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = wellnessSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const entry = await prisma.wellnessEntry.create({
    data: {
      userId: session.user.id,
      mood: parsed.data.mood ?? null,
      journalText: parsed.data.journalText || null,
      entryDate: parsed.data.entryDate ? new Date(parsed.data.entryDate) : new Date(),
    },
  });
  return NextResponse.json({ entry });
}
