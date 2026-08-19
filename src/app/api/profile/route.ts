import { NextResponse } from "next/server";

import { requireUser } from "@/lib/api/auth";
import { ApiError, errorResponse, readJson } from "@/lib/api/errors";
import { updateProfileSchema } from "@/lib/validation/profile";

export async function GET() {
  try {
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !data) throw new ApiError(404, "NOT_FOUND", "Perfil não encontrado.");
    return NextResponse.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const input = updateProfileSchema.parse(await readJson(request));
    const { data, error } = await supabase
      .from("profiles")
      .update({
        display_name: input.displayName,
        experience_level: input.experienceLevel,
        primary_goal: input.primaryGoal,
        weekly_goal_km: input.weeklyGoalKm,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error || !data) throw new ApiError(404, "NOT_FOUND", "Perfil não encontrado.");
    return NextResponse.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
}

