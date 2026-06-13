-- Supabase Schema for Bamanda Heritage Restaurant

-- 1. Menu Table
create table if not exists menu (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  category text not null,
  meal_time text[],
  image text,
  tag text,
  portion text,
  tags text[],
  available boolean default true,
  is_trending boolean default false,
  whatsapp_link text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Blog Table
create table if not exists blog (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  topic text,
  content text not null,
  image text,
  date text,
  author text,
  layout text default 'editorial',
  category text,
  created_at timestamp with time zone default now()
);

-- 3. Staff Table
create table if not exists staff (
  id uuid primary key, -- Use Firebase UID or Supabase Auth UID
  name text not null,
  email text unique not null,
  role text not null check (role in ('admin', 'staff', 'rider')),
  created_at timestamp with time zone default now(),
  last_active timestamp with time zone
);

-- 4. Orders Table
create table if not exists orders (
  id text primary key, -- BAM-XXXX
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  items jsonb not null,
  total numeric not null,
  status text not null default 'pending',
  notes text,
  created_at timestamp with time zone default now(),
  confirmed_at timestamp with time zone,
  queue_position integer,
  estimated_delivery_time integer,
  metadata jsonb
);

-- Enable RLS
alter table menu enable row level security;
alter table blog enable row level security;
alter table staff enable row level security;
alter table orders enable row level security;

-- Public Access Policies
create policy "Public can read menu" on menu for select using (true);
create policy "Public can read blog" on blog for select using (true);
create policy "Public can create orders" on orders for insert with check (true);
create policy "Public can read their own orders" on orders for select using (true); -- In prod, filter by phone

-- Admin Access Policies (Placeholder - requires auth setup)
-- create policy "Admins can manage menu" on menu using (auth.jwt()->>'role' = 'admin');
