import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { appointmentSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const appointments = await prisma.appointment.findMany({
    where: { userId: session.user.id },
    include: { doctor: true },
    orderBy: { startsAt: "asc" },
  });
  return NextResponse.json({ appointments });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = appointmentSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  if (parsed.data.doctorId) {
    const doctor = await prisma.doctor.findFirst({
      where: { id: parsed.data.doctorId, userId: session.user.id },
    });
    if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }
  const appointment = await prisma.appointment.create({
    data: {
      userId: session.user.id,
      doctorId: parsed.data.doctorId || null,
      title: parsed.data.title,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
      location: parsed.data.location || null,
      notes: parsed.data.notes || null,
      status: parsed.data.status,
    },
  });
  return NextResponse.json({ appointment });
}
