"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SignState = { error?: string; ok?: boolean };

export async function signGuestbook(_prev: SignState, formData: FormData): Promise<SignState> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!name || !message) return { error: "Please fill in your name and a message." };

  const supabase = await createClient();
  // user_id defaults to auth.uid(), and RLS rejects the insert if nobody is signed in.
  const { error } = await supabase.from("guestbook_entries").insert({ name, message });
  if (error) return { error: error.message };

  revalidatePath("/guestbook");
  return { ok: true };
}

export async function deleteEntry(id: number) {
  const supabase = await createClient();
  // RLS silently filters out rows you can't delete, so check something was removed.
  const { data, error } = await supabase.from("guestbook_entries").delete().eq("id", id).select("id");
  if (error) throw new Error(error.message);
  if (!data.length) throw new Error("Only the site owner can delete entries.");
  revalidatePath("/guestbook");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/guestbook");
}
