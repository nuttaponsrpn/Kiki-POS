-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price numeric not null default 0,
  stock integer not null default 0,
  category text,
  image_url text,
  barcode text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders Table
create table orders (
  id uuid default uuid_generate_v4() primary key,
  total_amount numeric not null default 0,
  payment_method text not null, -- 'cash', 'transfer', etc.
  discount numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items Table
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  quantity integer not null default 1,
  price_at_sale numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Create policies (Allow all for internal use, or restrict as needed)
-- For internal use without auth, we might need to allow public access or use service role.
-- Assuming authenticated users or public for now:
create policy "Enable read access for all users" on products for select using (true);
create policy "Enable insert access for all users" on products for insert with check (true);
create policy "Enable update access for all users" on products for update using (true);
create policy "Enable delete access for all users" on products for delete using (true);

create policy "Enable read access for all users" on orders for select using (true);
create policy "Enable insert access for all users" on orders for insert with check (true);

create policy "Enable read access for all users" on order_items for select using (true);
create policy "Enable insert access for all users" on order_items for insert with check (true);
