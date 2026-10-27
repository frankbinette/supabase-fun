-- Runs after migrations on `supabase start` (first time) and `supabase db reset`.

-- Put the email you sign in with here so you can delete guestbook entries.
insert into private.site_owners (email) values ('owner@example.com');

insert into public.guestbook_entries (name, message) values
  ('Frank', 'First! Welcome to the new site.'),
  ('A friendly robot', 'Beep boop, row level security is on.');
