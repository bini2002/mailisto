import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Mailisto website.",
  alternates: { canonical: "/terms" },
};

// NOTE FOR THE SITE OWNER: replace the bracketed placeholders and have these reviewed
// by a qualified adviser before launch. Client engagements should be covered by a separate agreement.
const content = `These terms apply to your use of mailisto.com (the "website"), operated by [Legal entity name] ("Mailisto", "we", "us").

## Using the website

You may use the website for lawful purposes only. You must not attempt to interfere with its operation, access areas you're not authorised to access, or submit spam or malicious content through our forms.

## Content

Articles and resources on the website are general information, not professional advice for your specific business. Results from email marketing depend on many factors, and nothing on this website is a guarantee of any particular outcome.

Email designs labelled as "Concept" or "Design Lab" are original examples created by Mailisto for fictional brands. They are not client work.

## Intellectual property

Unless stated otherwise, the content, design and code of this website belong to Mailisto. Klaviyo and Shopify are trademarks of their respective owners. Mailisto is an independent agency and these references do not imply endorsement.

## Free audits

Requesting a free audit does not create any obligation for either party. Any paid work is governed by a separate written agreement.

## Links

The website may link to third-party sites. We aren't responsible for their content or practices.

## Liability

To the extent permitted by law, the website is provided "as is" and we are not liable for any loss arising from its use.

## Governing law

These terms are governed by the laws of [jurisdiction].

## Contact

Questions about these terms: [contact email].`;

export default function TermsPage() {
  return <LegalPage title="Terms of Use" updated="[Date]" source={content} />;
}
