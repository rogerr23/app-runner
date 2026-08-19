import { NextResponse } from "next/server";

import { requireUser } from "@/lib/api/auth";
import { ApiError, errorResponse, readJson } from "@/lib/api/errors";
import { createRunSchema, listRunsQuerySchema } from "@/lib/validation/runs";

export async function GET(request: Request) {
  try {
    const { supabase } = await requireUser();
    const url = new URL(request.url);
    const query = listRunsQuerySchema.parse(Object.fromEntries(url.searchParams));
    const { data, error, count } = await supabase
      .from("runs")
      .select("*", { count: "exact" })
      .order("performed_at", { ascending: false })
      .range(query.offset, query.offset + query.limit - 1);

    if (error) throw error;
    return NextResponse.json({ data, pagination: { ...query, total: count ?? 0 } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const input = createRunSchema.parse(await readJson(request));
    const { data, error } = await supabase
      .from("runs")
      .insert({
        user_id: user.id,
        planned_run_id: input.plannedRunId,
        performed_at: input.performedAt,
        run_type: input.runType,
        distance_km: input.distanceKm,
        duration_seconds: input.durationSeconds,
        perceived_effort: input.perceivedEffort,
        notes: input.notes,
      })
      .select()
      .single();

    if (error?.code === "42501") {
      throw new ApiError(403, "FORBIDDEN", "A corrida planejada não pertence a este usuário.");
    }
    if (error) throw error;

    if (input.plannedRunId) {
      const { error: planError } = await supabase
        .from("planned_runs")
        .update({ status: "completed" })
        .eq("id", input.plannedRunId);
      if (planError) throw planError;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

