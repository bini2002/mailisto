"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { PiXLight } from "react-icons/pi";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

/** Native <dialog>: focus trapping, Escape to close and inert background come for free. */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-6xl overflow-hidden border border-ink bg-paper p-0 text-ink backdrop:bg-black/70",
        className,
      )}
    >
      {open && (
        <div className="flex max-h-[92dvh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
            <p className="label truncate text-muted">{title}</p>
            <button type="button" onClick={onClose} className="inline-flex size-9 shrink-0 items-center justify-center border border-line-strong hover:border-ink" autoFocus>
              <PiXLight aria-hidden="true" className="size-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="overflow-y-auto overscroll-contain">{children}</div>
        </div>
      )}
    </dialog>
  );
}
