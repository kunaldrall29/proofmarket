import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { doctorSchema } from "@/lib/validations";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const doctor = await prisma.doctor.findFirst({
    where: { id, userId: session.user.id },
    include: { appointments: { orderBy: { startsAt: "desc" } } },
  });
  if (!doctor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ doctor });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const existing = await prisma.doctor.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = doctorSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const doctor = await prisma.doctor.update({
    where: { id },
    data: {
      name: parsed.data.name,
      specialty: parsed.data.specialty,
      contactEmail: parsed.data.contactEmail || null,
      contactPhone: parsed.data.contactPhone || null,
      notes: parsed.data.notes || null,
    },
  });
  return NextResponse.json({ doctor });
}

export async function DELETE(_: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const existing = await prisma.doctor.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.doctor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
