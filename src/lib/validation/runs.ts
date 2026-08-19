import { z } from "zod";

export const runTypes = [
  "easy",
  "long",
  "interval",
  "tempo",
  "recovery",
  "walk_run",
  "race",
  "other",
] as const;

export const createRunSchema = z.object({
  plannedRunId: z.uuid().nullable().optional(),
  performedAt: z.iso.datetime({ offset: true }),
  runType: z.enum(runTypes).default("easy"),
  distanceKm: z.number().positive().max(500),
  durationSeconds: z.int().positive().max(86400),
  perceivedEffort: z.int().min(1).max(5).nullable().optional(),
  notes: z.string().trim().max(1000).nullable().optional(),
});

export const listRunsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

