-- Streamax: viewer profiles and subscription state.
-- Run in the Supabase SQL editor (or `supabase db push`).

create type public.plan_id as enum ('free', 'standard', 'premium');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  plan public.plan_id not null default 'free',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Viewers can read their own profile. Plan and billing fields are only
-- written by the server (service role) from Stripe webhooks.
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own display name" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

-- Create a profile row for every new auth user.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
