-- =====================================================================
-- Mailisto: initial schema
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Safe to run once on a fresh project.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Admin users
-- A row here grants CMS access to an existing Supabase Auth user.
-- Rows are added manually (SQL editor). Nothing in the app can insert here.
-- ---------------------------------------------------------------------

create table public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "admins can read own row"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------

create table public.blog_posts (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null check (char_length(title) between 1 and 200),
  slug               text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) <= 120),
  excerpt            text check (char_length(excerpt) <= 400),
  content            text not null default '',
  featured_image_url text,
  featured_image_alt text check (char_length(featured_image_alt) <= 200),
  category           text check (char_length(category) <= 60),
  author_name        text not null default 'Mailisto' check (char_length(author_name) <= 80),
  status             text not null default 'draft' check (status in ('draft', 'published')),
  featured           boolean not null default false,
  published_at       timestamptz,
  seo_title          text check (char_length(seo_title) <= 70),
  seo_description    text check (char_length(seo_description) <= 170),
  og_image_url       text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index blog_posts_published_idx on public.blog_posts (status, published_at desc);
create index blog_posts_featured_idx on public.blog_posts (featured) where featured;

create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

create policy "public reads published posts"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'published' and published_at is not null and published_at <= now());

create policy "admins manage posts"
  on public.blog_posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Email designs (Design Lab concepts + future client work)
-- ---------------------------------------------------------------------

create table public.email_designs (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null check (char_length(title) between 1 and 140),
  slug               text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  kind               text not null default 'campaign' check (kind in ('campaign', 'flow')),
  email_type         text not null check (char_length(email_type) <= 60),   -- e.g. "Abandoned cart"
  tags               text[] not null default '{}',                          -- product | promotional | welcome | retention
  description        text check (char_length(description) <= 600),
  objective          text check (char_length(objective) <= 300),
  creative_direction text check (char_length(creative_direction) <= 600),
  image_url          text,
  image_alt          text check (char_length(image_alt) <= 200),
  concept_template   text check (char_length(concept_template) <= 60),      -- built-in coded preview key
  is_concept         boolean not null default true,                         -- true = Design Lab concept, not client work
  client_name        text check (char_length(client_name) <= 120),          -- only for real, approved client work
  featured           boolean not null default false,
  published          boolean not null default true,
  sort_order         integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint email_designs_preview_present check (image_url is not null or concept_template is not null),
  constraint email_designs_client_only_for_real_work check (is_concept = false or client_name is null)
);

create index email_designs_order_idx on public.email_designs (published, sort_order, created_at desc);

create trigger email_designs_updated_at before update on public.email_designs
  for each row execute function public.set_updated_at();

alter table public.email_designs enable row level security;

create policy "public reads published designs"
  on public.email_designs for select
  to anon, authenticated
  using (published);

create policy "admins manage designs"
  on public.email_designs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Case studies (hidden on the site until one is published)
-- ---------------------------------------------------------------------

create table public.case_studies (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null check (char_length(title) between 1 and 160),
  slug                text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  client_name         text not null check (char_length(client_name) <= 120),
  industry            text check (char_length(industry) <= 80),
  summary             text check (char_length(summary) <= 400),
  challenge           text,
  strategy            text,
  implementation      text,
  results             jsonb not null default '[]'::jsonb check (jsonb_typeof(results) = 'array'),
  revenue_attribution text,
  before_state        text,
  after_state         text,
  cover_image_url     text,
  cover_image_alt     text,
  screenshots         text[] not null default '{}',
  testimonial_quote   text,
  testimonial_author  text,
  testimonial_role    text,
  project_date        date,
  status              text not null default 'draft' check (status in ('draft', 'published')),
  featured            boolean not null default false,
  sort_order          integer not null default 0,
  seo_title           text check (char_length(seo_title) <= 70),
  seo_description     text check (char_length(seo_description) <= 170),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index case_studies_published_idx on public.case_studies (status, sort_order, project_date desc);

create trigger case_studies_updated_at before update on public.case_studies
  for each row execute function public.set_updated_at();

alter table public.case_studies enable row level security;

create policy "public reads published case studies"
  on public.case_studies for select
  to anon, authenticated
  using (status = 'published');

create policy "admins manage case studies"
  on public.case_studies for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Lead submissions
-- Anonymous visitors may INSERT only (no read-back). Admins read/update.
-- ---------------------------------------------------------------------

create table public.audit_submissions (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 1 and 100),
  email         text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  store_url     text not null check (char_length(store_url) <= 300),
  revenue_range text not null check (char_length(revenue_range) <= 60),
  platform      text not null check (char_length(platform) <= 60),
  list_size     text not null check (char_length(list_size) <= 60),
  challenge     text not null check (char_length(challenge) <= 120),
  details       text check (char_length(details) <= 2000),
  status        text not null default 'new' check (status in ('new', 'contacted', 'in_progress', 'audit_sent', 'won', 'lost', 'archived')),
  admin_notes   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index audit_submissions_created_idx on public.audit_submissions (created_at desc);
create index audit_submissions_email_idx on public.audit_submissions (lower(email), created_at desc);

create trigger audit_submissions_updated_at before update on public.audit_submissions
  for each row execute function public.set_updated_at();

create table public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 100),
  email       text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  store_url   text check (char_length(store_url) <= 300),
  message     text not null check (char_length(message) between 1 and 3000),
  status      text not null default 'new' check (status in ('new', 'replied', 'archived')),
  admin_notes text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index contact_submissions_created_idx on public.contact_submissions (created_at desc);
create index contact_submissions_email_idx on public.contact_submissions (lower(email), created_at desc);

create trigger contact_submissions_updated_at before update on public.contact_submissions
  for each row execute function public.set_updated_at();

alter table public.audit_submissions enable row level security;
alter table public.contact_submissions enable row level security;

create policy "anyone can submit an audit request"
  on public.audit_submissions for insert
  to anon, authenticated
  with check (status = 'new' and admin_notes is null);

create policy "admins read audit requests"
  on public.audit_submissions for select to authenticated using (public.is_admin());
create policy "admins update audit requests"
  on public.audit_submissions for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete audit requests"
  on public.audit_submissions for delete to authenticated using (public.is_admin());

create policy "anyone can send a message"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (status = 'new' and admin_notes is null);

create policy "admins read messages"
  on public.contact_submissions for select to authenticated using (public.is_admin());
create policy "admins update messages"
  on public.contact_submissions for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete messages"
  on public.contact_submissions for delete to authenticated using (public.is_admin());

-- Database-level spam guard: max 3 submissions per email address per 15 minutes,
-- and max 200 per table per hour overall. Runs regardless of what the app does.
create or replace function public.guard_submission_rate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_same integer;
  recent_all  integer;
begin
  execute format(
    'select count(*) from public.%I where lower(email) = lower($1) and created_at > now() - interval ''15 minutes''',
    tg_table_name
  ) into recent_same using new.email;

  if recent_same >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  execute format(
    'select count(*) from public.%I where created_at > now() - interval ''1 hour''',
    tg_table_name
  ) into recent_all;

  if recent_all >= 200 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create trigger audit_submissions_rate before insert on public.audit_submissions
  for each row execute function public.guard_submission_rate();
create trigger contact_submissions_rate before insert on public.contact_submissions
  for each row execute function public.guard_submission_rate();

-- ---------------------------------------------------------------------
-- Site settings (key/value)
-- ---------------------------------------------------------------------

create table public.site_settings (
  key        text primary key check (key ~ '^[a-z0-9_]+$'),
  value      text check (char_length(value) <= 500),
  updated_at timestamptz not null default now()
);

create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

create policy "public reads settings"
  on public.site_settings for select to anon, authenticated using (true);

create policy "admins manage settings"
  on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (key, value) values
  ('contact_email', null),
  ('linkedin_url', null),
  ('instagram_url', null),
  ('x_url', null),
  ('calendly_url', null)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------
-- Explicit API grants (newer Supabase projects may not grant these by default).
-- Row Level Security above still decides which rows each role can touch.
-- ---------------------------------------------------------------------

grant usage on schema public to anon, authenticated;
grant select on public.blog_posts, public.email_designs, public.case_studies, public.site_settings to anon;
grant insert on public.audit_submissions, public.contact_submissions to anon;
grant select, insert, update, delete on
  public.blog_posts, public.email_designs, public.case_studies, public.site_settings,
  public.audit_submissions, public.contact_submissions to authenticated;
grant select on public.admin_users to authenticated;

-- ---------------------------------------------------------------------
-- Storage: public "media" bucket for CMS images. Only admins can write.
-- SVG is deliberately not allowed (script injection risk).
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "admins upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy "admins update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "admins delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
