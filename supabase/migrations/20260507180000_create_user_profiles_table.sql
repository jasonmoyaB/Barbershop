-- Plan B: create new user_profiles table, policies, and trigger

create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

drop policy if exists "Allow authenticated users to read own user_profiles" on public.user_profiles;
create policy "Allow authenticated users to read own user_profiles"
on public.user_profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Allow authenticated users to update own user_profiles" on public.user_profiles;
create policy "Allow authenticated users to update own user_profiles"
on public.user_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Allow service role full access user_profiles" on public.user_profiles;
create policy "Allow service role full access user_profiles"
on public.user_profiles
for all
to service_role
using (true)
with check (true);

drop policy if exists "Allow user_profiles insert by owner" on public.user_profiles;
create policy "Allow user_profiles insert by owner"
on public.user_profiles
for insert
to authenticated
with check (id = auth.uid());

create or replace function public.handle_new_user_profiles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        role = excluded.role;
  return new;
end;
$$;

alter function public.handle_new_user_profiles() owner to postgres;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user_profiles();

insert into public.user_profiles (id, email, full_name, role, created_at, updated_at)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  coalesce(u.raw_user_meta_data->>'role', 'user'),
  u.created_at,
  u.updated_at
from auth.users u
on conflict (id) do nothing;
