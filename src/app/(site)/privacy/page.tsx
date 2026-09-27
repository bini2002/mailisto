import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Mailisto collects, uses and protects personal information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

// NOTE FOR THE SITE OWNER: replace the bracketed placeholders and have this reviewed
// by a qualified adviser for the jurisdictions you operate in before launch.
const content = `This policy explains what personal information Mailisto collects through mailisto.com, why we collect it, and how we look after it.

## Who we are

Mailisto is operated by [Legal entity name], [registered address / company number, if applicable]. For anything related to this policy, contact us at [privacy contact email].

## What we collect

We only collect information you choose to give us through our forms:

- **Free audit form:** your name, work email, store URL, approximate monthly revenue range, current email platform, approximate list size, your biggest email challenge and any extra notes you add.
- **Contact form:** your name, email, store URL (optional) and your message.

Our hosting provider may also process standard technical information, such as IP addresses and browser details, in server logs for security and reliability.

## How we use it

We use this information to:

- Prepare your audit and reply to your enquiry
- Follow up about the work you've asked us about
- Protect our forms from spam and abuse

We do not sell your information, and we do not add you to a marketing list without your permission.

## Where it's stored

Form submissions are stored in a database provided by Supabase, which acts as our data processor. The website is hosted by [hosting provider]. These providers may process data outside your country, under appropriate safeguards.

## How long we keep it

We keep enquiry and audit information for as long as needed to respond and for a reasonable period afterwards, typically no longer than [retention period], unless we go on to work together.

## Cookies

The public website does not use advertising or analytics cookies. Strictly necessary cookies are used only for signing in to our private admin area.

## Your rights

Depending on where you live, you may have the right to access, correct, delete or restrict the use of your personal information, and to object to its processing. To make a request, contact [privacy contact email]. You may also have the right to complain to your local data protection authority.

## Changes

We may update this policy from time to time. The date at the top of this page shows when it was last changed.`;

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" updated="[Date]" source={content} />;
}
