import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Button";

export function LoadingState({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <div role="status" className={cn("flex items-center gap-3 py-10 text-sm text-muted", className)}>
      <Spinner />
      <span>{label}…</span>
    </div>
  );
}

export function EmptyState({ title, children, action, className }: { title: string; children?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("border border-dashed border-line-strong px-6 py-12 text-center", className)}>
      <p className="font-medium text-ink">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-muted">{children}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", children, action, className }: { title?: string; children?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div role="alert" className={cn("border border-danger/30 bg-danger/5 px-5 py-4 text-sm", className)}>
      <p className="font-medium text-danger">{title}</p>
      {children && <div className="mt-1 text-ink/80">{children}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
