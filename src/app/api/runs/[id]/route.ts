import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUser } from "@/lib/api/auth";
import { ApiError, errorResponse, readJson } from "@/lib/api/errors";
import { updateRunSchema } from "@/lib/validation/runs";

const paramsSchema = z.object({ id: z.uuid() });

export async function PATCH(request: Request, context: RouteContext<"/api/runs/[id]">) {
  try {
    const { supabase } = await requireUser();
    const { id } = paramsSchema.parse(await context.params);
    const input = updateRunSchema.parse(await readJson(request));
    const { data, error } = await supabase
      .from("runs")
      .update({
        performed_at: input.performedAt,
        run_type: input.runType,
        distance_km: input.distanceKm,
        duration_seconds: input.durationSeconds,
        perceived_effort: input.perceivedEffort,
        notes: input.notes,
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new ApiError(404, "NOT_FOUND", "Corrida não encontrada.");
    return NextResponse.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext<"/api/runs/[id]">) {
  try {
    const { supabase } = await requireUser();
    const { id } = paramsSchema.parse(await context.params);
    const { data, error } = await supabase
      .from("runs")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new ApiError(404, "NOT_FOUND", "Corrida não encontrada.");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
