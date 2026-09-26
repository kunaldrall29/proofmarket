import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  age: z.coerce.number().int().min(1).max(120).optional().nullable(),
  sex: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT"]).optional().nullable(),
});

export const profileSchema = z.object({
  name: z.string().min(1).max(120),
  age: z.coerce.number().int().min(1).max(120).optional().nullable(),
  sex: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT"]).optional().nullable(),
});

export const findingSchema = z.object({
  parameter: z.string(),
  value: z.string(),
  normalRange: z.string(),
  status: z.enum(["high", "low", "normal", "unknown"]),
  meaning: z.string(),
});

export const analysisResultSchema = z.object({
  summary: z.string(),
  findings: z.array(findingSchema),
  possibleConditions: z.array(z.string()),
  nextSteps: z.array(z.string()),
  trendsNoted: z.string().optional().nullable(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export const doctorSchema = z.object({
  name: z.string().min(1).max(120),
  specialty: z.string().min(1).max(120),
  contactEmail: z.string().email().optional().nullable().or(z.literal("")),
  contactPhone: z.string().max(40).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const appointmentSchema = z.object({
  title: z.string().min(1).max(160),
  doctorId: z.string().optional().nullable(),
  startsAt: z.string().min(1),
  endsAt: z.string().optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  status: z.enum(["UPCOMING", "PAST", "CANCELLED"]).default("UPCOMING"),
});

export const medicineSchema = z.object({
  name: z.string().min(1).max(160),
  dosage: z.string().max(80).optional().nullable(),
  frequency: z.string().max(80).optional().nullable(),
  startedOn: z.string().optional().nullable(),
  endedOn: z.string().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  isActive: z.boolean().default(true),
});

export const wellnessSchema = z.object({
  mood: z.coerce.number().int().min(1).max(5).optional().nullable(),
  journalText: z.string().max(5000).optional().nullable(),
  entryDate: z.string().optional(),
});
