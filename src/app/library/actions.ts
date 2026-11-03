"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  mediaTypes,
  streamingServices,
  watchStatuses,
} from "@/lib/library";
import { createClient } from "@/lib/supabase/server";

export type EntryActionState = {
  error?: string;
  values?: {
    title: string;
    mediaType: string;
    genreId: string;
    watchStatus: string;
    streamingService: string;
  };
  errors?: {
    title?: string;
    mediaType?: string;
    genreId?: string;
    watchStatus?: string;
    streamingService?: string;
  };
};

function readEntry(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const mediaType = String(formData.get("mediaType") ?? "");
  const watchStatus = String(formData.get("watchStatus") ?? "");
  const streamingService = String(formData.get("streamingService") ?? "");
  const genreIdValue = String(formData.get("genreId") ?? "");
  const genreId = Number(genreIdValue);
  const values = {
    title,
    mediaType,
    genreId: genreIdValue,
    watchStatus,
    streamingService,
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

  if (Object.keys(errors).length > 0) {
    return { errors, values } as const;
  }

  return {
    title,
    media_type: mediaType as (typeof mediaTypes)[number],
    watch_status: watchStatus as (typeof watchStatuses)[number],
    streaming_service: streamingService || null,
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
