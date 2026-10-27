-- Broadcast guestbook inserts and deletes so open pages update without a refresh.
-- Realtime still applies RLS, so subscribers only get rows they're allowed to read.
alter publication supabase_realtime add table public.guestbook_entries;
