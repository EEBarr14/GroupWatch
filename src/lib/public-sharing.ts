import type { MediaType, WatchStatus } from "./library";

export const shareSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PublicWatchlistEntry = {
  title: string;
  media_type: MediaType;
  watch_status: WatchStatus;
  rating: number | null;
  genre: string;
};

export type PublicWatchlist = {
  display_name: string;
  entries: PublicWatchlistEntry[];
};

export function normalizeShareSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function suggestedShareSlug(displayName: string) {
  const base = normalizeShareSlug(displayName) || "my";
  return `${base}-watchlist`.slice(0, 48).replace(/-+$/g, "");
}
