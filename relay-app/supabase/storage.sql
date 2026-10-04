-- RELAY private file storage
-- Run this once in the Supabase SQL Editor.

insert into storage.buckets (id, name, public)
values ('relay-files', 'relay-files', false)
on conflict (id) do update set public = false;

drop policy if exists "RELAY users can upload their own files" on storage.objects;
create policy "RELAY users can upload their own files"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'relay-files'
  and (storage.foldername(name))[1] = 'transfers'
  and (storage.foldername(name))[2] = (
    select p.username from public.profiles p where p.id = auth.uid()
  )
);

drop policy if exists "RELAY senders and receivers can read files" on storage.objects;
create policy "RELAY senders and receivers can read files"
on storage.objects for select to authenticated
using (
  bucket_id = 'relay-files'
  and exists (
    select 1 from public.transfers t
    where t.r2_key = storage.objects.name
      and (t.sender_id = auth.uid() or t.receiver_id = auth.uid())
  )
);

drop policy if exists "RELAY senders can delete their files" on storage.objects;
create policy "RELAY senders can delete their files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'relay-files'
  and exists (
    select 1 from public.transfers t
    where t.r2_key = storage.objects.name
      and t.sender_id = auth.uid()
  )
);
