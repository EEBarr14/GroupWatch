import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UpdatePasswordForm } from "./update-password-form";

export async function ResetPasswordContent() {
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return (
      <section className="mx-auto w-full max-w-2xl rounded-[2rem] bg-[#fff1d6] p-8 text-center text-[#261b2a] shadow-2xl sm:p-12">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#d65a4a]">
          Link expired
        </p>
        <h1 className="mt-4 text-4xl font-semibold">Request a new reset link.</h1>
        <p className="mt-4 text-lg leading-8 text-[#6e3b5d]">
          For security, password reset links only work for a limited time.
        </p>
        <Link
          href="/forgot-password"
          className="mt-8 inline-flex rounded-full bg-[#d65a4a] px-6 py-3 font-bold text-white"
        >
          Send a new link
        </Link>
      </section>
    );
  }

  return <UpdatePasswordForm />;
}
