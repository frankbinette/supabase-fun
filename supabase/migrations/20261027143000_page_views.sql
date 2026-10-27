-- Page view counts for posts. Anyone can read them; only the page-views Edge Function
-- (which runs with the service role) can bump them.

create table public.page_views (
  path text primary key,
  views bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.page_views enable row level security;

grant select on public.page_views to anon, authenticated;
revoke insert, update, delete on public.page_views from anon, authenticated;

create policy "Anyone can read page views"
  on public.page_views for select
  to anon, authenticated
  using (true);

create function public.increment_page_view(page_path text)
returns bigint
language sql
set search_path = ''
as $$
  insert into public.page_views (path, views)
  values (page_path, 1)
  on conflict (path) do update
    set views = public.page_views.views + 1,
        updated_at = now()
  returning views;
$$;

revoke execute on function public.increment_page_view(text) from public, anon, authenticated;
grant execute on function public.increment_page_view(text) to service_role;
