"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { submitContact } from "@/app/actions/forms";
import { initialFormState } from "@/lib/form-state";
import { type FieldErrors, validateContact } from "@/lib/validation";
import { Button } from "../ui/Button";
import { ErrorState } from "../ui/States";
import { Honeypot, TextAreaField, TextField } from "./Field";

type Values = { name: string; email: string; store_url: string; message: string };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialFormState);
  const [values, setValues] = useState<Values>({ name: "", email: "", store_url: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [startedAt, setStartedAt] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => setStartedAt(String(Date.now())), []);
  useEffect(() => {
    if (state.status === "error" && state.fieldErrors) setErrors(state.fieldErrors);
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  const set = (name: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setValues((p) => ({ ...p, [name]: v }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validateContact(values);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = Object.keys(errs)[0];
      document.getElementById(`contact-${first}`)?.focus();
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
        <h2 className="mt-6 text-2xl font-semibold tracking-tight">{state.name ? `Thanks, ${state.name}.` : "Thanks."} Message received.</h2>
        <p className="mt-3 max-w-md text-muted">We read every message ourselves and will reply by email. If it&rsquo;s about your Klaviyo account, the free audit is often the fastest place to start.</p>
      </div>
    );
  }

  const err = (k: keyof Values) => errors[k] || undefined;

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="relative grid gap-5">
      <Honeypot />
      <input type="hidden" name="started_at" value={startedAt} />

      {state.status === "error" && state.message && !state.fieldErrors && (
        <ErrorState title="Your message wasn't sent">{state.message}</ErrorState>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="contact-name" name="name" label="Name" autoComplete="name" value={values.name} onChange={set("name")} error={err("name")} required maxLength={100} />
        <TextField id="contact-email" name="email" type="email" inputMode="email" label="Email" autoComplete="email" value={values.email} onChange={set("email")} error={err("email")} required maxLength={254} />
      </div>
      <TextField
        id="contact-store_url"
        name="store_url"
        label="Store URL"
        optional
        placeholder="yourstore.com"
        inputMode="url"
        autoComplete="url"
        value={values.store_url}
        onChange={set("store_url")}
        error={err("store_url")}
        maxLength={300}
      />
      <TextAreaField
        id="contact-message"
        name="message"
        label="Message"
        rows={5}
        placeholder="Tell us about your store and what you'd like email to do for it."
        value={values.message}
        onChange={set("message")}
        error={err("message")}
        required
        maxLength={3000}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          Used only to reply to you. See our{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
            privacy policy
          </a>
          .
        </p>
        <Button type="submit" size="lg" loading={pending} arrow>
          {pending ? "Sending" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
