import Anthropic from "@anthropic-ai/sdk";
import { analysisResultSchema, type AnalysisResult } from "@/lib/validations";
import type { ReportCategory } from "@prisma/client";

const SYSTEM_PROMPT = `You are a careful clinical-lab literacy assistant for MED-Health Locker.
You help patients understand lab and medical report values in plain language.
You NEVER diagnose. You NEVER claim certainty about disease.
Always frame findings as "possible topics to discuss with a doctor."
Return ONLY valid JSON matching the schema. No markdown fences.`;

function buildUserPrompt(input: {
  category: ReportCategory;
  text?: string;
  historyContext?: string;
}) {
  return `Analyze this medical report content for category: ${input.category}.

${input.historyContext ? `RECENT HISTORY (for trend awareness):\n${input.historyContext}\n` : ""}

REPORT CONTENT:
${input.text ?? "(see attached image)"}

Return JSON with this exact shape:
{
  "summary": "plain-language overview in 2-4 sentences",
  "findings": [
    {
      "parameter": "name",
      "value": "reported value with units if present",
      "normalRange": "reference range or Unknown",
      "status": "high" | "low" | "normal" | "unknown",
      "meaning": "one-line plain meaning"
    }
  ],
  "possibleConditions": ["topics to discuss with a doctor — not diagnoses"],
  "nextSteps": ["practical next steps"],
  "trendsNoted": "null or a short note comparing to recent history if relevant"
}`;
}

export async function analyzeReportContent(input: {
  category: ReportCategory;
  text?: string;
  imageBase64?: string;
  imageMediaType?: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  historyContext?: string;
}): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "AI analysis is not configured. Set ANTHROPIC_API_KEY on the server.",
    );
  }

  const client = new Anthropic({ apiKey });
  const content: Anthropic.MessageCreateParams["messages"][0]["content"] = [];

  if (input.imageBase64 && input.imageMediaType) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: input.imageMediaType,
        data: input.imageBase64,
      },
    });
  }

  content.push({
    type: "text",
    text: buildUserPrompt({
      category: input.category,
      text: input.text,
      historyContext: input.historyContext,
    }),
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("The AI returned an empty response. Please try again.");
  }

  let raw = textBlock.text.trim();
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      "Could not parse the AI response. The report may be unreadable — try clearer text or a sharper image.",
    );
  }

  const result = analysisResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      "AI response was incomplete. Please retry with clearer report content.",
    );
  }

  return result.data;
}

export async function buildHistoryContext(userId: string, limit = 3) {
  const { prisma } = await import("@/lib/db");
  const reports = await prisma.report.findMany({
    where: { userId, status: "READY", analysis: { isNot: null } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { analysis: true },
  });

  if (!reports.length) return undefined;

  return reports
    .map((r, i) => {
      const findings = Array.isArray(r.analysis?.findings)
        ? (r.analysis!.findings as Array<{ parameter: string; value: string; status: string }>)
            .slice(0, 8)
            .map((f) => `${f.parameter}=${f.value} (${f.status})`)
            .join("; ")
        : "";
      return `#${i + 1} [${r.category}] ${r.createdAt.toISOString().slice(0, 10)}: ${r.analysis?.summary ?? ""}\nKey values: ${findings}`;
    })
    .join("\n\n");
}
