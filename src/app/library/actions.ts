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
};

function readEntry(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const mediaType = String(formData.get("mediaType") ?? "");
  const watchStatus = String(formData.get("watchStatus") ?? "");
  const streamingService = String(formData.get("streamingService") ?? "");
  const genreId = Number(formData.get("genreId"));

  if (
    !title ||
    !mediaTypes.includes(mediaType as (typeof mediaTypes)[number]) ||
    !watchStatuses.includes(watchStatus as (typeof watchStatuses)[number]) ||
    !Number.isInteger(genreId) ||
    genreId < 1
  ) {
    return {
      error: "Please fill in the title, type, genre, and watch status.",
    } as const;
  }

  if (
    streamingService &&
    !streamingServices.includes(
      streamingService as (typeof streamingServices)[number],
    )
  ) {
    return { error: "Please choose a valid streaming service." } as const;
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

  if ("error" in entry) {
    return { error: entry.error };
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

  if ("error" in entry) {
    return { error: entry.error };
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
