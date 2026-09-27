/**
 * Starter articles. Shown on /blog when Supabase isn't configured,
 * and importable into the CMS from the admin dashboard ("Import starter content").
 */
export interface StarterPost {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  published_at: string;
  featured: boolean;
  seo_title: string;
  seo_description: string;
  content: string;
}

export const starterPosts: StarterPost[] = [
  {
    title: "The five Klaviyo flows to get right before anything else",
    slug: "five-klaviyo-flows-to-get-right-first",
    excerpt:
      "Flows run every day whether you're watching or not. These five do the most work for a Shopify store, and most accounts have at least one of them underbuilt.",
    category: "Flows",
    published_at: "2026-09-01T09:00:00Z",
    featured: true,
    seo_title: "The 5 Klaviyo Flows Every Shopify Store Needs",
    seo_description:
      "Welcome, abandoned checkout, browse abandonment, post-purchase and win-back: what each Klaviyo flow should do and the common mistakes to avoid.",
    content: `Campaigns get most of the attention because they're visible. Someone writes them, someone approves them, they go out on a date. Flows are different. You build them once and they run every day, triggered by what customers actually do.

That makes them the foundation of any serious email program. If your flows are thin, every campaign has to work harder to make up for it.

These are the five we look at first in any Klaviyo account.

## 1. Welcome series

**Trigger:** Added to list (usually from your signup form).

The welcome series is the first conversation you have with someone who has raised their hand. Most stores send a single email with a discount code and stop there.

A stronger welcome series does three jobs:

- Explains why your product is different, before asking for the sale
- Answers the objections that stop first purchases (sizing, shipping, returns, quality)
- Branches once someone buys, so customers aren't still being sold to

**Common mistake:** no purchase filter. If a subscriber buys after email one, emails two to five should stop or change.

## 2. Abandoned checkout

**Trigger:** Started checkout.

This is usually the highest-intent flow in the account. The customer chose a product, entered details and left.

Lead with the product and the reasons people hesitate at checkout. A discount in the first email teaches customers that abandoning pays. If you do use an incentive, save it for a later email and consider limiting it to first-time buyers.

**Common mistake:** one email only, sent too late. Test a first send within a few hours.

## 3. Browse abandonment

**Trigger:** Viewed product.

Lower intent than a checkout, but far higher volume. Keep it light: the product they viewed, a couple of related products and a reason to come back.

**Common mistake:** no suppression for people already in the checkout flow, which means customers get two reminders for the same session.

## 4. Post-purchase

**Trigger:** Placed order (or fulfilled order).

The first order is the expensive one. The second is where the margin is. Post-purchase emails should help customers succeed with what they bought, set expectations for delivery, and introduce the next logical product at the right time.

For consumables, this flow should connect to replenishment timing. For everything else, think about what a customer needs after they've used the product for a few weeks.

**Common mistake:** treating post-purchase as a thank-you email and a review request, and nothing else.

## 5. Win-back

**Trigger:** A segment or metric-based trigger, based on time since last order.

Every store has a natural repurchase window. Win-back flows start once a customer has gone quiet for longer than that window. Lead with what's new, then escalate the incentive gradually across the flow.

**Common mistake:** using the same timing for every product. A customer who bought a coat and a customer who bought coffee have very different buying cycles.

## Where to start

If you only fix one thing this month, check the filters and exit conditions across all five. Most underperforming flows aren't missing emails. They're sending the right email to the wrong person at the wrong time.`,
  },
  {
    title: "How to audit your Klaviyo account in an afternoon",
    slug: "how-to-audit-your-klaviyo-account",
    excerpt:
      "A practical checklist for finding the biggest gaps in your email program, in the order we'd look at them.",
    category: "Klaviyo",
    published_at: "2026-08-18T09:00:00Z",
    featured: false,
    seo_title: "How to Audit Your Klaviyo Account: A Practical Checklist",
    seo_description:
      "A step-by-step Klaviyo audit checklist covering flows, campaigns, segmentation, deliverability, design and attribution.",
    content: `An audit isn't about finding everything that could be better. It's about finding the few things that are costing the most, and fixing those first.

Here's the order we work in.

## 1. Look at where revenue actually comes from

Open your Klaviyo analytics and split attributed revenue between flows and campaigns over the last 90 days. Then look at the flows one by one.

You're looking for gaps, not totals. A healthy account usually has meaningful revenue from welcome, abandoned checkout and post-purchase flows. If one of those is near zero, that's your first lead.

Also check your attribution window. Klaviyo's defaults are reasonable, but you should know what they are before you draw conclusions.

## 2. Check each core flow's logic

For every live flow, check:

- **Trigger:** is it the right event?
- **Flow filters:** does it exclude people who've already done the thing you want?
- **Timing:** are the delays based on customer behaviour or just habit?
- **Smart Sending:** is it on or off, and was that a deliberate choice?
- **Branches:** are first-time buyers and repeat customers treated differently?

Many flows were built once, years ago, and never revisited.

## 3. Review campaign strategy

Pull the last three months of campaigns. Ask:

- How often are you sending, and to whom?
- Is every campaign going to the whole list?
- What's the mix of promotional and non-promotional content?
- Is there a calendar, or is each send decided that week?

Sending everything to everyone is the most common campaign problem we see. It's also the easiest to fix.

## 4. Audit your segments

Check that you have, at minimum, working segments for engaged subscribers, first-time buyers, repeat buyers and lapsed customers. Then check whether campaigns actually use them.

## 5. Check deliverability basics

- Are you sending from a branded sending domain?
- Are SPF, DKIM and DMARC set up correctly?
- Are spam complaint rates and bounce rates stable?
- Do you have a sunset policy for unengaged profiles?

If deliverability is weak, nothing else in this list matters as much as it should.

## 6. Review design and copy

Open your top five emails on a phone. Is the offer clear in the first screen? Is there one obvious action? Does the subject line and preview text work as a pair?

## 7. Write down the top three fixes

Finish with a short list. Not twenty items. Three, ranked by likely revenue impact and effort. That's the list you can actually act on.

If you'd like a second pair of eyes, that's exactly what our free Klaviyo revenue audit is for.`,
  },
  {
    title: "Gmail and Yahoo sender rules: a deliverability checklist for Shopify brands",
    slug: "gmail-yahoo-sender-requirements-checklist",
    excerpt:
      "Since 2024, Gmail and Yahoo have required bulk senders to meet authentication, unsubscribe and spam-rate standards. Here's what that means for a Klaviyo account.",
    category: "Deliverability",
    published_at: "2026-08-04T09:00:00Z",
    featured: false,
    seo_title: "Gmail & Yahoo Sender Requirements: Checklist for Klaviyo",
    seo_description:
      "What Gmail and Yahoo's bulk sender requirements mean for Shopify brands on Klaviyo: authentication, one-click unsubscribe and spam rates.",
    content: `In February 2024, Gmail and Yahoo introduced requirements for bulk senders. If your store sends marketing email at any real scale, they apply to you.

The rules aren't complicated. But missing one quietly moves your emails out of the inbox, and that shows up as falling revenue long before anyone thinks to check deliverability.

## Authentication

- **Use a branded sending domain.** Send from your own domain, not a shared one.
- **SPF and DKIM** must be set up for that domain.
- **DMARC** must be published. A policy of \`p=none\` meets the minimum, but it's a starting point, not a destination.
- **Alignment:** the domain in your From address should align with the authenticated domain.

In Klaviyo, setting up a branded sending domain handles most of this. It's worth confirming it's actually been done, because many accounts were set up before it mattered.

## Unsubscribing

- Marketing emails must support **one-click unsubscribe**.
- Unsubscribe requests must be honoured promptly (Google specifies within two days).
- The unsubscribe link should be easy to find in the email body.

Making unsubscribing hard doesn't keep people on your list. It turns them into spam complaints, which is worse.

## Spam complaint rate

Google asks senders to keep reported spam rates below 0.3%, and recommends staying under 0.1%. You can monitor this in Google Postmaster Tools.

The practical ways to keep complaints low:

- Send to engaged segments by default, not your whole list
- Set expectations at signup about what you'll send and how often
- Run a sunset flow that stops mailing people who haven't engaged in months

## Engagement is the real signal

Authentication gets you through the door. Engagement keeps you in the inbox. Mailbox providers watch how recipients interact with your mail, so sending less to people who don't care is often the fastest way to improve results for people who do.

## Quick checklist

1. Branded sending domain set up and verified
2. SPF, DKIM and DMARC in place and aligned
3. One-click unsubscribe working
4. Google Postmaster Tools connected
5. Engaged segments used for campaigns
6. A sunset policy for unengaged profiles`,
  },
  {
    title: "Segmentation that changes revenue, not just open rates",
    slug: "klaviyo-segmentation-that-drives-revenue",
    excerpt:
      "Most segmentation is based on engagement. The segments that change revenue are based on buying behaviour. Here's how to build both.",
    category: "Segmentation",
    published_at: "2026-07-21T09:00:00Z",
    featured: false,
    seo_title: "Klaviyo Segmentation Strategy for Ecommerce Revenue",
    seo_description:
      "How to build Klaviyo segments around purchase behaviour, not just engagement, so campaigns reach the right customers with the right message.",
    content: `Ask most stores how they segment and they'll describe engagement: opened in the last 30, 60 or 90 days. That's useful for deliverability. It's not enough for revenue.

## Why open rates are a weak signal

Since Apple introduced Mail Privacy Protection, opens from Apple Mail users are often recorded whether or not a person actually read the email. Open-based segments are now noisier than they used to be.

Clicks, site activity and orders are stronger signals. Use them wherever you can.

## Two kinds of segments

**Engagement segments** decide who you can safely send to. They protect deliverability.

**Behavioural segments** decide what you should say. They change revenue.

You need both. Engagement sets the boundary. Behaviour sets the message.

## Behavioural segments worth building

- **Subscribers who haven't purchased.** They need reasons to buy for the first time.
- **One-time buyers.** The most important group in most stores. Getting a second order is where retention starts.
- **Repeat buyers.** Reward them with early access, not deeper discounts.
- **Lapsed customers.** Past their usual repurchase window.
- **Category buyers.** People who bought from a specific collection.
- **Discount-driven buyers.** Customers who only ever buy with a code. Worth knowing before a sale.

## Using them in campaigns

You don't need a different email for every segment. Start by changing one thing: the offer, the product focus, or who gets the send at all.

For example: send a new collection to engaged subscribers and repeat buyers first, then to one-time buyers a day later with a line about free returns. Same creative, different emphasis.

## Keep it maintainable

A segment nobody uses is just clutter. Build the handful you'll actually use every week, name them clearly, and review them each quarter.`,
  },
  {
    title: "Planning BFCM email: start with the list, not the offer",
    slug: "bfcm-email-strategy-start-with-the-list",
    excerpt:
      "Black Friday results are mostly decided before November. The brands that do well have warmed their list, planned their segments and fixed their flows well in advance.",
    category: "Campaigns",
    published_at: "2026-07-07T09:00:00Z",
    featured: false,
    seo_title: "BFCM Email Strategy for Shopify Brands",
    seo_description:
      "How to plan Black Friday and Cyber Monday email: list warming, segmentation, flow checks and a calendar that doesn't burn out your subscribers.",
    content: `Every year, brands spend weeks on their Black Friday offer and a few days on how they'll send it. It should be closer to the other way around.

## Warm the list early

Inboxes are crowded in late November and mailbox providers are strict. If you plan to send to more of your list than usual, start increasing volume gradually in the weeks before, so the jump isn't sudden.

Re-engage lapsed subscribers in October, not on Black Friday morning.

## Decide your segments before your creative

At minimum, plan for:

- **Repeat buyers and VIPs:** early access before the public sale
- **Engaged subscribers who haven't bought:** your biggest opportunity for first orders
- **Recent buyers:** they may not need a discount at all
- **Unengaged profiles:** send less, or not at all

Early access for your best customers moves revenue ahead of the busiest days and rewards the people who matter most.

## Check your flows

Traffic spikes, which means your abandoned checkout, browse abandonment and welcome flows all get busier. Check that:

- Flow messaging doesn't clash with the sale
- Discounts in flows don't undercut the sale offer
- New subscribers from BFCM get a welcome series that works after the sale ends

## Build a calendar

Map every send: date, segment, message, offer. Include a teaser, the launch, reminders, a last-chance send and Cyber Monday. Then remove anything that doesn't have a clear job.

## Plan the week after

BFCM brings in a lot of first-time buyers. The post-purchase flow is what turns them into repeat customers. Make sure it's ready before the sale starts, not after.`,
  },
];
