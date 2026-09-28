import type { Metadata } from "next";
import Link from "next/link";
import { ContactOptions } from "@/components/forms/ContactOptions";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/data";
import { calendlyUrl } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Mailisto about Klaviyo email marketing for your Shopify store. Send us a message and we'll reply by email.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: "Contact | Mailisto" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const calendly = calendlyUrl(settings.calendly_url) ?? calendlyUrl(process.env.NEXT_PUBLIC_CALENDLY_URL);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <section>
        <div className="container-x grid gap-14 pt-12 pb-24 sm:pt-16 lg:grid-cols-12 lg:gap-16 lg:pt-20">
          <div className="hero-in lg:col-span-5">
            <p className="label flex items-center gap-3 text-muted">
              <span aria-hidden="true" className="size-2 bg-lime ring-1 ring-ink/20" />
              Let&rsquo;s talk
            </p>
            <h1 className="mt-6 text-[clamp(2.4rem,1.5rem+3.6vw,4.4rem)] leading-[1.03] font-semibold">Let&rsquo;s make email work harder.</h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Tell us about your store and what you want from email. Send a message and we&rsquo;ll reply personally{calendly ? ", or book a call at a time that suits you" : ""}.
            </p>

            <div className="mt-12 space-y-8 border-t border-line pt-8">
              {settings.contact_email && (
                <div>
                  <h2 className="label text-muted">Email</h2>
                  <a href={`mailto:${settings.contact_email}`} className="mt-2 inline-block text-lg font-medium underline decoration-lime decoration-2 underline-offset-4">
                    {settings.contact_email}
                  </a>
                </div>
              )}
              <div>
                <h2 className="label text-muted">Want specifics first?</h2>
                <p className="mt-2 text-[0.95rem] text-muted">
                  The free audit is the quickest way to see what we&rsquo;d change in your account.{" "}
                  <Link href="/audit" className="font-medium text-ink underline decoration-lime decoration-2 underline-offset-4">
                    Get a Free Audit (delivered in 48 hours)
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactOptions calendlyUrl={calendly} />
          </div>
        </div>
      </section>
    </>
  );
}
