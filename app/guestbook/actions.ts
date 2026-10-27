"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SignState = { error?: string; ok?: boolean };

export async function signGuestbook(_prev: SignState, formData: FormData): Promise<SignState> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!name || !message) return { error: "Please fill in your name and a message." };

  const supabase = await createClient();
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
