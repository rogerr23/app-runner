import { describe, expect, it } from "vitest";

import { signUpSchema } from "@/lib/validation/auth";

describe("signUpSchema", () => {
  it("accepts a valid account", () => {
    const result = signUpSchema.safeParse({
      displayName: "Ana Corredora",
      email: "ana@example.com",
      password: "corrida123",
    });

    expect(result.success).toBe(true);
  });

  it("requires a password with letters and numbers", () => {
    const result = signUpSchema.safeParse({
      displayName: "Ana Corredora",
      email: "ana@example.com",
      password: "apenasletras",
    });

    expect(result.success).toBe(false);
  });
});

