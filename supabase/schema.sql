-- ============================================
-- Happi Nuts - Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- ============================================
-- PROFILES (extends Supabase auth.users)
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

-- Give the dashboard owner the same database role used by the RLS policies.
-- The profile is created automatically on the owner's first sign-in, so run the
-- one-time admin-order-delete-fix.sql script afterwards for an existing project.
update public.profiles
set role = 'admin'
where lower(email) = 'devdharrshans.23csd@kongu.edu';

-- ============================================
-- PRODUCTS
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

create policy "Products are publicly readable"
  on public.products for select
  using (true);

create policy "Only admins can insert products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Only admins can update products"
  on public.products for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Only admins can delete products"
  on public.products for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ============================================
-- ORDERS
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

create policy "Customers can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Customers can create orders"
  on public.orders for insert
  with check (true);

create policy "Admins can update orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can delete orders"
  on public.orders for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ============================================
-- ORDER ITEMS
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

create policy "Admins can view all order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Customers can view their own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Anyone can create order items"
  on public.order_items for insert
  with check (true);

-- ============================================
-- AUTO-UPDATE UPDATED_AT TRIGGERS
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
-- HELPER FUNCTIONS
-- ============================================

-- Check if the current user is an admin
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

-- Get dashboard stats
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
