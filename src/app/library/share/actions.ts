"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  normalizeShareSlug,
  shareSlugPattern,
} from "@/lib/public-sharing";

export type ShareSettingsActionState = {
  error?: string;
  message?: string;
  values?: {
    displayName: string;
    shareSlug: string;
    shareEnabled: boolean;
  };
  errors?: {
    displayName?: string;
    shareSlug?: string;
  };
};

export async function updateShareSettings(
  _previousState: ShareSettingsActionState,
  formData: FormData,
): Promise<ShareSettingsActionState> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const shareSlug = normalizeShareSlug(
    String(formData.get("shareSlug") ?? ""),
  );
  const shareEnabled = formData.get("shareEnabled") === "on";
  const values = { displayName, shareSlug, shareEnabled };
  const errors: NonNullable<ShareSettingsActionState["errors"]> = {};

  if (!displayName) {
    errors.displayName = "Choose the name friends will see on your shared page.";
  } else if (displayName.length > 80) {
    errors.displayName = "Keep your display name to 80 characters or fewer.";
  }

  if (shareEnabled && !shareSlug) {
    errors.shareSlug = "Choose a link name before turning sharing on.";
  } else if (
    shareSlug &&
    (shareSlug.length < 3 ||
      shareSlug.length > 48 ||
      !shareSlugPattern.test(shareSlug))
  ) {
    errors.shareSlug =
      "Use 3–48 lowercase letters, numbers, and single hyphens.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  const supabase = await createClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  if (claimsError || typeof userId !== "string") {
    redirect("/login");
  }

  const { data: existingProfile } = await supabase
    .from("users")
    .select("share_slug")
    .eq("id", userId)
    .maybeSingle();
  const { error } = await supabase
    .from("users")
    .update({
      display_name: displayName,
      share_enabled: shareEnabled,
      share_slug: shareSlug || null,
    })
    .eq("id", userId);

  if (error?.code === "23505") {
    return {
      errors: { shareSlug: "That link name is already taken. Try another." },
      values,
    };
  }

  if (error) {
    return {
      error: "I couldn't save those sharing settings. Please try again.",
      values,
    };
  }

  revalidatePath("/library/share");
  revalidatePath("/library");

  if (existingProfile?.share_slug) {
    revalidatePath(`/share/${existingProfile.share_slug}`);
  }

  if (shareSlug) {
    revalidatePath(`/share/${shareSlug}`);
  }

  return {
    message: shareEnabled
      ? "Your public watchlist is live."
      : "Sharing is off. Your private library is unchanged.",
    values,
  };
}
