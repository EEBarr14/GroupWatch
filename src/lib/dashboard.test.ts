import { describe, expect, it } from "vitest";
import { calculateDashboardSummary } from "./dashboard";

describe("calculateDashboardSummary", () => {
  it("averages only rated entries", () => {
    const summary = calculateDashboardSummary([
      { watch_status: "Watched", rating: 4 },
      { watch_status: "Watched", rating: 2 },
      { watch_status: "Watching", rating: null },
    ]);

    expect(summary.averageRating).toBe(3);
    expect(summary.ratedCount).toBe(2);
  });
});
