/** Shared by client and server. The server always re-validates; never trust the client. */

export const REVENUE_RANGES = [
  "Under $25k / month",
  "$25k–$100k / month",
  "$100k–$250k / month",
  "$250k–$1M / month",
  "$1M+ / month",
] as const;

export const PLATFORMS = ["Klaviyo", "Shopify Email", "Mailchimp", "Omnisend", "Other", "Not using one yet"] as const;

export const LIST_SIZES = ["Under 5,000", "5,000–25,000", "25,000–100,000", "100,000–500,000", "500,000+", "Not sure"] as const;

export const CHALLENGES = [
  "Email revenue has plateaued",
  "Flows are missing or outdated",
  "Campaigns are inconsistent",
  "Weak segmentation",
  "Deliverability or inbox placement",
  "Setting up or migrating to Klaviyo",
  "Not sure what's working",
  "Something else",
] as const;

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FREE_TEXT_MAX = 2000;

export function clean(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  // Strip control characters, collapse surrounding whitespace.
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

export function normaliseStoreUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    if (!url.hostname.includes(".") || url.hostname.length > 253) return null;
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return `${url.protocol}//${url.hostname}${url.pathname === "/" ? "" : url.pathname}`.slice(0, 300);
  } catch {
    return null;
  }
}

export function validateEmail(v: string) {
  return EMAIL_RE.test(v) && v.length <= 254;
}

export interface AuditInput {
  name: string;
  email: string;
  store_url: string;
  revenue_range: string;
  platform: string;
  list_size: string;
  challenge: string;
  details: string;
}

export function readAuditInput(get: (k: string) => unknown): AuditInput {
  return {
    name: clean(get("name"), 100),
    email: clean(get("email"), 254).toLowerCase(),
    store_url: clean(get("store_url"), 300),
    revenue_range: clean(get("revenue_range"), 60),
    platform: clean(get("platform"), 60),
    list_size: clean(get("list_size"), 60),
    challenge: clean(get("challenge"), 120),
    details: clean(get("details"), FREE_TEXT_MAX),
  };
}

export function validateAuditStep1(i: Pick<AuditInput, "name" | "email" | "store_url">): FieldErrors {
  const e: FieldErrors = {};
  if (i.name.length < 2) e.name = "Please enter your name.";
  if (!validateEmail(i.email)) e.email = "Please enter a valid work email.";
  if (!normaliseStoreUrl(i.store_url)) e.store_url = "Please enter your store URL, e.g. yourstore.com";
  return e;
}

export function validateAuditStep2(i: Pick<AuditInput, "revenue_range" | "platform" | "list_size" | "challenge">): FieldErrors {
  const e: FieldErrors = {};
  if (!(REVENUE_RANGES as readonly string[]).includes(i.revenue_range)) e.revenue_range = "Please choose a revenue range.";
  if (!(PLATFORMS as readonly string[]).includes(i.platform)) e.platform = "Please choose your email platform.";
  if (!(LIST_SIZES as readonly string[]).includes(i.list_size)) e.list_size = "Please choose a list size.";
  if (!(CHALLENGES as readonly string[]).includes(i.challenge)) e.challenge = "Please choose your biggest challenge.";
  return e;
}

export function validateAudit(i: AuditInput): FieldErrors {
  return { ...validateAuditStep1(i), ...validateAuditStep2(i) };
}

export interface ContactInput {
  name: string;
  email: string;
  store_url: string;
  message: string;
}

export function readContactInput(get: (k: string) => unknown): ContactInput {
  return {
    name: clean(get("name"), 100),
    email: clean(get("email"), 254).toLowerCase(),
    store_url: clean(get("store_url"), 300),
    message: clean(get("message"), 3000),
  };
}

export function validateContact(i: ContactInput): FieldErrors {
  const e: FieldErrors = {};
  if (i.name.length < 2) e.name = "Please enter your name.";
  if (!validateEmail(i.email)) e.email = "Please enter a valid email.";
  if (i.store_url && !normaliseStoreUrl(i.store_url)) e.store_url = "That doesn't look like a valid URL.";
  if (i.message.length < 10) e.message = "Please add a little more detail (10+ characters).";
  return e;
}
