import { redirect } from "next/navigation";
import { logOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export async function DashboardContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const email =
    typeof data.claims.email === "string" ? data.claims.email : "your account";

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 border-b border-[#fff1d6]/20 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#f6c85f]">
              GroupWatch
            </p>
            <p className="mt-2 text-sm text-[#fff1d6]/65">Signed in as {email}</p>
          </div>
          <form action={logOut}>
            <button
              type="submit"
              className="rounded-full border border-[#fff1d6]/45 px-5 py-2.5 text-sm font-bold text-[#fff1d6] transition hover:bg-[#fff1d6]/10"
            >
              Log out
            </button>
          </form>
        </header>

        <section className="mt-16 rounded-[2rem] bg-[#fff1d6] p-8 text-[#261b2a] shadow-2xl sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d65a4a]">
            Your library
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            You are in. Now let&apos;s add something to watch.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6e3b5d]">
            Account access is working. The next feature will turn this starting
            page into your actual movie and TV library.
          </p>
        </section>
      </div>
    </main>
  );
}
