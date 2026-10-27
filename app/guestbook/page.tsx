import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import { GUESTBOOK_COLUMNS, type GuestbookEntry } from "@/lib/guestbook";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import GuestbookEntries from "./GuestbookEntries";
import GuestbookForm from "./GuestbookForm";

export const metadata: Metadata = { title: "Guestbook · Frank Binette" };

export default async function Guestbook() {
  const supabase = await createClient();
  const [{ data: { user } }, { data: entries, error }, { data: isOwner }] = await Promise.all([
    supabase.auth.getUser(),
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
            {user ? (
              <>
                <form action={signOut} className="mb-3">
                  <span className="text-muted">Signed in as {user.email}. </span>
                  <button type="submit" className="btn btn-link p-0 align-baseline">Sign out</button>
                </form>
                <GuestbookForm defaultName={displayName(user)} />
              </>
            ) : (
              <p className="mb-4">
                <Link href="/login" className="btn btn-primary">Sign in to sign the guestbook</Link>
              </p>
            )}
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

function displayName(user: { email?: string; user_metadata: Record<string, string | undefined> }) {
  const { full_name, name, user_name } = user.user_metadata;
  return full_name ?? name ?? user_name ?? user.email?.split("@")[0] ?? "";
}
