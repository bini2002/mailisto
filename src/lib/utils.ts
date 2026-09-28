export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function formatDate(value: string | Date | null | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", ...opts });
}

export function readingTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Accepts only https://calendly.com/... scheduling links. */
export function calendlyUrl(url: string | null | undefined): string | null {
  const u = safeUrl(url);
  if (!u) return null;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "https:" && (parsed.hostname === "calendly.com" || parsed.hostname.endsWith(".calendly.com")) && parsed.pathname.length > 1
      ? `${parsed.origin}${parsed.pathname}`
      : null;
  } catch {
    return null;
  }
}

/** Only allow http(s) and relative URLs through to href/src attributes. */
export function safeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  try {
    const u = new URL(trimmed);
    return u.protocol === "https:" || u.protocol === "http:" || u.protocol === "mailto:" ? u.toString() : null;
  } catch {
    return null;
  }
}
