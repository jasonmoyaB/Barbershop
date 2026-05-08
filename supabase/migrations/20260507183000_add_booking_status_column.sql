alter table public.bookings
  add column if not exists status text not null default 'pending';

create index if not exists bookings_status_idx on public.bookings (status);
