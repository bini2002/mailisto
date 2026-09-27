import type { ReactNode } from "react";

export function PageHeader({ label, title, intro, children }: { label: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <header className="border-b border-line">
      <div className="container-x hero-in grid gap-8 pt-14 pb-14 sm:pt-20 lg:grid-cols-12 lg:pb-20">
        <div className="lg:col-span-8">
          <p className="label flex items-center gap-3 text-muted">
            <span aria-hidden="true" className="size-2 bg-lime ring-1 ring-ink/20" />
            {label}
          </p>
          <h1 className="mt-6 text-display font-semibold">{title}</h1>
        </div>
        {(intro || children) && (
          <div className="lg:col-span-4 lg:self-end">
            {intro && <div className="text-lg leading-relaxed text-muted">{intro}</div>}
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
