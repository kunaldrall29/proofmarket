import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { analyzeReportContent, buildHistoryContext } from "@/lib/anthropic";
import { DISCLAIMER_VERSION } from "@/lib/constants";
import type { ReportCategory } from "@prisma/client";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const category = String(form.get("category") || "GENERAL") as ReportCategory;
    const text = String(form.get("text") || "").trim();
    const file = form.get("file");

    const validCategories = ["GENERAL", "DIABETES", "CARDIAC", "ONCOLOGY", "KIDNEY_LIVER"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid report category." }, { status: 400 });
    }

    let storageUrl: string | undefined;
    let storagePath: string | undefined;
    let imageBase64: string | undefined;
    let imageMediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" | undefined;
    let sourceType: "IMAGE" | "TEXT" = "TEXT";

    if (file && file instanceof File && file.size > 0) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            error:
              "Unsupported file type. Please upload a JPG, PNG, WEBP, or GIF image of your report.",
          },
          { status: 400 },
        );
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: "File is too large. Please upload an image under 8 MB." },
          { status: 400 },
        );
      }

      sourceType = "IMAGE";
      const buffer = Buffer.from(await file.arrayBuffer());
      imageBase64 = buffer.toString("base64");
      imageMediaType = file.type as typeof imageMediaType;

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(
          `reports/${session.user.id}/${Date.now()}-${file.name}`,
          buffer,
          {
            access: "public",
            contentType: file.type,
            token: process.env.BLOB_READ_WRITE_TOKEN,
          },
        );
        storageUrl = blob.url;
        storagePath = blob.pathname;
      }
    } else if (!text) {
      return NextResponse.json(
        { error: "Add report text or upload a report image to continue." },
        { status: 400 },
      );
    }

    const report = await prisma.report.create({
      data: {
        userId: session.user.id,
        category,
        sourceType,
        rawText: text || null,
        storageUrl,
        storagePath,
        status: "ANALYZING",
      },
    });

    try {
      const historyContext = await buildHistoryContext(session.user.id, 3);
      const analysis = await analyzeReportContent({
        category,
        text: text || undefined,
        imageBase64,
        imageMediaType,
        historyContext,
      });

      await prisma.reportAnalysis.create({
        data: {
          reportId: report.id,
          summary: analysis.summary,
          findings: analysis.findings,
          possibleConditions: analysis.possibleConditions,
          nextSteps: analysis.nextSteps,
          trendsNoted: analysis.trendsNoted ?? null,
          model: "claude-sonnet-4-20250514",
          disclaimerVersion: DISCLAIMER_VERSION,
        },
      });

      await prisma.report.update({
        where: { id: report.id },
        data: { status: "READY" },
      });

      await prisma.usageEvent.create({
        data: {
          eventType: "report_analyzed",
          category,
          metadata: { sourceType },
        },
      });

      return NextResponse.json({ id: report.id });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Analysis failed. The image may be blurry or unreadable — try a clearer photo or paste the text.";
      await prisma.report.update({
        where: { id: report.id },
        data: { status: "FAILED", errorMessage: message },
      });
      return NextResponse.json({ error: message, id: report.id }, { status: 422 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not process report." }, { status: 500 });
  }
}
