import type { WatchStatus } from "./library";
import { watchStatuses } from "./library";

export type DashboardEntry = {
  watch_status: WatchStatus;
  rating: number | null;
};

export type StatusCount = {
  status: WatchStatus;
  count: number;
};

export type DashboardSummary = {
  totalCount: number;
  watchedCount: number;
  watchingCount: number;
  ratedCount: number;
  averageRating: number | null;
  statusCounts: StatusCount[];
};

export function calculateDashboardSummary(
  entries: DashboardEntry[],
): DashboardSummary {
  const statusCounts = watchStatuses.map((status) => ({
    status,
    count: entries.filter((entry) => entry.watch_status === status).length,
  }));
  const ratings = entries
    .map((entry) => entry.rating)
    .filter((rating): rating is number => rating !== null);
  const averageRating = ratings.length
    ? Math.round(
        (ratings.reduce((total, rating) => total + rating, 0) /
          ratings.length) *
          10,
      ) / 10
    : null;

  return {
    totalCount: entries.length,
    watchedCount:
      statusCounts.find((item) => item.status === "Watched")?.count ?? 0,
    watchingCount:
      statusCounts.find((item) => item.status === "Watching")?.count ?? 0,
    ratedCount: ratings.length,
    averageRating,
    statusCounts,
  };
}
