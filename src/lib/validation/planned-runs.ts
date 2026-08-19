import { z } from "zod";

import { runTypes } from "@/lib/validation/runs";

export const createPlannedRunSchema = z
  .object({
    scheduledFor: z.iso.date(),
    runType: z.enum(runTypes).default("easy"),
    targetDistanceKm: z.number().positive().max(500).nullable().optional(),
    targetDurationSeconds: z.int().positive().max(86400).nullable().optional(),
    notes: z.string().trim().max(1000).nullable().optional(),
  })
  .refine(
    ({ targetDistanceKm, targetDurationSeconds }) =>
      targetDistanceKm != null || targetDurationSeconds != null,
    { message: "Informe uma distância ou duração alvo." },
  );

