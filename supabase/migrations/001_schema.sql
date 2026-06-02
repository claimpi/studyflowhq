-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text default 'student' check (role in ('student', 'writer', 'admin')),
  avatar_url text,
  created_at timestamptz default now()
);

-- Writers table
create table public.writers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  bio text,
  subjects text[],
  rating numeric(3,2) default 0,
  completed_orders int default 0,
  available boolean default true,
  created_at timestamptz default now()
);

-- Orders table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  writer_id uuid references public.writers(id),
  title text not null,
  paper_type text not null,
  subject text not null,
  academic_level text not null,
  pages int not null default 1,
  deadline timestamptz not null,
  instructions text,
  status text default 'pending' check (status in ('pending','assigned','in_progress','review','completed','cancelled')),
  price numeric(10,2),
  file_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.writers enable row level security;
alter table public.orders enable row level security;

-- Profiles: users can read all, update own
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Writers: public read
create policy "Writers are viewable by everyone" on public.writers for select using (true);

-- Orders: users see own orders, admins see all
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Admins can view all orders" on public.orders for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users can update own orders" on public.orders for update using (auth.uid() = user_id);

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
