import { NextResponse } from "next/server";

import { errorResponse, readJson } from "@/lib/api/errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signInSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const input = signInSchema.parse(await readJson(request));
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword(input);

    if (error) {
      return NextResponse.json(
        { error: { code: "INVALID_CREDENTIALS", message: "E-mail ou senha inválidos." } },
        { status: 401 },
      );
    }

    return NextResponse.json({ user: data.user });
  } catch (error) {
    return errorResponse(error);
  }
}

