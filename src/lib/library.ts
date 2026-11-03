export const mediaTypes = ["Movie", "TV Show"] as const;
export const watchStatuses = [
  "Want to Watch",
  "Watching",
  "Watched",
] as const;
export const streamingServices = [
  "Prime Video",
  "Apple TV+",
  "Netflix",
  "Hulu",
  "Disney+",
  "Peacock",
  "Other",
] as const;

export type MediaType = (typeof mediaTypes)[number];
export type WatchStatus = (typeof watchStatuses)[number];
export type StreamingService = (typeof streamingServices)[number];

export type Genre = {
  id: number;
  name: string;
};

export type MediaEntry = {
  id: string;
  title: string;
  media_type: MediaType;
  watch_status: WatchStatus;
  streaming_service: StreamingService | null;
  rating: number | null;
  review: string | null;
  genre_id: number;
  created_at: string;
  updated_at: string;
  genres: { name: string } | { name: string }[] | null;
};

export function genreName(entry: MediaEntry) {
  if (Array.isArray(entry.genres)) {
    return entry.genres[0]?.name ?? "Uncategorized";
  }

  return entry.genres?.name ?? "Uncategorized";
}

export function statusClasses(status: WatchStatus) {
  if (status === "Watched") {
    return "bg-[#2d1b3d] text-[#fff1d6]";
  }

  if (status === "Watching") {
    return "bg-[#d65a4a] text-white";
  }

  return "bg-[#f6c85f] text-[#261b2a]";
}
