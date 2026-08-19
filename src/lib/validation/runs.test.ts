import { describe, expect, it } from "vitest";

import { createRunSchema } from "@/lib/validation/runs";

describe("createRunSchema", () => {
  it("accepts a valid run", () => {
    const result = createRunSchema.safeParse({
      performedAt: "2026-08-19T10:00:00-03:00",
      runType: "easy",
      distanceKm: 5,
      durationSeconds: 1800,
      perceivedEffort: 3,
    });

    expect(result.success).toBe(true);
  });

  it("rejects zero distance", () => {
    const result = createRunSchema.safeParse({
      performedAt: "2026-08-19T10:00:00-03:00",
      distanceKm: 0,
      durationSeconds: 1800,
    });

    expect(result.success).toBe(false);
  });
});

