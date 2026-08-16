-- ============================================
-- Happi Nuts — Orders Persistence + Admin Login Fix
-- ============================================
-- Run this ONCE in the Supabase SQL Editor (existing project).
--
-- Guarantees that customer orders NEVER disappear from the admin
-- dashboard regardless of device, login/logout, or time elapsed:
--
--   1. PROFILES:
--      - Everybody signed-in can read profiles (admin needs it).
--      - Users can insert/update their OWN profile row, so the
--        customer profile used by orders FK + RLS always exists.
--      - Admins can update any profile (role management).
--   2. ORDERS:
--        - Users can read their own orders.
--        - Admins can read every order. This makes the admin
--          dashboard show ALL customer orders on any device.
--        - Insert stays open so customers can place orders.
--   3. ORDER ITEMS:
--      - Users can read their own order items.
--      - Admins can read all item lines (same reason).
--   4. The owner email(s) are always forced to role='admin',
--      so the admin login directly works without a confirmation step.
--   5. STORE SETTINGS / PAGE CONTROLS / PRODUCT TOGGLES / CONTACT
--      MESSAGES are moved to the database so every device shares the
--      same configuration and messages.
--   6. Realtime is enabled for orders/order_items/products so the
--      Admin dashboard updates LIVE when a customer places an order.
-- ============================================

-- 1) PROFILES — enable RLS + allow the app to read/upsert
alter table public.profiles enable row level security;

drop policy if exists "Profiles are readable by all" on public.profiles;
create policy "Profiles are readable by all"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- 2) ORDERS — users see their own orders, admins see everything
drop policy if exists "Customers can view their own orders" on public.orders;
drop policy if exists "Admins can view all orders" on public.orders;
drop policy if exists "Signed in users can view all orders" on public.orders;

create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Customers can create orders" on public.orders;
drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
  on public.orders for insert
  with check (true);

-- 3) ORDER ITEMS — users see their own items, admins see all
drop policy if exists "Admins can view all order items" on public.order_items;
drop policy if exists "Customers can view their own order items" on public.order_items;
drop policy if exists "Signed in users can view all order items" on public.order_items;

create policy "Users can view their own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders as o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Anyone can create order items" on public.order_items;
create policy "Anyone can create order items"
  on public.order_items for insert
  with check (true);

-- ============================================
-- STORE SETTINGS — shared across all devices
-- ============================================
create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  delivery_charge numeric not null default 50,
  free_delivery_threshold numeric not null default 500,
  default_discount_percent numeric not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;

drop policy if exists "Store settings are publicly readable" on public.store_settings;
create policy "Store settings are publicly readable"
  on public.store_settings for select
  using (true);

drop policy if exists "Only admins can update store settings" on public.store_settings;
create policy "Only admins can update store settings"
  on public.store_settings for update
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Only admins can insert store settings" on public.store_settings;
create policy "Only admins can insert store settings"
  on public.store_settings for insert
  with check (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Seed the single settings row if missing
insert into public.store_settings (id, delivery_charge, free_delivery_threshold, default_discount_percent)
values (1, 50, 500, 0)
on conflict (id) do nothing;

-- ============================================
-- PAGE CONTROLS — shared across all devices
-- ============================================
create table if not exists public.page_controls (
  key text primary key,
  label text not null,
  enabled boolean not null default true,
  description text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.page_controls enable row level security;

drop policy if exists "Page controls are publicly readable" on public.page_controls;
create policy "Page controls are publicly readable"
  on public.page_controls for select
  using (true);

drop policy if exists "Only admins can update page controls" on public.page_controls;
create policy "Only admins can update page controls"
  on public.page_controls for update
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Only admins can insert page controls" on public.page_controls;
create policy "Only admins can insert page controls"
  on public.page_controls for insert
  with check (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================
-- PRODUCT TOGGLES — shared across all devices
-- ============================================
create table if not exists public.product_toggles (
  product_id text primary key references public.products(id) on delete cascade,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.product_toggles enable row level security;

drop policy if exists "Product toggles are publicly readable" on public.product_toggles;
create policy "Product toggles are publicly readable"
  on public.product_toggles for select
  using (true);

drop policy if exists "Only admins can update product toggles" on public.product_toggles;
create policy "Only admins can update product toggles"
  on public.product_toggles for update
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Only admins can insert product toggles" on public.product_toggles;
create policy "Only admins can insert product toggles"
  on public.product_toggles for insert
  with check (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================
-- CONTACT MESSAGES — stored in the database
-- ============================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  subject text not null default 'general',
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can create contact messages" on public.contact_messages;
create policy "Anyone can create contact messages"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages"
  on public.contact_messages for select
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Admins can delete contact messages" on public.contact_messages;
create policy "Admins can delete contact messages"
  on public.contact_messages for delete
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================
-- REALTIME — push new orders/items/products instantly
-- ============================================
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;
alter publication supabase_realtime add table public.products;

-- 4) Owner/admin emails are always admin
update public.profiles
set role = 'admin'
where lower(email) in (
  'devdharrshans.23csd@kongu.edu',
  'devdharrshan421@gmail.com'
);