import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { getSiteSettings } from "@/lib/data";
import { auditCta, site, talkCta } from "@/lib/site";
import { safeUrl } from "@/lib/utils";
import { Logo } from "../ui/Logo";

const columns = [
  {
    title: "Mailisto",
    links: [
      { label: "Services", href: "/#services" },
      { label: "Process", href: "/#process" },
      { label: "Work", href: "/work" },
      { label: "About", href: "/#about" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Klaviyo audits", href: "/audit" },
      { label: "Lifecycle flows", href: "/#services" },
      { label: "Email campaigns", href: "/#services" },
      { label: "Design & copywriting", href: "/#services" },
      { label: "Testing & reporting", href: "/#services" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Design Lab", href: "/work" },
      { label: "Free Klaviyo audit", href: "/audit" },
    ],
  },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const socials = [
    {
      href: safeUrl(settings.linkedin_url),
      label: "LinkedIn",
      Icon: FaLinkedinIn,
    },
    {
      href: safeUrl(settings.instagram_url),
      label: "Instagram",
      Icon: FaInstagram,
    },
    { href: safeUrl(settings.x_url), label: "X", Icon: FaXTwitter },
  ].filter((s) => s.href);
  const email = settings.contact_email;

  return (
    <footer className="bg-ink text-white">
      <div className="container-x pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-[1.05rem] leading-relaxed text-muted-dark">
              A Klaviyo email agency for Shopify brands. We build and run the
              flows, campaigns and segmentation that turn your list into repeat
              revenue.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={auditCta.href}
                className="label inline-flex h-11 items-center bg-lime px-4 text-ink transition-colors hover:bg-lime-deep"
              >
                {auditCta.label}
              </Link>
              <Link
                href={talkCta.href}
                className="label inline-flex h-11 items-center border border-line-dark px-4 transition-colors hover:border-white"
              >
                {talkCta.label}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-7">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="label text-muted-dark">{col.title}</h2>
                <ul className="mt-5 space-y-3 text-[0.95rem]">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-white/85 transition-colors hover:text-lime"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="label text-muted-dark">Contact</h2>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                <li>
                  <Link
                    href="/contact"
                    className="text-white/85 transition-colors hover:text-lime"
                  >
                    Send a message
                  </Link>
                </li>
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="break-all text-white/85 transition-colors hover:text-lime"
                    >
                      {email}
                    </a>
                  </li>
                )}
              </ul>
              {socials.length > 0 && (
                <ul className="mt-6 flex gap-2">
                  {socials.map(({ href, label, Icon }) => (
                    <li key={label}>
                      <a
                        href={href!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-9 items-center justify-center border border-line-dark text-white/85 transition-colors hover:border-lime hover:text-lime"
                      >
                        <Icon aria-hidden="true" />
                        <span className="sr-only">{label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <p
            aria-hidden="true"
            className="mt-20 select-none text-[clamp(3.5rem,15vw,13rem)] leading-[0.8] font-semibold tracking-[-0.06em] text-ink-4"
          >
            mailisto
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line-dark pt-6 text-sm text-muted-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Klaviyo email marketing
            for ecommerce.
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
