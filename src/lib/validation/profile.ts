import { z } from "zod";

export const updateProfileSchema = z
  .object({
    displayName: z.string().trim().min(2).max(80).optional(),
    experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    primaryGoal: z
      .enum([
        "start_running",
        "run_5k",
        "run_10k",
        "run_half_marathon",
        "run_marathon",
        "improve_pace",
        "stay_active",
      ])
      .optional(),
    weeklyGoalKm: z.number().positive().max(500).nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });

