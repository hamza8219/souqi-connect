
create or replace function public.set_updated_at()
returns trigger language plpgsql
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

-- Replace broad public read with a per-object read that disallows listing
drop policy if exists "Public read request images" on storage.objects;
create policy "Public read individual request image"
on storage.objects for select
using (bucket_id = 'request-images' and name is not null);
