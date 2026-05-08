-- Create user profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policy: Users can read their own profile
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Policy: Users can update their own profile (except role)
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Policy: Only admins can read all profiles
create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Policy: Only admins can update any profile
create policy "Admins can update any profile"
on public.profiles
for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Function to check if user is admin
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'staff')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function to update updated_at timestamp
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Update bookings policies to only allow admins to manage
drop policy if exists "Allow authenticated users to read bookings" on public.bookings;
drop policy if exists "Allow authenticated users to update bookings" on public.bookings;
drop policy if exists "Allow authenticated users to delete bookings" on public.bookings;

-- New policies for bookings
create policy "Only admins can read bookings"
on public.bookings
for select
to authenticated
using (public.is_admin(auth.uid()));

create policy "Only admins can update bookings"
on public.bookings
for update
to authenticated
using (public.is_admin(auth.uid()));

create policy "Only admins can delete bookings"
on public.bookings
for delete
to authenticated
using (public.is_admin(auth.uid()));
