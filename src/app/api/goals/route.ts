import { NextResponse } from "next/server";

import { requireUser } from "@/lib/api/auth";
import { errorResponse, readJson } from "@/lib/api/errors";
import { createGoalSchema } from "@/lib/validation/goals";

export async function GET() {
  try {
    const { supabase } = await requireUser();
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const input = createGoalSchema.parse(await readJson(request));
    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: user.id,
        kind: input.kind,
        title: input.title,
        target_value: input.targetValue,
        unit: input.unit,
        starts_on: input.startsOn,
        deadline: input.deadline,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
