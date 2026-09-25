-- ============================================================
-- MoKnight database schema (run in Supabase SQL editor)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- OWNER CONFIG ----------
-- Single-row table holding the one owner's email. RLS policies below
-- check against this (via is_owner()) instead of trusting "any signed-in
-- user" — this is what actually enforces "owner-only" at the database
-- level, not just in the app's server actions.
create table if not exists owner_config (
  id int primary key default 1,
  owner_email text not null,
  constraint single_row check (id = 1)
);

-- 🔴 REQUIRED: replace 'you@example.com' with the EXACT email you set as
-- OWNER_EMAIL in .env.local (case-insensitive, but must be the same address).
insert into owner_config (id, owner_email) values (1, 'you@example.com')
on conflict (id) do update set owner_email = excluded.owner_email;

alter table owner_config enable row level security;
-- Deliberately no policies here: with RLS on and zero policies, nobody
-- (anon or authenticated) can read/write this table via the API at all —
-- only editable via the SQL editor / service role. is_owner() below can
-- still read it because it's SECURITY DEFINER.

create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    auth.role() = 'authenticated'
    and lower(coalesce(auth.jwt() ->> 'email', '')) =
        lower((select owner_email from owner_config where id = 1));
$$;

-- ---------- PROJECTS ----------
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  name_ar text not null,
  name_en text,
  description_ar text,
  description_en text,
  category text not null default 'other',
  software text[] default '{}',
  aspect_ratio text default '16:9',
  duration_seconds int,
  video_url text,
  thumbnail_url text,
  status text not null default 'draft', -- draft | published
  is_hidden boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- CATEGORIES (extensible list) ----------
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  label_ar text not null,
  label_en text not null,
  sort_order int not null default 0
);

insert into categories (key, label_ar, label_en, sort_order) values
  ('video_editing', 'مونتاج', 'Video Editing', 1),
  ('motion_graphics', 'موشن جرافيك', 'Motion Graphics', 2),
  ('thumbnails', 'صور مصغرة', 'Thumbnails', 3),
  ('short_video', 'فيديو قصير', 'Short Video', 4),
  ('long_video', 'فيديو طويل', 'Long Video', 5),
  ('other', 'أخرى', 'Other', 6)
on conflict (key) do nothing;

-- ---------- SOFTWARE (extensible list) ----------
create table if not exists software_options (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  sort_order int not null default 0
);

insert into software_options (name, sort_order) values
  ('After Effects', 1),
  ('Premiere Pro', 2),
  ('Photoshop', 3),
  ('Illustrator', 4)
on conflict (name) do nothing;

-- ---------- SITE SETTINGS (singleton row, draft + published) ----------
create table if not exists site_settings (
  id int primary key default 1,
  draft jsonb not null default '{}'::jsonb,
  published jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into site_settings (id, draft, published) values (1, '{}', '{}')
on conflict (id) do nothing;

-- ---------- SOCIAL / CONTACT LINKS ----------
create table if not exists social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null, -- email | phone | youtube | instagram | facebook | discord | other
  label text,
  value text not null,
  is_public boolean not null default true,
  sort_order int not null default 0
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public (anon) users: read-only, and only published/visible rows.
-- Owner: the single row in owner_config, verified via is_owner(),
-- which checks the *actual signed-in email* on every request —
-- not "any authenticated user" like before.
-- ============================================================

alter table projects enable row level security;
alter table categories enable row level security;
alter table software_options enable row level security;
alter table site_settings enable row level security;
alter table social_links enable row level security;

-- Public read: only published, non-hidden projects
create policy "public read published projects"
  on projects for select
  to anon
  using (status = 'published' and is_hidden = false);

-- Owner full access — now actually restricted to the one owner email.
create policy "owner full access projects"
  on projects for all
  to authenticated
  using (is_owner()) with check (is_owner());

create policy "public read categories" on categories for select to anon using (true);
create policy "owner write categories" on categories for all to authenticated using (is_owner()) with check (is_owner());

create policy "public read software" on software_options for select to anon using (true);
create policy "owner write software" on software_options for all to authenticated using (is_owner()) with check (is_owner());

-- Anon gets NO direct access to site_settings (it holds the unpublished
-- `draft` column). Public pages read through the site_settings_public
-- view below instead, which only ever exposes `published`.
create policy "owner full access site settings" on site_settings for all to authenticated using (is_owner()) with check (is_owner());

create policy "public read visible social links" on social_links for select to anon using (is_public = true);
create policy "owner full access social links" on social_links for all to authenticated using (is_owner()) with check (is_owner());

-- Public-safe view: exposes ONLY the published column, never draft.
-- The app's public pages (Home, Portfolio) should select from this view,
-- not from site_settings directly.
create or replace view site_settings_public as
  select published from site_settings where id = 1;

grant select on site_settings_public to anon, authenticated;

-- ============================================================
-- STORAGE BUCKETS
-- Create these in Supabase Dashboard -> Storage (or via SQL below):
--   videos     (public read, owner-only write)
--   thumbnails (public read, owner-only write)
-- ============================================================

insert into storage.buckets (id, name, public) values ('videos', 'videos', true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

create policy "public read videos" on storage.objects for select to anon using (bucket_id = 'videos');
create policy "owner write videos" on storage.objects for insert to authenticated with check (bucket_id = 'videos' and is_owner());
create policy "owner update videos" on storage.objects for update to authenticated using (bucket_id = 'videos' and is_owner());
create policy "owner delete videos" on storage.objects for delete to authenticated using (bucket_id = 'videos' and is_owner());

create policy "public read thumbnails" on storage.objects for select to anon using (bucket_id = 'thumbnails');
create policy "owner write thumbnails" on storage.objects for insert to authenticated with check (bucket_id = 'thumbnails' and is_owner());
create policy "owner update thumbnails" on storage.objects for update to authenticated using (bucket_id = 'thumbnails' and is_owner());
create policy "owner delete thumbnails" on storage.objects for delete to authenticated using (bucket_id = 'thumbnails' and is_owner());
