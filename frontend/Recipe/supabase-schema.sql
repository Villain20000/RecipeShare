-- RecipeShare Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable Row Level Security
alter table if exists auth.users enable row level security;

-- Create profiles table (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  email text not null,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create recipes table
create table public.recipes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null check (category in (
    'breakfast', 'lunch', 'dinner', 'dessert', 'snack', 
    'appetizer', 'beverage', 'salad', 'soup', 'other'
  )),
  cook_time integer not null check (cook_time > 0),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  servings integer not null check (servings > 0),
  image_url text,
  ingredients text[] not null default '{}',
  instructions text[] not null default '{}',
  author_id uuid references public.profiles(id) on delete cascade not null,
  is_published boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create bookmarks table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  recipe_id uuid references public.recipes(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, recipe_id)
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.bookmarks enable row level security;

-- Profile policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Recipe policies
create policy "Published recipes are viewable by everyone"
  on public.recipes for select
  using (is_published = true);

create policy "Users can insert their own recipes"
  on public.recipes for insert
  with check (auth.uid() = author_id);

create policy "Users can update own recipes"
  on public.recipes for update
  using (auth.uid() = author_id);

create policy "Users can delete own recipes"
  on public.recipes for delete
  using (auth.uid() = author_id);

-- Bookmark policies
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can create own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index recipes_author_id_idx on public.recipes(author_id);
create index recipes_category_idx on public.recipes(category);
create index recipes_difficulty_idx on public.recipes(difficulty);
create index recipes_created_at_idx on public.recipes(created_at desc);
create index bookmarks_user_id_idx on public.bookmarks(user_id);
create index bookmarks_recipe_id_idx on public.bookmarks(recipe_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, email)
  values (new.id, new.raw_user_meta_data->>'username', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger update_recipes_updated_at
  before update on public.recipes
  for each row execute procedure public.update_updated_at();

-- Storage bucket for recipe images
insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true);

create policy "Public Access to recipe images"
  on storage.objects for select
  using ( bucket_id = 'recipe-images' );

create policy "Authenticated users can upload recipe images"
  on storage.objects for insert
  with check ( bucket_id = 'recipe-images' and auth.role() = 'authenticated' );

create policy "Users can delete own recipe images"
  on storage.objects for delete
  using ( bucket_id = 'recipe-images' and auth.role() = 'authenticated' );
