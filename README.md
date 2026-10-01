# Mailisto: website & CMS

The production website for **Mailisto**, an email and SMS marketing agency for Shopify and ecommerce brands, plus a small protected CMS for the blog, email designs, case studies and leads.

- **Stack:** Next.js 16 (App Router, Server Components, Server Actions) · TypeScript · Tailwind CSS v4 · Supabase (Postgres, Auth, Storage, RLS) · React Icons · Poppins (self-hosted)
- **Strategy, copy and design rationale:** see [`docs/STRATEGY.md`](docs/STRATEGY.md)

---

## 1. Quick start (local)

Requirements: **Node.js 20.9+** (22 LTS recommended).

```bash
npm install
cp .env.example .env.local     # fill in values (see section 2)
npm run dev                    # http://localhost:3000
```

The public site runs **without Supabase**. It falls back to the built-in Design Lab concepts and starter articles, so you can review the design straight away. Forms and the admin area need Supabase.

Other scripts:

```bash
npm run build       # production build
npm start           # serve the production build
npm run typecheck   # TypeScript check
```

---

## 2. Supabase setup (about 10 minutes)

### 2.1 Create the project
1. Go to [supabase.com](https://supabase.com) → **New project**. Pick a region close to your audience (e.g. London or US East).
2. Open **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / publishable key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

You do **not** need the service-role key. The app never uses it. All writes go through Row Level Security.

### 2.2 Create the database
1. Open **SQL Editor → New query**.
2. Paste the whole of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) and click **Run**.

Then do the same with [`supabase/migrations/0002_hero_slides.sql`](supabase/migrations/0002_hero_slides.sql), which adds the homepage hero slides. **Already set up? Just run `0002` now.**

This creates every table, index, constraint, trigger and RLS policy, the public `media` storage bucket (images only, max 5 MB, no SVG), and the default site settings.

(Using the Supabase CLI instead? Run `supabase link` then `supabase db push`.)

### 2.3 Create your admin login
1. **Authentication → Users → Add user → Create new user.** Enter your email and a strong password, and tick **Auto Confirm User**.
2. In **SQL Editor**, grant that user CMS access (use your own email):

```sql
insert into public.admin_users (user_id, email)
select id, email from auth.users where email = 'you@mailisto.com';
```

Only users listed in `admin_users` can use the CMS. Signing in with any other account is rejected. Remove access with `delete from public.admin_users where email = '…';`.

Recommended: **Authentication → Providers → Email**, turn off **Allow new users to sign up**. Admins are created manually, so public sign-up isn't needed.

### 2.4 Environment variables

| Variable | Required | Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://mailisto.com` (no trailing slash) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | `https://abcd1234.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | `eyJ…` or `sb_publishable_…` |
| `NEXT_PUBLIC_CALENDLY_URL` | No | `https://calendly.com/you/30min`. A fallback for the "Book a call" tab. The link set in Admin → Settings takes priority. |

> `NEXT_PUBLIC_SUPABASE_URL` must be set **at build time**. The image optimiser allow-lists your Supabase Storage host when the app is built.

### 2.5 Import the starter content
Sign in at **`/admin/login`**. On the overview page, click **Import starter content**. This adds the nine Design Lab concepts and five articles to the CMS so you can edit or remove them. Until you do this, the site shows the same content from the built-in files.

---

## 3. Deploying (Vercel recommended)

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New → Project** and import the repo. The framework is detected automatically.
3. Add the three environment variables above for **Production** (and Preview if you use it).
4. Click **Deploy**. Then go to **Settings → Domains**, add `mailisto.com` and `www.mailisto.com`, and follow the DNS instructions.
5. In Supabase, open **Authentication → URL Configuration** and set the **Site URL** to `https://mailisto.com`.

Any Node host that supports Next.js 16 works too (`npm run build && npm start`).

### After launch
- Add the site to **Google Search Console** and submit `https://mailisto.com/sitemap.xml`.
- Check a page with the [Rich Results Test](https://search.google.com/test/rich-results) (Organization, WebSite, Article, BreadcrumbList and FAQ structured data are included).
- Run Lighthouse or PageSpeed Insights on `/` and `/audit`.

---

## 4. Using the CMS (`/admin`)

| Section | What you can do |
|---|---|
| **Overview** | New lead counts, content counts, latest audit requests, one-click starter import. |
| **Audit leads** | Name, email, store URL, revenue range, platform, list size, challenge, notes and date. Filter by status and update status (new → contacted → in progress → audit sent → won/lost/archived). Add internal notes or delete. |
| **Messages** | Contact form submissions, with status (new/replied/archived), notes and delete. |
| **Hero slides** | The designs that dissolve one into the next (currently not shown: the homepage hero uses the video below). Add, edit, reorder, hide or delete them. Upload a 4:5 image (about 1120×1400 px) or pick a built-in design, and add a label, caption and up to 4 notes. 4–5 slides work best. Until you publish your own, the built-in set is shown (import it from the overview to edit it). |
| **Blog** | Create, edit, delete. Draft or publish (future dates are scheduled). Feature or unfeature, category, author, featured image, SEO title and description, social image. Content is written in Markdown (see below). |
| **Email designs** | Create, edit, delete. Upload a screenshot or use a coded concept. Set type, email type, filter tags, objective, description, creative direction, featured, published and sort order. Toggle **concept vs client work**. |
| **Case studies** | Client, industry, challenge, strategy, implementation, results (`Label \| Value` per line), how results were measured, before/after, cover, screenshots, testimonial, date, featured and publish. **The public case-study section stays hidden until one is published.** |
| **Settings** | Public contact email, **Calendly link** (adds a "Book a call" tab to the Let's Talk page, which also opens directly at `/contact#book`), and LinkedIn, Instagram and X links. Each only shows on the site when set. Also the **homepage hero video**: a video URL and poster image (see below). |

**Markdown supported in articles:** `## Heading`, `### Subheading`, `**bold**`, `*italic*`, `- lists`, `1. lists`, `> quotes`, `` `code` ``, fenced code blocks, `---`, `[links](https://…)`, `![alt text](https://image-url)`. Content is rendered as React elements (never raw HTML), so it can't inject scripts.

**Homepage hero video:** the hero shows a small video frame under the headline that grows to full screen as visitors scroll. It is muted by default, with sound and pause buttons. Either drop the files into `public/videos/` (`hero.mp4`, optionally `hero.webm` and `hero-poster.jpg`) or set a video URL and poster in **Settings** (the settings win). Use a 16:9 video, ideally 1920×1080, under 10 MB, 15–45 seconds, and keep the key action near the centre because phones crop the sides at full screen. Until a video is set, the poster image is shown.

**Uploading email screenshots:** export the full email at 600–1200px wide as PNG, JPG or WebP (max 5 MB). The site never stretches it. Cards show the top of the email, and the detail view shows the whole email.

**Honesty rules (enforced by the database):** a design marked as a concept can't have a client name. Only publish client work, results and testimonials you're allowed to share.

Changes appear on the public site right away (pages are revalidated on save, and refresh every 5 minutes anyway).

---

## 5. Editing site copy

| What | Where |
|---|---|
| Site name, description, nav, CTA labels | `src/lib/site.ts` |
| Homepage sections | `src/components/home/*.tsx` (one file per section) |
| Services list | `src/components/home/ServiceGrid.tsx` |
| Lifecycle stages | `src/components/home/EmailSystem.tsx` |
| Process steps | `src/components/home/Process.tsx` |
| Audit form options (revenue ranges, platforms…) | `src/lib/validation.ts` |
| Built-in email concepts | `src/content/email-concepts.ts` |
| Starter articles | `src/content/starter-posts.ts` |
| Privacy / Terms | `src/app/(site)/privacy/page.tsx`, `src/app/(site)/terms/page.tsx` |
| Colours, type scale, motion | `src/app/globals.css` (`@theme` block) |
| CTA "LED" beam, 48h badge, scroll reveal | `.beam`, `.badge-48`, `.reveal` in `globals.css`. Reveal logic is in `src/components/ui/ScrollReveal.tsx` |
| 48-hour audit timeline | `src/components/home/AuditTurnaround.tsx` |

---

## 6. Pre-launch checklist

- [ ] Complete the **[bracketed placeholders]** in Privacy and Terms (legal entity, contact email, hosting provider, retention period, jurisdiction) and get them reviewed by a qualified adviser.
- [ ] Set the public contact email and any social links in **Admin → Settings**.
- [ ] Read the audit promises ("48 hours from access", "read-only user", "written review", "ranked recommendations") and confirm they match how you'll deliver audits.
- [ ] Import the starter content, then review and edit it in your own voice.
- [ ] Turn off public sign-ups in Supabase Auth.
- [ ] Set up lead notifications (below) so no audit request sits unseen.
- [ ] Submit the sitemap to Google Search Console.

### Lead notifications (optional but recommended)
Leads are stored in Supabase. To get an email for each one without adding code, use **Supabase → Database → Webhooks → Create a new hook**. Select table `audit_submissions` (and `contact_submissions`) with event `INSERT`, and point it at a Zapier, Make or n8n webhook that sends you an email or Slack message.

---

## 7. Architecture

```
src/
  app/
    (site)/                 public pages (Navbar + Footer layout)
      page.tsx              homepage
      audit/ contact/ work/ work/[slug]/ blog/ blog/[slug]/ privacy/ terms/
    admin/
      login/                sign-in
      (dashboard)/          protected CMS pages (requireAdmin on every page)
      actions.ts            CMS server actions (auth, CRUD, uploads, leads)
    actions/forms.ts        public form server actions (audit, contact)
    sitemap.ts robots.ts opengraph-image.tsx icon.svg not-found.tsx
  components/
    layout/  home/  work/  email/  forms/  blog/  admin/  ui/  seo/
  content/                  built-in concepts + starter articles
  lib/
    supabase/               server (cookies), public (cookie-less, cacheable), proxy
    auth.ts data.ts validation.ts markdown.tsx rate-limit.ts utils.ts types.ts
  proxy.ts                  refreshes auth session, gates /admin (Next 16 "proxy", formerly middleware)
supabase/migrations/0001_init.sql
```

- **Rendering:** public pages are static with ISR (`revalidate = 300`) and read through a cookie-less anon client, so they're served from cache. Admin pages are dynamic. Only interactive pieces (forms, gallery filter and modal, mobile menu, admin forms) are client components.
- **Performance:** self-hosted subset fonts, no UI or animation libraries, coded email previews instead of heavy images, `next/image` (AVIF/WebP) for uploads, and CSS-only motion.

### Security
- **RLS on every table.** Anonymous visitors can only **insert** audit and contact submissions (they can't read them back) and read published content. Only users in `admin_users` can read leads or write content (checked by `public.is_admin()`).
- **Three layers of admin protection:** `proxy.ts` (session), `requireAdmin()` in every admin page and server action (session + allow-list), and RLS in the database.
- **Validation:** all form input is validated server-side (`src/lib/validation.ts`) and again by database `CHECK` constraints. Queries go through the Supabase client (parameterised), so there's no string-built SQL.
- **Anti-spam:** honeypot field, minimum fill time, per-IP rate limit in the app, and a database trigger (`guard_submission_rate`) that limits submissions per email and per hour.
- **Uploads:** admin-only. The file type is checked by its magic bytes (not the browser's claim), limited to 5 MB, and only PNG/JPEG/WebP/AVIF/GIF are allowed (no SVG). Files get random names in a bucket that only admins can write to.
- **XSS:** no user HTML is ever rendered. Markdown becomes React elements, URLs are allow-listed to http(s), and JSON-LD is escaped.
- **Headers:** HSTS, `X-Frame-Options: DENY`, `nosniff`, a strict Referrer-Policy and Permissions-Policy. `/admin` is `noindex`.
- The service-role key is **never** used or exposed.

---

## 8. Troubleshooting

| Problem | Fix |
|---|---|
| Forms say "Form storage isn't configured yet" | Set the Supabase env vars and redeploy. |
| "This account doesn't have admin access" | Add the user to `public.admin_users` (section 2.3). |
| Uploaded images don't show | Set `NEXT_PUBLIC_SUPABASE_URL` **before** building, then redeploy. Check that the `media` bucket exists and is public. |
| Uploads fail with a policy error | Re-run the storage section of the migration. Make sure you're signed in as an admin. |
| New content doesn't appear | Check it's published (and that its publish date isn't in the future). Pages refresh within 5 minutes. |
| "We've already received a few requests from this address" | The spam guard allows 3 submissions per email every 15 minutes. That's by design. |
