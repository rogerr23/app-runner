import { describe, expect, it } from "vitest";

import { createPlannedRunSchema } from "@/lib/validation/planned-runs";

describe("createPlannedRunSchema", () => {
  it("requires at least one target", () => {
    const result = createPlannedRunSchema.safeParse({
      scheduledFor: "2026-08-20",
      runType: "easy",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a distance target", () => {
    const result = createPlannedRunSchema.safeParse({
      scheduledFor: "2026-08-20",
      targetDistanceKm: 5,
    });

    expect(result.success).toBe(true);
  });
});
