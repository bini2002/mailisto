import type { CSSProperties } from "react";
import type { Block, EmailConcept, Palette } from "@/content/email-concepts";
import { EmailArt } from "./EmailArt";

/** 1 "email pixel" at a 600px design width, scaled to whatever width the preview is rendered at. */
const u = (n: number) => `calc(var(--u) * ${n})`;

const SANS = "var(--font-poppins), system-ui, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

/**
 * Resolution-independent email preview. Scales like an image (via container query units),
 * so it stays crisp in a card, a modal or on a phone, and is never distorted.
 */
export function EmailMock({ concept, crop }: { concept: EmailConcept; crop?: boolean | number }) {
  const ratio = typeof crop === "number" ? crop : crop ? 1.28 : null;
  const p = concept.palette;
  const display = concept.serif ? SERIF : SANS;
  return (
    <div style={{ containerType: "inline-size", width: "100%" }}>
      <div
        style={
          {
            "--u": "calc(100cqw / 600)",
            background: p.canvas,
            color: p.ink,
            fontFamily: SANS,
            lineHeight: 1.45,
            overflow: "hidden",
            maxHeight: ratio ? `calc(100cqw * ${ratio})` : undefined,
          } as CSSProperties
        }
      >
        {concept.blocks.map((block, i) => (
          <BlockView key={i} block={block} p={p} display={display} />
        ))}
      </div>
    </div>
  );
}

function Button({ label, p }: { label: string; p: Palette }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: p.accent,
        color: p.accentInk,
        padding: `${u(16)} ${u(34)}`,
        fontSize: u(15),
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
  );
}

function Eyebrow({ children, p }: { children: string; p: Palette }) {
  return (
    <div style={{ fontSize: u(12), letterSpacing: "0.16em", textTransform: "uppercase", color: p.muted, fontWeight: 500, marginBottom: u(12) }}>
      {children}
    </div>
  );
}

function BlockView({ block, p, display }: { block: Block; p: Palette; display: string }) {
  const pad = u(48);
  switch (block.type) {
    case "announce":
      return (
        <div style={{ background: p.accent, color: p.accentInk, textAlign: "center", fontSize: u(12), letterSpacing: "0.12em", textTransform: "uppercase", padding: `${u(12)} ${pad}`, fontWeight: 600 }}>
          {block.text}
        </div>
      );
    case "header":
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: block.links ? "space-between" : "center", padding: `${u(28)} ${pad}`, borderBottom: `1px solid ${p.line}` }}>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: u(22), letterSpacing: block.logo === block.logo.toUpperCase() ? "0.22em" : "0.02em" }}>{block.logo}</span>
          {block.links && (
            <span style={{ display: "flex", gap: u(20), fontSize: u(13), color: p.muted }}>
              {block.links.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
          )}
        </div>
      );
    case "hero": {
      if (block.variant === "type") {
        return (
          <div>
            <div style={{ padding: `${u(56)} ${pad} ${u(36)}` }}>
              {block.eyebrow && <Eyebrow p={p}>{block.eyebrow}</Eyebrow>}
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: u(58), lineHeight: 1.02, letterSpacing: "-0.02em" }}>{block.headline}</div>
            </div>
            <EmailArt art={block.art} palette={p} />
            {block.cta && (
              <div style={{ padding: `${u(36)} ${pad}`, textAlign: "center" }}>
                <Button label={block.cta} p={p} />
              </div>
            )}
          </div>
        );
      }
      if (block.variant === "split") {
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", borderBottom: `1px solid ${p.line}` }}>
            <EmailArt art={block.art} palette={p} tall />
            <div style={{ padding: `${u(28)} ${u(36)}` }}>
              {block.eyebrow && <Eyebrow p={p}>{block.eyebrow}</Eyebrow>}
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: u(32), lineHeight: 1.1, letterSpacing: "-0.01em" }}>{block.headline}</div>
              {block.body && <p style={{ fontSize: u(14), color: p.muted, margin: `${u(14)} 0 0` }}>{block.body}</p>}
              {block.cta && (
                <div style={{ marginTop: u(24) }}>
                  <Button label={block.cta} p={p} />
                </div>
              )}
            </div>
          </div>
        );
      }
      return (
        <div>
          <EmailArt art={block.art} palette={p} />
          <div style={{ padding: `${u(44)} ${pad} ${u(20)}`, textAlign: "center" }}>
            {block.eyebrow && <Eyebrow p={p}>{block.eyebrow}</Eyebrow>}
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: u(38), lineHeight: 1.1, letterSpacing: "-0.01em" }}>{block.headline}</div>
            {block.body && <p style={{ fontSize: u(16), color: p.muted, margin: `${u(16)} auto 0`, maxWidth: u(420) }}>{block.body}</p>}
            {block.cta && (
              <div style={{ marginTop: u(28) }}>
                <Button label={block.cta} p={p} />
              </div>
            )}
          </div>
        </div>
      );
    }
    case "text":
      return (
        <div style={{ padding: `${u(44)} ${pad} ${u(20)}`, textAlign: block.align ?? "center" }}>
          {block.eyebrow && <Eyebrow p={p}>{block.eyebrow}</Eyebrow>}
          {block.heading && <div style={{ fontFamily: display, fontWeight: 700, fontSize: u(34), lineHeight: 1.12, letterSpacing: "-0.01em" }}>{block.heading}</div>}
          <p style={{ fontSize: u(16), color: p.muted, margin: `${u(14)} ${block.align === "left" ? 0 : "auto"} 0`, maxWidth: u(460) }}>{block.body}</p>
        </div>
      );
    case "cta":
      return (
        <div style={{ padding: `${u(28)} ${pad} ${u(40)}`, textAlign: "center" }}>
          <Button label={block.label} p={p} />
          {block.note && <div style={{ fontSize: u(12), color: p.muted, marginTop: u(14) }}>{block.note}</div>}
        </div>
      );
    case "products":
      return (
        <div style={{ padding: `${u(28)} ${pad}` }}>
          {block.heading && (
            <div style={{ fontSize: u(13), letterSpacing: "0.14em", textTransform: "uppercase", color: p.muted, marginBottom: u(18), textAlign: "center" }}>
              {block.heading}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: u(18) }}>
            {block.items.map((item) => (
              <div key={item.name}>
                <EmailArt art={item.art} palette={p} />
                <div style={{ fontSize: u(15), fontWeight: 600, marginTop: u(12) }}>{item.name}</div>
                <div style={{ fontSize: u(13), color: p.muted }}>{item.meta}</div>
              </div>
            ))}
          </div>
        </div>
      );
    case "cart":
      return (
        <div style={{ padding: `${u(16)} ${pad}` }}>
          {block.items.map((item) => (
            <div key={item.name} style={{ display: "grid", gridTemplateColumns: `${u(200)} 1fr`, gap: u(24), alignItems: "center", border: `1px solid ${p.line}`, padding: u(16) }}>
              <EmailArt art={item.art} palette={p} />
              <div>
                <div style={{ fontSize: u(18), fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: u(14), color: p.muted, marginTop: u(4) }}>{item.meta}</div>
                <div style={{ fontSize: u(18), fontWeight: 600, marginTop: u(16) }}>{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      );
    case "steps":
      return (
        <div style={{ padding: `${u(28)} ${pad}` }}>
          {block.heading && <div style={{ fontFamily: display, fontWeight: 700, fontSize: u(22), marginBottom: u(18), textAlign: "center" }}>{block.heading}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: u(18) }}>
            {block.items.map((s, i) => (
              <div key={s.title} style={{ borderTop: `2px solid ${p.ink}`, paddingTop: u(14) }}>
                <div style={{ fontSize: u(12), color: p.muted, fontWeight: 600 }}>0{i + 1}</div>
                <div style={{ fontSize: u(15), fontWeight: 600, marginTop: u(6) }}>{s.title}</div>
                <div style={{ fontSize: u(13), color: p.muted, marginTop: u(6) }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      );
    case "code":
      return (
        <div style={{ padding: `${u(20)} ${pad}` }}>
          <div style={{ border: `1px dashed ${p.muted}`, padding: `${u(22)} ${u(24)}`, textAlign: "center" }}>
            <div style={{ fontSize: u(14), color: p.muted }}>{block.label}</div>
            <div style={{ fontSize: u(26), fontWeight: 700, letterSpacing: "0.16em", marginTop: u(6) }}>{block.code}</div>
            {block.note && <div style={{ fontSize: u(12), color: p.muted, marginTop: u(6) }}>{block.note}</div>}
          </div>
        </div>
      );
    case "benefits":
      return (
        <div style={{ padding: `${u(8)} ${pad} ${u(32)}`, display: "grid", gridTemplateColumns: `repeat(${block.items.length}, 1fr)`, gap: u(12) }}>
          {block.items.map((b) => (
            <div key={b} style={{ fontSize: u(13), textAlign: "center", borderTop: `1px solid ${p.line}`, paddingTop: u(14), color: p.muted }}>
              {b}
            </div>
          ))}
        </div>
      );
    case "footer":
      return (
        <div style={{ borderTop: `1px solid ${p.line}`, padding: `${u(28)} ${pad}`, textAlign: "center", fontSize: u(12), color: p.muted }}>
          <div>{block.brand}</div>
          <div style={{ marginTop: u(6), textDecoration: "underline" }}>Manage preferences · Unsubscribe</div>
        </div>
      );
  }
}
