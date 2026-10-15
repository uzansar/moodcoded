-- Supabase Schema for Moodcoded

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view all usernames"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Moods Table
create table if not exists public.moods (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date text not null, -- YYYY-MM-DD
  rating integer not null check (rating >= 1 and rating <= 10),
  entry text default ''::text,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_date unique (user_id, date)
);

-- Enable RLS for moods
alter table public.moods enable row level security;

-- Moods Policies: strictly restricted to owner
create policy "Users can read own moods"
  on public.moods for select
  using (auth.uid() = user_id);

create policy "Users can insert own moods"
  on public.moods for insert
  with check (auth.uid() = user_id);

create policy "Users can update own moods"
  on public.moods for update
  using (auth.uid() = user_id);

create policy "Users can delete own moods"
  on public.moods for delete
  using (auth.uid() = user_id);

-- 3. Automatic Profile Creation on Signup (Trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Realtime replication setup for moods
alter publication supabase_realtime add table public.moods;
