import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUser } from "@/lib/api/auth";
import { ApiError, errorResponse, readJson } from "@/lib/api/errors";
import { updateGoalSchema } from "@/lib/validation/goals";

const paramsSchema = z.object({ id: z.uuid() });

export async function PATCH(request: Request, context: RouteContext<"/api/goals/[id]">) {
  try {
    const { supabase } = await requireUser();
    const { id } = paramsSchema.parse(await context.params);
    const input = updateGoalSchema.parse(await readJson(request));
    const { data, error } = await supabase
      .from("goals")
      .update({
        kind: input.kind,
        title: input.title,
        target_value: input.targetValue,
        unit: input.unit,
        starts_on: input.startsOn,
        deadline: input.deadline,
        status: input.status,
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new ApiError(404, "NOT_FOUND", "Meta não encontrada.");
    return NextResponse.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext<"/api/goals/[id]">) {
  try {
    const { supabase } = await requireUser();
    const { id } = paramsSchema.parse(await context.params);
    const { data, error } = await supabase
      .from("goals")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new ApiError(404, "NOT_FOUND", "Meta não encontrada.");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
