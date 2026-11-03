"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  message?: string;
};

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter both your email and password." } as const;
  }

  if (!email.includes("@")) {
    return { error: "Please enter a valid email address." } as const;
  }

  if (password.length < 8) {
    return { error: "Your password needs to be at least 8 characters." } as const;
  }

  return { email, password } as const;
}

export async function signUp(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const credentials = readCredentials(formData);
  if ("error" in credentials) {
    return { error: credentials.error };
  }

  let hasSession = false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp(credentials);

    if (error) {
      return { error: error.message };
    }

    hasSession = Boolean(data.session);
  } catch {
    return {
      error: "I couldn't create your account right now. Please try again.",
    };
  }

  if (hasSession) {
    redirect("/library");
  }

  return {
    message: "Account created. Check your email to confirm it, then log in.",
  };
}

export async function logIn(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const credentials = readCredentials(formData);
  if ("error" in credentials) {
    return { error: credentials.error };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      return { error: "That email and password combination didn't work." };
    }
  } catch {
    return { error: "I couldn't log you in right now. Please try again." };
  }

  redirect("/library");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
