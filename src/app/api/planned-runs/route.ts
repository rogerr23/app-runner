import { NextResponse } from "next/server";

import { requireUser } from "@/lib/api/auth";
import { errorResponse, readJson } from "@/lib/api/errors";
import { createPlannedRunSchema } from "@/lib/validation/planned-runs";

export async function GET() {
  try {
    const { supabase } = await requireUser();
    const { data, error } = await supabase
      .from("planned_runs")
      .select("*")
      .order("scheduled_for", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const input = createPlannedRunSchema.parse(await readJson(request));
    const { data, error } = await supabase
      .from("planned_runs")
      .insert({
        user_id: user.id,
        scheduled_for: input.scheduledFor,
        run_type: input.runType,
        target_distance_km: input.targetDistanceKm,
        target_duration_seconds: input.targetDurationSeconds,
        notes: input.notes,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

