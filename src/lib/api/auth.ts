import type { User } from "@supabase/supabase-js";

import { ApiError } from "@/lib/api/errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireUser(): Promise<{
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
  user: User;
}> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new ApiError(401, "UNAUTHENTICATED", "É necessário entrar na sua conta.");
  }

  return { supabase, user };
}

