import { z } from "zod";

export const signUpSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  email: z.email(),
  password: z.string().min(8).max(72).regex(/[A-Za-z]/).regex(/[0-9]/),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(72),
});

