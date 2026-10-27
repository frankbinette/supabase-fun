-- Run with `npx supabase test db` while the local stack is up.
begin;
select plan(6);

insert into private.site_owners (email) values ('test-owner@example.com');
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'visitor@example.com');

-- An anonymous visitor
set local role anon;
set local request.jwt.claims to '{"role": "anon"}';

select throws_ok(
  $$ insert into public.guestbook_entries (name, message) values ('Lurker', 'Hello!') $$,
  '42501',
  null,
  'anon cannot sign the guestbook'
);

select is_empty(
  $$ delete from public.guestbook_entries returning id $$,
  'anon cannot delete entries'
);

-- A signed-in visitor
set local role authenticated;
set local request.jwt.claims to
  '{"role": "authenticated", "sub": "11111111-1111-1111-1111-111111111111", "email": "visitor@example.com"}';

select lives_ok(
  $$ insert into public.guestbook_entries (name, message) values ('Visitor', 'Hello!') $$,
  'a signed-in visitor can sign the guestbook'
);

select throws_ok(
  $$ insert into public.guestbook_entries (name, message, user_id)
     values ('Impostor', 'Hi', '22222222-2222-2222-2222-222222222222') $$,
  '42501',
  null,
  'a visitor cannot sign as someone else'
);

select is_empty(
  $$ delete from public.guestbook_entries returning id $$,
  'a signed-in visitor cannot delete entries'
);

-- The site owner
set local request.jwt.claims to '{"role": "authenticated", "email": "test-owner@example.com"}';

select isnt_empty(
  $$ delete from public.guestbook_entries where name = 'Visitor' returning id $$,
  'the site owner can delete entries'
);

select * from finish();
rollback;
