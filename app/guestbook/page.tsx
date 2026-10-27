import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import { GUESTBOOK_COLUMNS, type GuestbookEntry } from "@/lib/guestbook";
import { createClient } from "@/lib/supabase/server";
import GuestbookEntries from "./GuestbookEntries";
import GuestbookForm from "./GuestbookForm";

export const metadata: Metadata = { title: "Guestbook · Frank Binette" };

export default async function Guestbook() {
  const supabase = await createClient();
  const [{ data: entries, error }, { data: isOwner }] = await Promise.all([
    supabase.from("guestbook_entries").select(GUESTBOOK_COLUMNS).order("created_at", { ascending: false }),
    supabase.rpc("am_i_site_owner"),
  ]);

  return (
    <>
      <Title title="Guestbook" subtitle="Say hi! Entries live in a Postgres table guarded by row level security." />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <hr className="py-1" />
            <GuestbookForm />
            {error ? (
              <div className="alert alert-warning">Couldn&apos;t load the guestbook: {error.message}</div>
            ) : (
              <GuestbookEntries entries={(entries ?? []) as GuestbookEntry[]} canDelete={Boolean(isOwner)} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
