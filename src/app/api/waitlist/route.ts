import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || session?.user?.email || "").trim().toLowerCase();
  const serviceSlug = String(body.serviceSlug || "").trim();
  if (!email || !serviceSlug) {
    return NextResponse.json({ error: "Email and service are required." }, { status: 400 });
  }
  const entry = await prisma.serviceWaitlist.create({
    data: {
      email,
      serviceSlug,
      userId: session?.user?.id ?? null,
    },
  });
  await prisma.usageEvent.create({
    data: { eventType: "waitlist", category: serviceSlug },
  });
  return NextResponse.json({ entry });
}
