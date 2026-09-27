import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}

export function FieldShell({ id, label, error, hint, optional, children, className }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: ReactNode) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

type InputProps = Omit<ComponentProps<"input">, "id"> & { id: string; label: string; error?: string; hint?: ReactNode; optional?: boolean };

export function TextField({ id, label, error, hint, optional, className, ...props }: InputProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <input id={id} className="field" aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, error, hint)} {...props} />
    </FieldShell>
  );
}

type TextAreaProps = Omit<ComponentProps<"textarea">, "id"> & { id: string; label: string; error?: string; hint?: ReactNode; optional?: boolean };

export function TextAreaField({ id, label, error, hint, optional, className, ...props }: TextAreaProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <textarea id={id} className="field min-h-32 resize-y" aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, error, hint)} {...props} />
    </FieldShell>
  );
}

type SelectProps = Omit<ComponentProps<"select">, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  options: readonly string[];
  placeholder?: string;
};

export function SelectField({ id, label, error, hint, options, placeholder = "Select…", className, ...props }: SelectProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
      <select id={id} className="field" aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, error, hint)} {...props}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/** Hidden from people and assistive tech; bots tend to fill it in. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
