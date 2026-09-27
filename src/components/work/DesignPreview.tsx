import Image from "next/image";
import type { DesignView } from "@/lib/data";
import { EmailMock } from "../email/EmailMock";

/** Renders either an uploaded screenshot or a built-in coded concept. Never distorts the email. */
export function DesignPreview({ design, mode, priority }: { design: DesignView; mode: "card" | "full"; priority?: boolean }) {
  if (design.image_url) {
    const alt = design.image_alt || `${design.email_type} email design: ${design.title}`;
    if (mode === "card") {
      return (
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
          <Image
            src={design.image_url}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top"
            priority={priority}
          />
        </div>
      );
    }
    return (
      <Image
        src={design.image_url}
        alt={alt}
        width={1200}
        height={2400}
        sizes="(min-width: 768px) 600px, 100vw"
        style={{ width: "100%", height: "auto" }}
      />
    );
  }
  if (design.concept) {
    return (
      <div role="img" aria-label={`${design.email_type} email concept for ${design.concept.brand}: ${design.title}`}>
        <div aria-hidden="true" className={mode === "card" ? "aspect-[4/5] overflow-hidden" : undefined}>
          <EmailMock concept={design.concept} />
        </div>
      </div>
    );
  }
  return <div className="flex aspect-[4/5] items-center justify-center bg-paper-2 text-sm text-muted">Preview unavailable</div>;
}
