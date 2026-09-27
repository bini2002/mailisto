"use client";

import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import type { AdminResult } from "@/app/admin/actions";
import { Button } from "../ui/Button";
import { useToast } from "./Toast";

/**
 * Submits via startTransition rather than <form action>, so fields are never reset on a validation error.
 * Server actions re-check admin access and validate every field; RLS is the final guard.
 */
export function AdminForm({
  action,
  children,
  submitLabel = "Save",
  className,
}: {
  action: (fd: FormData) => Promise<AdminResult>;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await action(fd);
          toast(res.message, res.ok ? "success" : "error");
          if (res.ok) {
            if (res.redirectTo) router.push(res.redirectTo);
            else router.refresh();
          }
        });
      }}
    >
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
      <div className="sticky bottom-0 z-10 mt-8 flex items-center justify-end gap-3 border-t border-line bg-paper/95 py-4">
        <Button type="submit" variant="dark" loading={pending}>
          {pending ? "Saving" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

/** A small button that runs a server action with hidden values, optionally after a confirm prompt. */
export function ActionButton({
  action,
  values,
  label,
  confirm,
  variant = "outline",
}: {
  action: (fd: FormData) => Promise<AdminResult>;
  values: Record<string, string>;
  label: string;
  confirm?: string;
  variant?: "outline" | "danger" | "ghost";
}) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();
  const styles =
    variant === "danger"
      ? "border-danger/40 text-danger hover:bg-danger hover:text-white"
      : variant === "ghost"
        ? "border-transparent text-muted hover:text-ink underline underline-offset-2"
        : "border-line-strong hover:border-ink";
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        const fd = new FormData();
        for (const [k, v] of Object.entries(values)) fd.set(k, v);
        startTransition(async () => {
          const res = await action(fd);
          toast(res.message, res.ok ? "success" : "error");
          if (res.ok) {
            if (res.redirectTo) router.push(res.redirectTo);
            else router.refresh();
          }
        });
      }}
      className={`inline-flex h-9 items-center border px-3 text-sm transition-colors disabled:opacity-50 ${styles}`}
    >
      {pending ? "Working…" : label}
    </button>
  );
}
