import OpenAI from "openai";
import { analysisResultSchema, type AnalysisResult } from "@/lib/validations";
import type { ReportCategory } from "@prisma/client";

const SYSTEM_PROMPT = `You are a careful clinical-lab literacy assistant for MED-Health Locker.
You help patients understand lab and medical report values in plain language.
You NEVER diagnose. You NEVER claim certainty about disease.
Always frame findings as "possible topics to discuss with a doctor."
Return ONLY valid JSON matching the schema. No markdown fences.`;

const DEFAULT_MODEL = process.env.XAI_MODEL || "grok-2-vision-1212";

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

function getXaiClient() {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("AI analysis is not configured. Set XAI_API_KEY on the server.");
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://api.x.ai/v1",
  });
}

export async function analyzeReportContent(input: {
  category: ReportCategory;
  text?: string;
  imageBase64?: string;
  imageMediaType?: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  historyContext?: string;
}): Promise<AnalysisResult> {
  const client = getXaiClient();
  const prompt = buildUserPrompt({
    category: input.category,
    text: input.text,
    historyContext: input.historyContext,
  });

  const userContent: OpenAI.Chat.ChatCompletionContentPart[] = [];

  if (input.imageBase64 && input.imageMediaType) {
    userContent.push({
      type: "image_url",
      image_url: {
        url: `data:${input.imageMediaType};base64,${input.imageBase64}`,
      },
    });
  }

  userContent.push({ type: "text", text: prompt });

  const response = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    max_tokens: 4096,
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
  });

  const rawText = response.choices[0]?.message?.content?.trim();
  if (!rawText) {
    throw new Error("The AI returned an empty response. Please try again.");
  }

  let raw = rawText;
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

export function getAnalysisModelName() {
  return DEFAULT_MODEL;
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
