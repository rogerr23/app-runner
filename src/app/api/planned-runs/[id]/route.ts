import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUser } from "@/lib/api/auth";
import { ApiError, errorResponse, readJson } from "@/lib/api/errors";
import { updatePlannedRunSchema } from "@/lib/validation/planned-runs";

const paramsSchema = z.object({ id: z.uuid() });

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/planned-runs/[id]">,
) {
  try {
    const { supabase } = await requireUser();
    const { id } = paramsSchema.parse(await context.params);
    const input = updatePlannedRunSchema.parse(await readJson(request));
    const { data, error } = await supabase
      .from("planned_runs")
      .update({
        scheduled_for: input.scheduledFor,
        run_type: input.runType,
        target_distance_km: input.targetDistanceKm,
        target_duration_seconds: input.targetDurationSeconds,
        notes: input.notes,
        status: input.status,
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new ApiError(404, "NOT_FOUND", "Planejamento não encontrado.");
    return NextResponse.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/planned-runs/[id]">,
) {
  try {
    const { supabase } = await requireUser();
    const { id } = paramsSchema.parse(await context.params);
    const { data, error } = await supabase
      .from("planned_runs")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new ApiError(404, "NOT_FOUND", "Planejamento não encontrado.");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
