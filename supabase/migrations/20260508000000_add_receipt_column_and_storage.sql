-- Add receipt_url column to bookings table
alter table public.bookings
  add column if not exists receipt_url text;

create index if not exists bookings_receipt_url_idx on public.bookings (receipt_url);

-- Create receipts storage bucket (skip if exists)
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'receipts') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at)
    values (
      'receipts',
      'receipts',
      true,
      5242880,
      array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
      now()
    );
  end if;
end $$;

-- Storage policies (drop first if exists, then create)
drop policy if exists "Users can upload receipts" on storage.objects;
create policy "Users can upload receipts" on storage.objects for insert to authenticated with check (bucket_id = 'receipts');

drop policy if exists "Anyone can view receipts" on storage.objects;
create policy "Anyone can view receipts" on storage.objects for select to authenticated using (bucket_id = 'receipts');

drop policy if exists "Anyone can view receipts public" on storage.objects;
create policy "Anyone can view receipts public" on storage.objects for select to anon using (bucket_id = 'receipts');

drop policy if exists "Users can delete own receipts" on storage.objects;
create policy "Users can delete own receipts" on storage.objects for delete to authenticated using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);