-- Run this once in the Supabase SQL Editor after the admin account has signed in.
-- It gives the dashboard owner the database role required by the orders RLS policy.

update public.profiles
set role = 'admin'
where lower(email) = 'devdharrshans.23csd@kongu.edu';

-- Recreate the order-delete policy so it is present even if an earlier schema
-- deployment did not include it.
drop policy if exists "Admins can delete orders" on public.orders;

create policy "Admins can delete orders"
  on public.orders for delete
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
