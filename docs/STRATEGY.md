# Mailisto: Positioning, Messaging & Design Strategy

This document records the thinking behind the website: what it says, why, and how it looks. Use it when writing new pages, briefing designers or adding CMS content, so everything stays consistent.

---

## 1. Conversion patterns in the Klaviyo agency market

Klaviyo and ecommerce email agencies (Inbox Copy, Forge, Flowium, Fuel Made, Chronos, InboxArmy, The Email Marketers and others) share a set of patterns that clearly work. Mailisto uses the principles without copying any wording, layouts or assets.

> Note: direct browsing of competitor sites was blocked by the build environment's network policy. This analysis draws on how these agencies are widely known to present themselves, and on a live search showing that the free Klaviyo audit is the standard lead magnet in this category.

| Pattern | What competitors do | What Mailisto does differently |
|---|---|---|
| Sell revenue, not email | Headlines lead with revenue outcomes and "% of revenue from email". | Same focus on revenue, without numbers we can't back up. The hero makes the outcome personal: *your* list should be making *you* more money. |
| Proof first | Client logos, revenue figures and testimonials above the fold. | Mailisto has none yet, so proof comes from **visible expertise**: an annotated email in the hero, the lifecycle system, process outputs and the Design Lab. Real proof slots in through the CMS later. |
| Audit as the main CTA | "Free audit" or "free strategy call". It often feels like a sales call in disguise. | The audit is framed as a real deliverable: what we review (11 areas), what you get, what happens next and what access we need. Friction is cut with a two-step form. |
| Flows vs campaigns explained | Service lists: welcome, abandoned cart, post-purchase. | Services are grouped into a **system** (Strategy → Lifecycle → Campaigns → Creative → Optimisation), with a separate lifecycle diagram that gives each stage a trigger and a job. |
| Email creative gallery | Long, flat galleries of client emails. | An editorial Design Lab with a filter, an honest "Concept" label, and a detail view that explains the objective, the thinking, the creative direction and the subject line and preview text. |
| Process | Four- to six-step process graphics. | Six steps, each with a **named output** (e.g. "Lifecycle map + calendar"). Specific outputs build trust. |
| Objection handling | FAQs about contracts and pricing. | FAQs about the audit, access, platform fit, brand size and focus. Terms we haven't defined are never invented. |

---

## 2. Messaging hierarchy

### Brand positioning statement
Mailisto is a Klaviyo email agency for Shopify and ecommerce brands. We build and run the flows, campaigns and segmentation that turn customer data into repeat purchases and measurable revenue. Email is the whole job.

### Headline development

The core idea to express was *"Turn your email list into your most profitable sales channel."* These were the candidates:

| # | Option | Verdict |
|---|---|---|
| 1 | **Your email list should be making you more money.** | ✅ Selected for the hero. Written from the founder's point of view, instantly clear, focused on revenue, human and slightly provocative. Works in every English-speaking market. |
| 2 | Turn your email list into your most profitable sales channel. | Clear, but long, and it's the phrase every agency uses. |
| 3 | Make your list your most profitable channel. | ✅ Kept as the **brand tagline**. A compressed form of the core idea. |
| 4 | The revenue is already in your list. | Memorable, but doesn't say who we are or what we do. |
| 5 | Email is your highest-margin channel. Run it like one. | Strong and commercial, but reads like an argument rather than an offer. |
| 6 | More revenue from the customers you already have. | Accurate, but generic "retention" language. |
| 7 | Klaviyo, built to sell. | Short but vague. It could be about a template. |
| 8 | Your best customers are already on your list. | Good line for the About or Retention section. Not a hero line. |
| 9 | Email that earns its place in your P&L. | Clever, but takes a second to decode. |

**Scoring (1–5)** for the top three:

| Criterion | #1 | #2 | #5 |
|---|---|---|---|
| Clarity | 5 | 4 | 4 |
| Ecommerce relevance | 4 | 4 | 4 |
| Revenue orientation | 5 | 5 | 5 |
| Memorability | 5 | 3 | 4 |
| Differentiation | 4 | 2 | 4 |
| Credibility | 5 | 4 | 4 |
| Natural language | 5 | 3 | 4 |
| **Total** | **33** | **25** | **29** |

The hero eyebrow ("Klaviyo email agency · For Shopify brands") and the subheadline supply the *who* and *what*. The headline supplies the *why*.

### Final homepage copy (summary)

| Element | Copy |
|---|---|
| Tagline | Make your list your most profitable channel. |
| Hero headline | Your email list should be making you **more money.** |
| Hero subheadline | Mailisto builds and runs the Klaviyo flows, campaigns and segmentation that turn your customer data into repeat purchases, and revenue you can measure. |
| Primary CTA | Get a Free Audit |
| Secondary CTA | Let's Talk |
| CTA microcopy | A free, practical review of your Klaviyo account. No obligation. |
| Positioning strip | Klaviyo-focused. Ecommerce-native. Revenue-driven. · Shopify data → Klaviyo → Flows + campaigns → Repeat purchases → Revenue |
| 01 Problem | Most email lists are underworked. |
| 02 Services | Everything your Klaviyo channel needs to perform. |
| 03 System | Email isn't a campaign. It's a system. |
| 04 Process | A clear process, from first audit to ongoing growth. |
| 05 Design Lab | Email that looks good. Email that sells. |
| 06 Audit | Your Klaviyo account probably has revenue hiding in it. |
| 07 About | We focus on one thing: making ecommerce email work harder. |
| 08 Principles | How we work. |
| 09 FAQ | Good questions to ask. |
| 10 Blog | Notes on Klaviyo, retention and ecommerce email. |
| Final CTA | Find out what your list could be earning. |
| Contact page | Let's make email work harder. |
| Footer | A Klaviyo email agency for Shopify brands. We build and run the flows, campaigns and segmentation that turn your list into repeat revenue. |

### Voice rules
- Short sentences. Specific nouns: flows, segments, repeat purchases, margin.
- No "unlock", "elevate", "empower", "seamless", "cutting-edge", "game-changing".
- Keep em dashes rare in body copy. Use full stops.
- Never claim a number, client, award or partnership that doesn't exist.
- Use UK spelling (optimise, prioritised) consistently.

---

## 3. The new-agency proof strategy

| Proof device | Where | Why it works |
|---|---|---|
| Annotated welcome email | Hero | Shows *how* we think within five seconds, with no claims. |
| Lifecycle system diagram | Section 03 | Shows we build systems, not one-off sends. |
| Process with named outputs | Section 04 | Specific outputs make a service feel established. |
| Design Lab (9 coded concepts) | Section 05, /work | Shows design and conversion craft. Always labelled **Concept · fictional brand**. |
| Detailed audit scope | Section 06, /audit | Shows the audit has real substance. |
| Expert articles | /blog | Demonstrates expertise and supports SEO. |
| Case studies | Hidden until real | The CMS supports them fully. The public section only renders once one is published. |

Safeguards built into the database:
- `email_designs_client_only_for_real_work`: a design marked as a concept cannot have a client name.
- Case studies stay hidden on the site until `status = 'published'`.
- There are no testimonial, logo or statistics sections that could be filled with placeholders.

---

## 4. Design system

**Idea:** premium ecommerce consultancy + technical Klaviyo specialist + editorial design. The motif is **email → data → lifecycle → revenue**, expressed through thin rules, indexed section labels (`01 — The problem`), trigger and job annotations, and real email previews.

| Token | Value | Use |
|---|---|---|
| `ink` | `#000000` | Primary text, dark sections, primary borders |
| `paper` | `#F7F7F4` | Page background (warm off-white) |
| `white` | `#FFFFFF` | Alternating sections, cards, forms |
| `line` / `line-strong` | `#E2E2DC` / `#CFCFC7` | Hairline dividers |
| `muted` | `#5B5B55` | Secondary text (AA on paper and white) |
| `muted-dark` | `#A4A49D` | Secondary text on black (AA) |
| `lime` | `#B8FA3C` | CTAs, highlights and markers. Always paired with black text, never used as text on white. |

- **Type:** Poppins, self-hosted (400/500/600/700, latin subset, `display: swap`, metric-matched fallback). Headlines are semibold with tight tracking (−0.03em). Labels are 0.72rem uppercase with 0.14em tracking.
- **Radius:** 2–3px. Nothing pill-shaped or bubbly.
- **Elevation:** none. Hierarchy comes from borders, contrast and space.
- **Grids:** 12 columns. Headlines on 7 columns, intros on 5 (a split editorial layout). Hairline grids (`gap-px` on a line colour) instead of stacks of cards.
- **Motion:** CSS only. A hero fade-up on load, scroll-driven reveals (no JS) and 200ms hover transitions. All of it is disabled under `prefers-reduced-motion`.
- **No:** gradients (the one hard-stop band in `.mark` is a highlighter, not a visual gradient), glassmorphism, glow, blobs, stock photography or shadows.

### Email previews
The Design Lab concepts are **coded**, not images. They're built from structured data (`src/content/email-concepts.ts`) and rendered by `EmailMock` using container-query units, so they scale like an image, stay sharp at any size, weigh a few KB and can't be distorted. Uploaded screenshots keep their natural aspect ratio in the detail view and are top-cropped only on cards.

---

## 5. Information architecture

```
/                      Homepage (single-page conversion flow, sections 01–10)
/audit                 Free Klaviyo Revenue Audit (primary conversion page)
/contact               Let's Talk
/work                  Design Lab gallery (+ case studies when published)
/work/[slug]           Case study (only exists once published)
/blog                  Articles
/blog/[slug]           Article
/privacy, /terms       Legal (templates to complete)
/admin/...             CMS (auth + admin allow-list; noindex)
```

Navigation: Services · Process · Work · About · Blog + **Get a Free Audit**. On mobile there's a compact "Free Audit" button that stays visible in the header, plus a full-screen menu.

Conversion hierarchy: **Get a Free Audit** (nav, hero, problem section, work section, audit section, final CTA, blog articles, footer) → **Let's Talk** (hero, final CTA, footer, setup callout) → **Explore work** → **Read articles**.

---

## 6. Final design test

| Question | Answered by |
|---|---|
| What does Mailisto do? | Hero subheadline, first screen. |
| Is it specifically for ecommerce? | Eyebrow "For Shopify brands" and the positioning strip. |
| Is Klaviyo a core specialisation? | Eyebrow "Klaviyo email agency", subheadline and strip. |
| Revenue, not vanity metrics? | Headline, strip ("Revenue-driven"), principle 01. |
| What exactly can they do for my store? | Services (5 groups) and the lifecycle system. |
| Why trust them? | Annotated hero email, system thinking, process outputs, Design Lab, audit scope and articles. No fake proof. |
| What happens if I request the audit? | Audit section ("What you get"), /audit steps, FAQ and the success state. |
| How do I contact them? | "Let's Talk" in the hero, final CTA, footer and /contact. |
