import { z } from "zod";

import { runTypes } from "@/lib/validation/runs";

const plannedRunFieldsSchema = z.object({
    scheduledFor: z.iso.date(),
    runType: z.enum(runTypes).default("easy"),
    targetDistanceKm: z.number().positive().max(500).nullable().optional(),
    targetDurationSeconds: z.int().positive().max(86400).nullable().optional(),
    notes: z.string().trim().max(1000).nullable().optional(),
  });

export const createPlannedRunSchema = plannedRunFieldsSchema
  .refine(
    ({ targetDistanceKm, targetDurationSeconds }) =>
      targetDistanceKm != null || targetDurationSeconds != null,
    { message: "Informe uma distância ou duração alvo." },
  );

export const updatePlannedRunSchema = plannedRunFieldsSchema
  .partial()
  .extend({ status: z.enum(["planned", "completed", "cancelled"]).optional() })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });
