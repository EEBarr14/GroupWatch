"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type PasswordResetRequestState = {
  error?: string;
  message?: string;
};

export async function requestPasswordReset(
  _previousState: PasswordResetRequestState,
  formData: FormData,
): Promise<PasswordResetRequestState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const origin = (await headers()).get("origin");

  if (!origin) {
    return { error: "I couldn't start the reset right now. Please try again." };
  }

  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", "/reset-password");

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: callbackUrl.toString(),
    });

    if (error) {
      return { error: "I couldn't send the reset email. Please try again." };
    }
  } catch {
    return { error: "I couldn't send the reset email. Please try again." };
  }

  return {
    message:
      "If that email belongs to an account, a password reset link is on its way.",
  };
}
