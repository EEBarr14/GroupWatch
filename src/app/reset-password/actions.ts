"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UpdatePasswordState = {
  error?: string;
};

export async function updatePassword(
  _previousState: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("passwordConfirmation") ?? "");

  if (password.length < 8) {
    return { error: "Your new password needs to be at least 8 characters." };
  }

  if (password !== confirmation) {
    return { error: "Those passwords don't match yet." };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    return {
      error: "That reset link has expired. Request a new one and try again.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "I couldn't update your password. Please try again." };
  }

  await supabase.auth.signOut();
  redirect("/login?passwordReset=1");
}
