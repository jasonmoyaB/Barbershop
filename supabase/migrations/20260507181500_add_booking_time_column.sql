alter table public.bookings
  add column if not exists time time not null default '09:00';

create index if not exists bookings_date_time_idx on public.bookings (date, time);
