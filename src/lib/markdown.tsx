import type { ReactNode } from "react";
import { slugify, safeUrl } from "./utils";

/**
 * Minimal, dependency-free Markdown renderer for CMS articles.
 * Produces React elements only (no dangerouslySetInnerHTML), so stored content cannot inject HTML or scripts.
 *
 * Supported: ## / ### / #### headings, paragraphs, - / * lists, 1. lists, > quotes,
 * ``` code blocks, ---, ![alt](url) images, **bold**, *italic*, `code`, [links](url).
 */
export function Markdown({ source }: { source: string }) {
  return <>{parseBlocks(source)}</>;
}

/** Extract ## headings for a table of contents. */
export function extractHeadings(source: string) {
  return source
    .split("\n")
    .filter((l) => /^##\s+/.test(l))
    .map((l) => {
      const text = l.replace(/^##\s+/, "").trim();
      return { text: stripInline(text), id: slugify(stripInline(text)) };
    });
}

function stripInline(s: string) {
  return s.replace(/\*\*|__|`|\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function parseBlocks(src: string): ReactNode[] {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      out.push(
        <pre key={key++}>
          <code>{buf.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = slugify(stripInline(text));
      const children = inline(text);
      out.push(
        level === 2 ? (
          <h2 key={key++} id={id}>{children}</h2>
        ) : level === 3 ? (
          <h3 key={key++} id={id}>{children}</h3>
        ) : (
          <h4 key={key++} id={id}>{children}</h4>
        ),
      );
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      out.push(<hr key={key++} />);
      i++;
      continue;
    }

    const img = /^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/.exec(line.trim());
    if (img) {
      const src = safeUrl(img[2]);
      if (src) {
        out.push(
          <figure key={key++}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={img[1]} loading="lazy" decoding="async" />
            {img[1] && <figcaption>{img[1]}</figcaption>}
          </figure>,
        );
      }
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(<blockquote key={key++}>{parseBlocks(buf.join("\n"))}</blockquote>);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^[-*]\s+/, ""));
      out.push(
        <ul key={key++}>
          {items.map((it, n) => (
            <li key={n}>{inline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\d+\.\s+/, ""));
      out.push(
        <ol key={key++}>
          {items.map((it, n) => (
            <li key={n}>{inline(it)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{2,4}\s|```|>\s?|[-*]\s+|\d+\.\s+|!\[)/.test(lines[i]) &&
      !/^(-{3,}|\*{3,})$/.test(lines[i].trim())
    ) {
      buf.push(lines[i++]);
    }
    out.push(<p key={key++}>{inline(buf.join(" "))}</p>);
  }
  return out;
}

const INLINE = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*|_[^_\s][^_]*_)/g;

function inline(text: string): ReactNode[] {
  const parts = text.split(INLINE).filter((p) => p !== "");
  return parts.map((part, n) => {
    if (/^(\*\*|__).+(\*\*|__)$/.test(part)) return <strong key={n}>{inline(part.slice(2, -2))}</strong>;
    if (/^`.+`$/.test(part)) return <code key={n}>{part.slice(1, -1)}</code>;
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const href = safeUrl(link[2]);
      if (!href) return link[1];
      const external = /^https?:/.test(href);
      return (
        <a key={n} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {inline(link[1])}
        </a>
      );
    }
    if (/^(\*|_).+(\*|_)$/.test(part)) return <em key={n}>{inline(part.slice(1, -1))}</em>;
    return part;
  });
}
