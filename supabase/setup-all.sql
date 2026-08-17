-- ============================================
-- Happi Nuts - COMPLETE Supabase Setup
-- Run this ONCE in the Supabase SQL Editor
-- ============================================
-- This script creates ALL required tables, RLS policies,
-- triggers, and settings. Run it in:
--   Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ============================================

-- ============================================
-- 1. DISABLE EMAIL CONFIRMATION
-- ============================================
update auth.config
set mailer_autoconfirm = true;

update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email_confirmed_at is null;

-- ============================================
-- 2. PROFILES
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  email text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 3. PRODUCTS
-- ============================================
create table if not exists public.products (
  id text primary key,
  name text not null,
  tamil_name text not null default '',
  price numeric not null default 0,
  original_price numeric,
  weight text not null default '1 kg',
  rating numeric not null default 4.5,
  reviews integer not null default 0,
  badge text check (badge in ('bestseller', 'new', 'premium')),
  description text not null default '',
  benefits jsonb not null default '[]'::jsonb,
  ingredients text not null default '',
  nutritional_info jsonb not null default '{}'::jsonb,
  storage_instructions text not null default '',
  category text not null default 'nuts',
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
  on public.products for select
  using (true);

drop policy if exists "Only admins can insert products" on public.products;
create policy "Only admins can insert products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

drop policy if exists "Only admins can update products" on public.products;
create policy "Only admins can update products"
  on public.products for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

drop policy if exists "Only admins can delete products" on public.products;
create policy "Only admins can delete products"
  on public.products for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ============================================
-- 4. ORDERS
-- ============================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  email text not null,
  phone text not null,
  address text,
  city text,
  state text,
  pincode text,
  payment_method text not null default 'cod',
  payment_id text,
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  delivery numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'Pending' check (status in ('Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
  on public.orders for insert
  with check (true);

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Admins can delete orders" on public.orders;
create policy "Admins can delete orders"
  on public.orders for delete
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================
-- 5. ORDER ITEMS
-- ============================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text references public.products(id) on delete set null,
  name text not null,
  price numeric not null default 0,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

drop policy if exists "Users can view their own order items" on public.order_items;
create policy "Users can view their own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders as o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "Admins can view all order items" on public.order_items;
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
-- 6. STORE SETTINGS
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

insert into public.store_settings (id, delivery_charge, free_delivery_threshold, default_discount_percent)
values (1, 50, 500, 0)
on conflict (id) do nothing;

-- ============================================
-- 7. PAGE CONTROLS
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
-- 8. PRODUCT TOGGLES
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
-- 9. CONTACT MESSAGES
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
-- 10. AUTO-UPDATE UPDATED_AT TRIGGERS
-- ============================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- ============================================
-- 11. HELPER FUNCTIONS
-- ============================================
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  );
$$;

create or replace function public.get_admin_stats()
returns json
language sql
security definer set search_path = public
stable
as $$
  select json_build_object(
    'total_products', (select count(*) from public.products),
    'total_orders', (select count(*) from public.orders),
    'total_revenue', (select coalesce(sum(total), 0) from public.orders where status != 'Cancelled'),
    'pending_orders', (select count(*) from public.orders where status = 'Pending'),
    'total_customers', (select count(*) from public.profiles where role = 'customer'),
    'recent_orders', (
      select coalesce(json_agg(row_to_json(o) order by o.created_at desc), '[]'::json)
      from (
        select * from public.orders
        order by created_at desc
        limit 10
      ) o
    )
  );
$$;

-- ============================================
-- 12. REALTIME
-- ============================================
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;
alter publication supabase_realtime add table public.products;

-- ============================================
-- 13. OWNER/ADMIN EMAILS
-- ============================================
update public.profiles
set role = 'admin'
where lower(email) in (
  'devdharrshans.23csd@kongu.edu',
  'devdharrshan421@gmail.com'
);

-- ============================================
-- VERIFICATION
-- ============================================
select 'profiles' as table_name, count(*) as row_count from public.profiles
union all
select 'products', count(*) from public.products
union all
select 'orders', count(*) from public.orders
union all
select 'order_items', count(*) from public.order_items
union all
select 'store_settings', count(*) from public.store_settings
union all
select 'page_controls', count(*) from public.page_controls
union all
select 'product_toggles', count(*) from public.product_toggles
union all
select 'contact_messages', count(*) from public.contact_messages;