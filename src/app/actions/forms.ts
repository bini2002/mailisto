"use server";

import { headers } from "next/headers";
import type { FormState } from "@/lib/form-state";
import { rateLimit } from "@/lib/rate-limit";
import { getPublicSupabase } from "@/lib/supabase/public";
import { HONEYPOT_FIELD } from "@/components/forms/Field";
import { normaliseStoreUrl, readAuditInput, readContactInput, validateAudit, validateContact } from "@/lib/validation";

const MIN_FILL_MS = 2500;
const GENERIC_ERROR = "Something went wrong on our side. Please try again, or email us directly.";

async function clientKey() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return ip;
}

/** Returns a reason to silently drop the submission (bot), or null if it looks human. */
function spamCheck(formData: FormData): "honeypot" | "too-fast" | null {
  if (String(formData.get(HONEYPOT_FIELD) ?? "").trim() !== "") return "honeypot";
  const started = Number(formData.get("started_at"));
  if (Number.isFinite(started) && started > 0 && Date.now() - started < MIN_FILL_MS) return "too-fast";
  return null;
}

function dbErrorMessage(message: string) {
  if (message.includes("rate_limited")) return "We've already received a few requests from this address. We'll be in touch soon.";
  return GENERIC_ERROR;
}

export async function submitAudit(_prev: FormState, formData: FormData): Promise<FormState> {
  const spam = spamCheck(formData);
  if (spam === "honeypot") {
    console.warn("[audit] dropped: honeypot field was filled");
    return { status: "success", name: "" };
  }
  if (spam === "too-fast") return { status: "error", message: "That was quick. Please check your details and submit again." };

  if (!rateLimit(`audit:${await clientKey()}`, 5)) {
    return { status: "error", message: "Too many requests. Please wait a few minutes and try again." };
  }

  const input = readAuditInput((k) => formData.get(k));
  const fieldErrors = validateAudit(input);
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors, message: "Please check the highlighted fields." };

  const supabase = getPublicSupabase();
  if (!supabase) {
    console.warn("[audit] Supabase not configured; submission not stored:", input.email);
    return { status: "error", message: "Form storage isn't configured yet. Please email us instead." };
  }

  const { error } = await supabase.from("audit_submissions").insert({
    name: input.name,
    email: input.email,
    store_url: normaliseStoreUrl(input.store_url),
    revenue_range: input.revenue_range,
    platform: input.platform,
    list_size: input.list_size,
    challenge: input.challenge,
    details: input.details || null,
  });

  if (error) {
    console.error("[audit] insert failed:", error.message);
    return { status: "error", message: dbErrorMessage(error.message) };
  }
  return { status: "success", name: input.name.split(" ")[0] };
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const spam = spamCheck(formData);
  if (spam === "honeypot") {
    console.warn("[contact] dropped: honeypot field was filled");
    return { status: "success", name: "" };
  }
  if (spam === "too-fast") return { status: "error", message: "That was quick. Please check your message and send again." };

  if (!rateLimit(`contact:${await clientKey()}`, 5)) {
    return { status: "error", message: "Too many messages. Please wait a few minutes and try again." };
  }

  const input = readContactInput((k) => formData.get(k));
  const fieldErrors = validateContact(input);
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors, message: "Please check the highlighted fields." };

  const supabase = getPublicSupabase();
  if (!supabase) {
    console.warn("[contact] Supabase not configured; message not stored:", input.email);
    return { status: "error", message: "Form storage isn't configured yet. Please email us instead." };
  }

  const { error } = await supabase.from("contact_submissions").insert({
    name: input.name,
    email: input.email,
    store_url: input.store_url ? normaliseStoreUrl(input.store_url) : null,
    message: input.message,
  });

  if (error) {
    console.error("[contact] insert failed:", error.message);
    return { status: "error", message: dbErrorMessage(error.message) };
  }
  return { status: "success", name: input.name.split(" ")[0] };
}
