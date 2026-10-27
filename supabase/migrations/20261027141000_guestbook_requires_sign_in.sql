-- Only signed-in visitors can sign the guestbook, and each entry remembers who wrote it.

alter table public.guestbook_entries
  add column user_id uuid default auth.uid() references auth.users (id) on delete set null;

create index guestbook_entries_user_id_idx on public.guestbook_entries (user_id);

drop policy "Anyone can sign the guestbook" on public.guestbook_entries;
revoke insert on public.guestbook_entries from anon;

create policy "Signed-in visitors can sign the guestbook as themselves"
  on public.guestbook_entries for insert
  to authenticated
  with check (user_id = (select auth.uid()));
