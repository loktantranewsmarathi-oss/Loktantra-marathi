-- लोकतंत्र मराठी: Supabase database + secure admin setup
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  summary text not null default '',
  content text not null default '',
  date text not null,
  time text not null default '',
  location text not null default '',
  author text not null default 'लोकतंत्र वृत्तसेवा',
  image_url text not null default '',
  image_caption text,
  is_breaking boolean not null default false,
  is_featured boolean not null default false,
  published boolean not null default false,
  views_count integer not null default 0,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_published_created_idx on public.news (published, created_at desc);
create index if not exists news_category_idx on public.news (category);
create index if not exists news_breaking_idx on public.news (is_breaking, published);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;

alter table public.profiles enable row level security;
alter table public.news enable row level security;

drop policy if exists "public can read own profile" on public.profiles;
create policy "public can read own profile" on public.profiles for select using (id = auth.uid());

drop policy if exists "admins can manage news" on public.news;
create policy "admins can manage news" on public.news for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can read published news" on public.news;
create policy "public can read published news" on public.news for select using (published = true);

-- Public image bucket. Upload is restricted to admins; public can view images.
insert into storage.buckets (id, name, public) values ('news-images', 'news-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public can view news images" on storage.objects;
create policy "public can view news images" on storage.objects for select using (bucket_id = 'news-images');

drop policy if exists "admins can upload news images" on storage.objects;
create policy "admins can upload news images" on storage.objects for insert with check (bucket_id = 'news-images' and public.is_admin());

drop policy if exists "admins can update news images" on storage.objects;
create policy "admins can update news images" on storage.objects for update using (bucket_id = 'news-images' and public.is_admin());

drop policy if exists "admins can delete news images" on storage.objects;
create policy "admins can delete news images" on storage.objects for delete using (bucket_id = 'news-images' and public.is_admin());

-- AFTER creating your admin user in Authentication > Users, replace the email below and run:
-- update public.profiles set is_admin = true where id = (select id from auth.users where email = 'YOUR-ADMIN-EMAIL');


-- Website layout editor: admin controls homepage section order/visibility
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
drop policy if exists "public can read site settings" on public.site_settings;
create policy "public can read site settings" on public.site_settings for select using (true);
drop policy if exists "admins can manage site settings" on public.site_settings;
create policy "admins can manage site settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
insert into public.site_settings (key, value) values
('homepage_layout', '[{"id":"hero","label":"मुख्य बातम्या","visible":true},{"id":"nashik","label":"नाशिक जिल्हा","visible":true},{"id":"epaper","label":"ई-पेपर","visible":true},{"id":"video","label":"व्हिडिओ गॅलरी","visible":true},{"id":"photo","label":"फोटो गॅलरी","visible":true},{"id":"about","label":"संपादकांचा संदेश","visible":true},{"id":"advertise","label":"जाहिरात विभाग","visible":true},{"id":"contact","label":"संपर्क विभाग","visible":true}]'::jsonb)
on conflict (key) do nothing;
