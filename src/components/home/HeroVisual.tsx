import { conceptsByKey } from "@/content/email-concepts";
import { EmailMock } from "../email/EmailMock";

const notes = [
  { n: 1, text: "Subject line and preview text written as a pair." },
  { n: 2, text: "Product first. The offer can wait." },
  { n: 3, text: "Lead with what makes the brand different, not the discount." },
];

function Marker({ n, className }: { n: number; className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-10 flex size-7 items-center justify-center rounded-full bg-lime text-xs font-semibold text-ink ring-4 ring-paper ${className}`}
    >
      {n}
    </span>
  );
}

/** An annotated welcome email: shows how Mailisto thinks, without claiming any results. */
export function HeroVisual() {
  const concept = conceptsByKey["halden-welcome"];
  return (
    <figure className="relative mx-auto max-w-[27rem] lg:mx-0 lg:max-w-none">
      <div className="label mb-3 flex items-center justify-between text-muted">
        <span>Flow · Welcome · Email 1 of 4</span>
        <span className="hidden sm:inline">Trigger: Added to list</span>
      </div>

      <div className="relative border border-ink bg-white">
        {/* Inbox row */}
        <div className="relative border-b border-line px-4 py-3.5">
          <Marker n={1} className="-left-3.5 top-3" />
          <div className="flex items-baseline justify-between gap-3 text-[0.8rem]">
            <span className="font-semibold">Halden Coffee</span>
            <span className="text-muted">9:41</span>
          </div>
          <p className="truncate text-[0.85rem] font-medium">{concept.subject}</p>
          <p className="truncate text-[0.8rem] text-muted">{concept.preheader}</p>
        </div>

        <div className="relative">
          <Marker n={2} className="-left-3.5 top-[30%]" />
          <Marker n={3} className="-right-3.5 top-[78%]" />
          <EmailMock concept={concept} crop={1.3} />
        </div>
      </div>

      <figcaption className="mt-5 border-t border-line pt-4">
        <span className="label text-muted">Design Lab concept · fictional brand</span>
        <ol className="mt-3 space-y-2 text-sm">
          {notes.map((note) => (
            <li key={note.n} className="flex gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-[0.65rem] font-semibold text-white">{note.n}</span>
              <span className="text-ink/80">{note.text}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
