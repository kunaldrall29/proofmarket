import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { doctorSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const doctors = await prisma.doctor.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
    include: { appointments: { orderBy: { startsAt: "desc" }, take: 5 } },
  });
  return NextResponse.json({ doctors });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = doctorSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const doctor = await prisma.doctor.create({
    data: {
      userId: session.user.id,
      name: parsed.data.name,
      specialty: parsed.data.specialty,
      contactEmail: parsed.data.contactEmail || null,
      contactPhone: parsed.data.contactPhone || null,
      notes: parsed.data.notes || null,
    },
  });
  return NextResponse.json({ doctor });
}
