-- ========================================
-- Add user_id to bookings and update policies for user access
-- ========================================

-- Add user_id column to bookings
alter table public.bookings 
add column user_id uuid references auth.users on delete cascade;

-- Create index on user_id for faster queries
create index bookings_user_id_idx on public.bookings (user_id);

-- Drop old policies
drop policy if exists "Allow anon to insert bookings" on public.bookings;
drop policy if exists "Allow authenticated users to read bookings" on public.bookings;
drop policy if exists "Only admins can read bookings" on public.bookings;

-- New policy: Authenticated users can insert their own bookings
create policy "Authenticated users can insert own bookings"
on public.bookings
for insert
to authenticated
with check (auth.uid() = user_id);

-- New policy: Users can read their own bookings
create policy "Users can read own bookings"
on public.bookings
for select
to authenticated
using (auth.uid() = user_id);

-- New policy: Admins can read all bookings
create policy "Admins can read all bookings"
on public.bookings
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Update existing bookings to have null user_id (they were created anonymously)
-- Admins will still see them via the admin policy
