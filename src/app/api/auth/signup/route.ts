import { NextResponse } from "next/server";

import { errorResponse, readJson } from "@/lib/api/errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signUpSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const input = signUpSchema.parse(await readJson(request));
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: { data: { display_name: input.displayName } },
    });

    if (error) {
      return NextResponse.json(
        { error: { code: "SIGNUP_FAILED", message: error.message } },
        { status: 400 },
      );
    }

    return NextResponse.json({ user: data.user }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

