-- Guestbook: anyone can read and sign it, only the site owner can delete entries.

-- Things the Data API should never expose live in a schema it doesn't serve.
create schema if not exists private;

create table private.site_owners (
  email text primary key
);

comment on table private.site_owners is 'Emails allowed to moderate the site. Add yours in supabase/seed.sql.';

-- security definer so policies can check the owner list without exposing it.
create function private.is_site_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.site_owners
    where email = (select auth.jwt() ->> 'email')
  );
$$;

grant usage on schema private to anon, authenticated;
revoke execute on function private.is_site_owner() from public;
grant execute on function private.is_site_owner() to anon, authenticated;

-- What the site calls (supabase.rpc('am_i_site_owner')) to decide whether to show delete buttons.
create function public.am_i_site_owner()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_site_owner();
$$;

create table public.guestbook_entries (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(trim(name)) between 1 and 60),
  message text not null check (char_length(trim(message)) between 1 and 500)
);

comment on table public.guestbook_entries is 'Messages left by visitors on /guestbook.';

alter table public.guestbook_entries enable row level security;

grant select, insert on public.guestbook_entries to anon, authenticated;
grant delete on public.guestbook_entries to authenticated;

create policy "Anyone can read the guestbook"
  on public.guestbook_entries for select
  to anon, authenticated
  using (true);

create policy "Anyone can sign the guestbook"
  on public.guestbook_entries for insert
  to anon, authenticated
  with check (true);

create policy "Only the site owner can delete entries"
  on public.guestbook_entries for delete
  to authenticated
  using ((select private.is_site_owner()));

create index guestbook_entries_created_at_idx on public.guestbook_entries (created_at desc);
