import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { medicineSchema } from "@/lib/validations";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const existing = await prisma.medicine.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.medicine.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const existing = await prisma.medicine.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = medicineSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const medicine = await prisma.medicine.update({
    where: { id },
    data: {
      ...parsed.data,
      dosage: parsed.data.dosage ?? existing.dosage,
      startedOn: parsed.data.startedOn ? new Date(parsed.data.startedOn) : existing.startedOn,
      endedOn: parsed.data.endedOn ? new Date(parsed.data.endedOn) : existing.endedOn,
    },
  });
  return NextResponse.json({ medicine });
}
