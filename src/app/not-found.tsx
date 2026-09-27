import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="container-x flex min-h-[60vh] flex-col justify-center py-24">
        <p className="label text-muted">404</p>
        <h1 className="mt-5 max-w-3xl text-h2 font-semibold">This page didn&rsquo;t make it to the inbox.</h1>
        <p className="mt-5 max-w-lg text-lg text-muted">The link may be old or mistyped. Here are better places to start.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href="/" variant="dark" arrow>
            Home
          </LinkButton>
          <LinkButton href="/audit" arrow>
            Get a Free Audit
          </LinkButton>
          <LinkButton href="/blog" variant="outline">
            Read the blog
          </LinkButton>
        </div>
      </main>
      <Footer />
    </>
  );
}
