-- Public bucket for post images and PDFs. Anyone can read; only the site owner can change files.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

create policy "Site owner can upload site assets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-assets' and (select private.is_site_owner()));

create policy "Site owner can update site assets"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-assets' and (select private.is_site_owner()));

create policy "Site owner can delete site assets"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-assets' and (select private.is_site_owner()));
