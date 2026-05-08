create table if not exists public.work_hours (
  id bigint generated always as identity primary key,
  date date not null,
  time time not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (date, time)
);

create index if not exists work_hours_date_idx on public.work_hours (date);

alter table public.work_hours enable row level security;

create policy "Allow authenticated users to read work hours"
on public.work_hours
for select
to authenticated
using (true);

create policy "Allow authenticated users to update work hours"
on public.work_hours
for update
to authenticated
using (true);

create policy "Allow authenticated users to insert work hours"
on public.work_hours
for insert
to authenticated
with check (true);

create trigger set_work_hours_updated_at
before update on public.work_hours
for each row
execute function public.handle_updated_at();
