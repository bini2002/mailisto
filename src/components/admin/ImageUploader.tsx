"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImage } from "@/app/admin/actions";
import { useToast } from "./Toast";

const ACCEPT = "image/png,image/jpeg,image/webp,image/avif,image/gif";
const MAX = 5 * 1024 * 1024;

/** Uploads to Supabase Storage via a server action and stores the resulting URL in a hidden field. */
export function ImageUploader({
  name,
  label,
  defaultValue,
  folder,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  folder: "designs" | "blog" | "case-studies" | "hero" | "misc";
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const id = `f-${name}`;

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPT.split(",").includes(file.type)) return toast("Use a PNG, JPG, WebP, AVIF or GIF image.", "error");
    if (file.size > MAX) return toast("Images must be 5 MB or smaller.", "error");
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", folder);
    startTransition(async () => {
      const res = await uploadImage(fd);
      toast(res.message, res.ok ? "success" : "error");
      if (res.ok && res.url) setUrl(res.url);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </label>
      <div className="flex flex-col gap-3 border border-line-strong bg-white p-3 sm:flex-row sm:items-start">
        <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden bg-paper-2 sm:w-28">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-muted">No image</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <input id={id} name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… (or upload)" className="field" />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={pending}
              className="inline-flex h-9 items-center border border-ink px-3 text-sm hover:bg-ink hover:text-white disabled:opacity-50"
            >
              {pending ? "Uploading…" : "Upload image"}
            </button>
            {url && (
              <button type="button" onClick={() => setUrl("")} className="inline-flex h-9 items-center px-2 text-sm text-muted underline underline-offset-2 hover:text-ink">
                Remove
              </button>
            )}
          </div>
          <input ref={inputRef} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
      </div>
    </div>
  );
}

/** A list of uploaded images (e.g. case study screenshots), stored as a JSON array in a hidden field. */
export function ImageListField({ name, label, defaultValue = [], folder }: { name: string; label: string; defaultValue?: string[]; folder: "case-studies" | "designs" | "misc" }) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  function onFiles(files: FileList | null) {
    if (!files?.length) return;
    startTransition(async () => {
      for (const file of Array.from(files).slice(0, 10)) {
        if (!ACCEPT.split(",").includes(file.type) || file.size > MAX) {
          toast(`${file.name}: unsupported type or over 5 MB.`, "error");
          continue;
        }
        const fd = new FormData();
        fd.set("file", file);
        fd.set("folder", folder);
        const res = await uploadImage(fd);
        if (res.ok && res.url) setUrls((u) => [...u, res.url!]);
        else toast(res.message, "error");
      }
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {urls.map((u) => (
          <div key={u} className="relative border border-line bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="aspect-[3/4] w-full object-cover object-top" />
            <button type="button" onClick={() => setUrls((list) => list.filter((x) => x !== u))} className="absolute top-1 right-1 bg-white px-1.5 text-xs">
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className="flex aspect-[3/4] items-center justify-center border border-dashed border-line-strong text-sm text-muted hover:border-ink hover:text-ink"
        >
          {pending ? "Uploading…" : "+ Add"}
        </button>
      </div>
      <input ref={inputRef} type="file" accept={ACCEPT} multiple className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => onFiles(e.target.files)} />
    </div>
  );
}
