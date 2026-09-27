import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line py-8 lg:grid-cols-[14rem_1fr]">
      <div>
        <h2 className="font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

function Label({ htmlFor, label, hint }: { htmlFor: string; label: string; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-0.5">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

type InputProps = ComponentProps<"input"> & { name: string; label: string; hint?: string };
export function AdminInput({ name, label, hint, className, ...props }: InputProps) {
  const id = `f-${name}`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} label={label} hint={hint} />
      <input id={id} name={name} className="field" {...props} />
    </div>
  );
}

type TextareaProps = ComponentProps<"textarea"> & { name: string; label: string; hint?: string };
export function AdminTextarea({ name, label, hint, className, ...props }: TextareaProps) {
  const id = `f-${name}`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} label={label} hint={hint} />
      <textarea id={id} name={name} className="field min-h-24 resize-y leading-relaxed" {...props} />
    </div>
  );
}

type SelectProps = ComponentProps<"select"> & { name: string; label: string; hint?: string; options: readonly (string | { value: string; label: string })[] };
export function AdminSelect({ name, label, hint, options, className, ...props }: SelectProps) {
  const id = `f-${name}`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} label={label} hint={hint} />
      <select id={id} name={name} className="field" {...props}>
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          const l = typeof o === "string" ? o : o.label;
          return (
            <option key={v} value={v}>
              {l}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function AdminCheckbox({ name, label, hint, defaultChecked, value }: { name: string; label: string; hint?: string; defaultChecked?: boolean; value?: string }) {
  const id = `f-${name}${value ? `-${value}` : ""}`;
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <input id={id} type="checkbox" name={name} value={value} defaultChecked={defaultChecked} className="mt-1 size-4 accent-black" />
      <span>
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}
