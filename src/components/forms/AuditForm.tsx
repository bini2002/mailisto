"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { submitAudit } from "@/app/actions/forms";
import { initialFormState } from "@/lib/form-state";
import {
  CHALLENGES,
  LIST_SIZES,
  PLATFORMS,
  REVENUE_RANGES,
  type FieldErrors,
  validateAuditStep1,
  validateAuditStep2,
} from "@/lib/validation";
import { AuditBadge, Button } from "../ui/Button";
import { ErrorState } from "../ui/States";
import { Honeypot, SelectField, TextAreaField, TextField } from "./Field";

const STEP1 = ["name", "email", "store_url"] as const;

type Values = Record<"name" | "email" | "store_url" | "revenue_range" | "platform" | "list_size" | "challenge" | "details", string>;
const empty: Values = { name: "", email: "", store_url: "", revenue_range: "", platform: "", list_size: "", challenge: "", details: "" };

/**
 * Two short steps so the form never feels like a wall of fields:
 *   1. Who you are (3 fields)   2. Your store (4 quick selects + optional note)
 * Values are controlled so nothing is lost on a server-side error.
 */
export function AuditForm({ idPrefix = "audit" }: { idPrefix?: string }) {
  const [state, formAction, pending] = useActionState(submitAudit, initialFormState);
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [startedAt, setStartedAt] = useState("");
  const step2Ref = useRef<HTMLFieldSetElement>(null);
  const step1Ref = useRef<HTMLFieldSetElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => setStartedAt(String(Date.now())), []);

  // Surface server-side field errors, and jump back to step 1 if that's where they are.
  useEffect(() => {
    if (state.status === "error" && state.fieldErrors) {
      setErrors(state.fieldErrors);
      if (STEP1.some((k) => state.fieldErrors?.[k])) setStep(1);
    }
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  const id = (name: string) => `${idPrefix}-${name}`;
  const set = (name: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [name]: v }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  function focusFirstError(errs: FieldErrors) {
    const first = Object.keys(errs).find((k) => errs[k]);
    if (first) requestAnimationFrame(() => document.getElementById(id(first))?.focus());
  }

  function goToStep2() {
    const errs = validateAuditStep1(values);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    setStep(2);
    requestAnimationFrame(() => step2Ref.current?.querySelector<HTMLElement>("select, input, textarea")?.focus());
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (step === 1) {
      e.preventDefault();
      goToStep2();
      return;
    }
    // Submit manually (not via the native action) so React never resets the fields on a server error.
    e.preventDefault();
    const errs = { ...validateAuditStep1(values), ...validateAuditStep2(values) };
    const clean = Object.fromEntries(Object.entries(errs).filter(([, v]) => v));
    if (Object.keys(clean).length) {
      setErrors(clean);
      if (STEP1.some((k) => clean[k])) setStep(1);
      focusFirstError(clean);
      return;
    }
    if (pending) return;
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  }

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="outline-none">
        <span aria-hidden="true" className="flex size-12 items-center justify-center bg-lime text-xl">
          ✓
        </span>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight">{state.name ? `Thanks, ${state.name}. ` : ""}Your audit request is in.</h3>
        <p className="mt-3 text-muted">Here&rsquo;s what happens next:</p>
        <ol className="mt-5 space-y-4 border-t border-line pt-5 text-[0.95rem]">
          <li className="flex gap-4">
            <span className="label pt-1 text-muted">01</span>
            <span>We review your details and store, and reply by email to arrange access to your email and SMS platform (a read-only user is fine).</span>
          </li>
          <li className="flex gap-4">
            <span className="label pt-1 text-muted">02</span>
            <span>Within 48 hours of getting access, we send you a written review of what we find.</span>
          </li>
          <li className="flex gap-4">
            <span className="label pt-1 text-muted">03</span>
            <span>You get prioritised recommendations. Keep them, use them, no obligation.</span>
          </li>
        </ol>
      </div>
    );
  }

  const fieldError = (k: keyof Values) => errors[k] || undefined;

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="relative" aria-describedby={`${idPrefix}-progress`}>
      <Honeypot />
      <input type="hidden" name="started_at" value={startedAt} />

      <div className="mb-7 flex items-center justify-between gap-4">
        <p id={`${idPrefix}-progress`} className="label text-muted" aria-live="polite">
          Step {step} of 2 · {step === 1 ? "About you" : "About your store"}
        </p>
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="h-1 w-8 bg-ink" />
          <span className={`h-1 w-8 transition-colors ${step === 2 ? "bg-ink" : "bg-line-strong"}`} />
        </div>
      </div>

      {state.status === "error" && state.message && !state.fieldErrors && (
        <ErrorState title="Your request wasn't sent" className="mb-6">
          {state.message}
        </ErrorState>
      )}

      <fieldset ref={step1Ref} hidden={step !== 1} className="grid gap-5">
        <legend className="sr-only">About you</legend>
        <TextField id={id("name")} name="name" label="Name" autoComplete="name" value={values.name} onChange={set("name")} error={fieldError("name")} required maxLength={100} />
        <TextField
          id={id("email")}
          name="email"
          type="email"
          label="Work email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={set("email")}
          error={fieldError("email")}
          required
          maxLength={254}
        />
        <TextField
          id={id("store_url")}
          name="store_url"
          label="Store URL"
          placeholder="yourstore.com"
          autoComplete="url"
          inputMode="url"
          value={values.store_url}
          onChange={set("store_url")}
          error={fieldError("store_url")}
          required
          maxLength={300}
        />
        <Button type="submit" size="lg" className="mt-2 w-full" arrow>
          Continue
        </Button>
      </fieldset>

      <fieldset ref={step2Ref} hidden={step !== 2} className="grid gap-5">
        <legend className="sr-only">About your store</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField id={id("revenue_range")} name="revenue_range" label="Monthly online revenue" options={REVENUE_RANGES} value={values.revenue_range} onChange={set("revenue_range")} error={fieldError("revenue_range")} required />
          <SelectField id={id("platform")} name="platform" label="Current email / SMS platform" options={PLATFORMS} value={values.platform} onChange={set("platform")} error={fieldError("platform")} required />
          <SelectField id={id("list_size")} name="list_size" label="Approximate list size" options={LIST_SIZES} value={values.list_size} onChange={set("list_size")} error={fieldError("list_size")} required />
          <SelectField id={id("challenge")} name="challenge" label="Biggest email or SMS challenge" options={CHALLENGES} value={values.challenge} onChange={set("challenge")} error={fieldError("challenge")} required />
        </div>
        <TextAreaField
          id={id("details")}
          name="details"
          label="Anything else we should know?"
          optional
          rows={3}
          maxLength={2000}
          placeholder="Goals, recent changes, what you've already tried…"
          value={values.details}
          onChange={set("details")}
        />
        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
          <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)} disabled={pending}>
            Back
          </Button>
          <Button type="submit" size="lg" className="flex-1" loading={pending} arrow>
            {pending ? "Sending" : "Get My Free Audit"}
            {!pending && <AuditBadge />}
          </Button>
        </div>
      </fieldset>

      <p className="mt-5 text-xs leading-relaxed text-muted">
        We only use these details to prepare your audit and reply to you. See our{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
