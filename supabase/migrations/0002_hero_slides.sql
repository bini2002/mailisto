-- =====================================================================
-- Mailisto: hero slides (the rotating designs on the right of the homepage hero)
-- Run after 0001_init.sql. Safe to run once.
-- =====================================================================

create table public.hero_slides (
  id               uuid primary key default gen_random_uuid(),
  label            text check (char_length(label) <= 80),        -- small line above the design, e.g. "Flow · Welcome · Email 1 of 4"
  image_url        text,                                           -- uploaded design (recommended 1120×1400, 4:5)
  image_alt        text check (char_length(image_alt) <= 200),
  concept_template text check (char_length(concept_template) <= 60), -- or a built-in coded design
  caption          text check (char_length(caption) <= 120),      -- line under the design
  notes            text check (char_length(notes) <= 600),        -- optional bullet notes, one per line
  sort_order       integer not null default 0,
  published        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint hero_slides_media_present check (image_url is not null or concept_template is not null)
);

create index hero_slides_order_idx on public.hero_slides (published, sort_order, created_at);

create trigger hero_slides_updated_at before update on public.hero_slides
  for each row execute function public.set_updated_at();

alter table public.hero_slides enable row level security;

create policy "public reads published hero slides"
  on public.hero_slides for select
  to anon, authenticated
  using (published);

create policy "admins manage hero slides"
  on public.hero_slides for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.hero_slides to anon;
grant select, insert, update, delete on public.hero_slides to authenticated;
