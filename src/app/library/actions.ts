"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  mediaTypes,
  streamingServices,
  watchStatuses,
} from "@/lib/library";
import type { WatchStatus } from "@/lib/library";
import { createClient } from "@/lib/supabase/server";

export type EntryActionState = {
  error?: string;
  values?: {
    title: string;
    mediaType: string;
    genreId: string;
    watchStatus: string;
    streamingService: string;
    rating: string;
    review: string;
  };
  errors?: {
    title?: string;
    mediaType?: string;
    genreId?: string;
    watchStatus?: string;
    streamingService?: string;
    rating?: string;
    review?: string;
  };
};

export type WatchStatusActionState = {
  error?: string;
  message?: string;
  updatedStatus?: WatchStatus;
};

export type StarActionState = {
  error?: string;
  message?: string;
  isStarred?: boolean;
};

function readEntry(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const mediaType = String(formData.get("mediaType") ?? "");
  const watchStatus = String(formData.get("watchStatus") ?? "");
  const streamingService = String(formData.get("streamingService") ?? "");
  const ratingValue = String(formData.get("rating") ?? "");
  const rating = ratingValue ? Number(ratingValue) : null;
  const review = String(formData.get("review") ?? "").trim();
  const genreIdValue = String(formData.get("genreId") ?? "");
  const genreId = Number(genreIdValue);
  const values = {
    title,
    mediaType,
    genreId: genreIdValue,
    watchStatus,
    streamingService,
    rating: ratingValue,
    review,
  };
  const errors: NonNullable<EntryActionState["errors"]> = {};

  if (!title) {
    errors.title = "Add the title of the movie or TV show.";
  } else if (title.length > 200) {
    errors.title = "Keep the title to 200 characters or fewer.";
  }

  if (!mediaTypes.includes(mediaType as (typeof mediaTypes)[number])) {
    errors.mediaType = "Choose Movie or TV Show.";
  }

  if (!Number.isInteger(genreId) || genreId < 1) {
    errors.genreId = "Choose the genre that fits best.";
  }

  if (!watchStatuses.includes(watchStatus as (typeof watchStatuses)[number])) {
    errors.watchStatus = "Choose where this title is in your watch journey.";
  }

  if (
    streamingService &&
    !streamingServices.includes(
      streamingService as (typeof streamingServices)[number],
    )
  ) {
    errors.streamingService = "Choose a streaming service from the list.";
  }

  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    errors.rating = "Choose a rating from one through five TVs.";
  }

  if (review.length > 500) {
    errors.review = "Keep your review to 500 characters or fewer.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values } as const;
  }

  return {
    title,
    media_type: mediaType as (typeof mediaTypes)[number],
    watch_status: watchStatus as (typeof watchStatuses)[number],
    streaming_service: streamingService || null,
    rating,
    review: review || null,
    genre_id: genreId,
  } as const;
}

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string") {
    redirect("/login");
  }

  return { supabase, userId };
}

export async function createEntry(
  _previousState: EntryActionState,
  formData: FormData,
): Promise<EntryActionState> {
  const entry = readEntry(formData);

  if ("errors" in entry) {
    return { errors: entry.errors, values: entry.values };
  }

  const { supabase, userId } = await requireUser();
  const { data, error } = await supabase
    .from("media_entries")
    .insert({ ...entry, user_id: userId })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "I couldn't save that title. Please try again." };
  }

  revalidatePath("/library");
  redirect(`/library/${data.id}`);
}

export async function updateEntry(
  entryId: string,
  _previousState: EntryActionState,
  formData: FormData,
): Promise<EntryActionState> {
  const entry = readEntry(formData);

  if ("errors" in entry) {
    return { errors: entry.errors, values: entry.values };
  }

  const { supabase, userId } = await requireUser();
  const { data, error } = await supabase
    .from("media_entries")
    .update(entry)
    .eq("id", entryId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { error: "I couldn't update that title. Please try again." };
  }

  revalidatePath("/library");
  revalidatePath(`/library/${entryId}`);
  redirect(`/library/${entryId}`);
}

export async function updateWatchStatus(
  entryId: string,
  _previousState: WatchStatusActionState,
  formData: FormData,
): Promise<WatchStatusActionState> {
  const watchStatus = String(formData.get("watchStatus") ?? "");

  if (!watchStatuses.includes(watchStatus as WatchStatus)) {
    return { error: "Choose a valid watch status and try again." };
  }

  const { supabase, userId } = await requireUser();
  const { data, error } = await supabase
    .from("media_entries")
    .update({ watch_status: watchStatus })
    .eq("id", entryId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { error: "I couldn't update the watch status. Please try again." };
  }

  revalidatePath("/library");
  revalidatePath(`/library/${entryId}`);
  revalidatePath("/dashboard");

  return {
    message: `Moved to ${watchStatus}.`,
    updatedStatus: watchStatus as WatchStatus,
  };
}

export async function updateStar(
  entryId: string,
  _previousState: StarActionState,
  formData: FormData,
): Promise<StarActionState> {
  const starredValue = String(formData.get("starred") ?? "");

  if (starredValue !== "true" && starredValue !== "false") {
    return { error: "Choose whether to star or unstar this title." };
  }

  const shouldStar = starredValue === "true";
  const { supabase, userId } = await requireUser();
  const [{ data: entry, error: entryError }, { data: existingStar }] =
    await Promise.all([
      supabase
        .from("media_entries")
        .select("id")
        .eq("id", entryId)
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("stars")
        .select("media_entry_id")
        .eq("user_id", userId)
        .eq("media_entry_id", entryId)
        .maybeSingle(),
    ]);

  if (entryError || !entry) {
    return { error: "I couldn't find that title in your library." };
  }

  if (shouldStar === Boolean(existingStar)) {
    return {
      isStarred: shouldStar,
      message: shouldStar
        ? "Already in your starred titles."
        : "Already removed from your starred titles.",
    };
  }

  const query = shouldStar
    ? supabase
        .from("stars")
        .insert({ user_id: userId, media_entry_id: entryId })
    : supabase
        .from("stars")
        .delete()
        .eq("user_id", userId)
        .eq("media_entry_id", entryId);
  const { error } = await query;

  if (error) {
    return {
      error: `I couldn't ${shouldStar ? "star" : "unstar"} that title. Please try again.`,
    };
  }

  revalidatePath("/library");
  revalidatePath("/library/starred");
  revalidatePath(`/library/${entryId}`);

  return {
    isStarred: shouldStar,
    message: shouldStar ? "Added to your starred titles." : "Removed from your starred titles.",
  };
}

export async function deleteEntry(entryId: string, formData: FormData) {
  void formData;
  const { supabase, userId } = await requireUser();
  const { error } = await supabase
    .from("media_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", userId);

  if (error) {
    redirect(`/library/${entryId}?deleteError=1`);
  }

  revalidatePath("/library");
  redirect("/library");
}
