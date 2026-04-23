
-- Roles enum + table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view own roles" on public.user_roles
for select to authenticated using (auth.uid() = user_id);

create policy "Admins can view all roles" on public.user_roles
for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  whatsapp text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Users view own profile" on public.profiles
for select to authenticated using (auth.uid() = id);
create policy "Users update own profile" on public.profiles
for update to authenticated using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles
for insert to authenticated with check (auth.uid() = id);
create policy "Admins view all profiles" on public.profiles
for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Auto profile + default role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Request status enum
create type public.request_status as enum ('pending', 'processing', 'quoted', 'shipped', 'delivered', 'cancelled');
create type public.shipping_method as enum ('air', 'sea', 'dropshipping');

-- Product Requests
create table public.product_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_name text not null,
  description text,
  quantity integer not null default 1,
  budget numeric,
  shipping_method shipping_method not null default 'sea',
  contact_whatsapp text,
  contact_email text,
  image_urls text[] default '{}',
  status request_status not null default 'pending',
  product_cost numeric,
  shipping_cost numeric,
  service_fee numeric,
  total_cost numeric,
  admin_notes text,
  tracking_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.product_requests enable row level security;

create policy "Users view own requests" on public.product_requests
for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own requests" on public.product_requests
for insert to authenticated with check (auth.uid() = user_id);
create policy "Anyone can submit guest request" on public.product_requests
for insert to anon with check (user_id is null);
create policy "Admins view all requests" on public.product_requests
for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update requests" on public.product_requests
for update to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Tracking lookup (public read by tracking_number)
create policy "Public can lookup by tracking" on public.product_requests
for select to anon using (tracking_number is not null);

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger product_requests_updated before update on public.product_requests
for each row execute function public.set_updated_at();
create trigger profiles_updated before update on public.profiles
for each row execute function public.set_updated_at();

-- Storage bucket for request images
insert into storage.buckets (id, name, public) values ('request-images', 'request-images', true);

create policy "Public read request images" on storage.objects
for select using (bucket_id = 'request-images');
create policy "Anyone upload request images" on storage.objects
for insert with check (bucket_id = 'request-images');
