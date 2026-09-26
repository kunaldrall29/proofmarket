import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { medicineSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const medicines = await prisma.medicine.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });
  return NextResponse.json({ medicines });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = medicineSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const medicine = await prisma.medicine.create({
    data: {
      userId: session.user.id,
      name: parsed.data.name,
      dosage: parsed.data.dosage || null,
      frequency: parsed.data.frequency || null,
      startedOn: parsed.data.startedOn ? new Date(parsed.data.startedOn) : null,
      endedOn: parsed.data.endedOn ? new Date(parsed.data.endedOn) : null,
      notes: parsed.data.notes || null,
      isActive: parsed.data.isActive,
    },
  });
  return NextResponse.json({ medicine });
}
