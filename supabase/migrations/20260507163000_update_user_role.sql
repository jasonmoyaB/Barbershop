-- ========================================
-- Update profiles to support 'user' role instead of 'staff'
-- ========================================

-- Drop existing constraint
alter table public.profiles 
drop constraint if exists profiles_role_check;

-- Add new constraint with 'user' and 'admin' roles
alter table public.profiles 
add constraint profiles_role_check 
check (role in ('admin', 'user'));

-- Update default value from 'staff' to 'user'
alter table public.profiles 
alter column role set default 'user';

-- Migrate any existing 'staff' users to 'user' role
update public.profiles 
set role = 'user' 
where role = 'staff';
