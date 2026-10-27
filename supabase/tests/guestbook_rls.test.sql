-- Run with `npx supabase test db` while the local stack is up.
begin;
select plan(4);

insert into private.site_owners (email) values ('test-owner@example.com');

-- An anonymous visitor
set local role anon;
set local request.jwt.claims to '{"role": "anon"}';

select lives_ok(
  $$ insert into public.guestbook_entries (name, message) values ('Visitor', 'Hello!') $$,
  'anon can sign the guestbook'
);

select is_empty(
  $$ delete from public.guestbook_entries returning id $$,
  'anon cannot delete entries'
);

-- A signed-in stranger
set local role authenticated;
set local request.jwt.claims to '{"role": "authenticated", "email": "stranger@example.com"}';

select is_empty(
  $$ delete from public.guestbook_entries returning id $$,
  'a signed-in stranger cannot delete entries'
);

-- The site owner
set local request.jwt.claims to '{"role": "authenticated", "email": "test-owner@example.com"}';

select isnt_empty(
  $$ delete from public.guestbook_entries where name = 'Visitor' returning id $$,
  'the site owner can delete entries'
);

select * from finish();
rollback;
