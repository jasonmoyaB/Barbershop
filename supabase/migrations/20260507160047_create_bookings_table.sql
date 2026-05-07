-- Create bookings table
create table public.bookings (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  date date not null,
  time time not null,
  service_id text not null,
  honeypot text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index on date for faster queries
create index bookings_date_idx on public.bookings (date desc);

-- Create composite index on date + time
create index bookings_date_time_idx on public.bookings (date, time);

-- Create index on created_at for admin dashboard
create index bookings_created_at_idx on public.bookings (created_at desc);

-- Enable Row Level Security
alter table public.bookings enable row level security;

-- Policy: Allow anonymous users to insert bookings (public form submissions)
create policy "Allow anon to insert bookings"
on public.bookings
for insert
to anon
with check (true);

-- Policy: Allow authenticated users (admins) to read all bookings
create policy "Allow authenticated users to read bookings"
on public.bookings
for select
to authenticated
using (true);

-- Policy: Allow authenticated users (admins) to update bookings
create policy "Allow authenticated users to update bookings"
on public.bookings
for update
to authenticated
using (true);

-- Policy: Allow authenticated users (admins) to delete bookings
create policy "Allow authenticated users to delete bookings"
on public.bookings
for delete
to authenticated
using (true);

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at on row update
create trigger set_updated_at
before update on public.bookings
for each row
execute function public.handle_updated_at();
