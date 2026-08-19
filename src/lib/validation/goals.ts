import { z } from "zod";

const goalFieldsSchema = z.object({
    kind: z.enum([
      "weekly_distance",
      "weekly_frequency",
      "event_distance",
      "target_pace",
    ]),
    title: z.string().trim().min(2).max(100),
    targetValue: z.number().positive(),
    unit: z.enum(["km", "runs", "seconds_per_km"]),
    startsOn: z.iso.date().optional(),
    deadline: z.iso.date().nullable().optional(),
  });

export const createGoalSchema = goalFieldsSchema
  .refine(
    ({ startsOn, deadline }) => !deadline || !startsOn || deadline >= startsOn,
    { message: "A data limite não pode ser anterior ao início.", path: ["deadline"] },
  );

export const updateGoalSchema = goalFieldsSchema
  .partial()
  .extend({ status: z.enum(["active", "completed", "cancelled"]).optional() })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  })
  .refine(
    ({ startsOn, deadline }) => !deadline || !startsOn || deadline >= startsOn,
    { message: "A data limite não pode ser anterior ao início.", path: ["deadline"] },
  );
