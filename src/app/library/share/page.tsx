import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { suggestedShareSlug } from "@/lib/public-sharing";
import { ShareSettingsForm } from "./share-settings-form";

export default async function ShareSettingsPage() {
  await connection();
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  const { data: profile } = await supabase
    .from("users")
    .select("display_name, share_enabled, share_slug")
    .eq("id", userId ?? "")
    .maybeSingle();
  const displayName = profile?.display_name ?? "GroupWatch member";
  const shareSlug = profile?.share_slug ?? suggestedShareSlug(displayName);

  return (
    <>
      <section>
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6c85f]">
          Share settings
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-[#fff1d6] sm:text-6xl">
          Let friends see the list, not the private details.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#fff1d6]/65">
          Sharing stays off until I choose a link and turn it on. I can switch it off again anytime.
        </p>
      </section>

      <ShareSettingsForm
        displayName={displayName}
        shareSlug={shareSlug}
        shareEnabled={profile?.share_enabled ?? false}
      />
    </>
  );
}
