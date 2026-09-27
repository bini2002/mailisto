import type { ArtKey, Palette } from "@/content/email-concepts";

/**
 * Flat, still-life style product art for coded email concepts.
 * Deliberately simple: it reads as "product photography placeholder" without pretending to be a real product.
 */
export function EmailArt({ art, palette, alt = "", tall = false }: { art: ArtKey; palette: Palette; alt?: string; tall?: boolean }) {
  const h = tall ? 400 : 300;
  const floor = h - 70;
  return (
    <svg
      viewBox={`0 0 400 ${h}`}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      style={{ display: "block", width: "100%", height: "auto", background: palette.panel }}
    >
      <rect x="0" y={floor} width="400" height={h - floor} fill={palette.panel2} />
      <ellipse cx="200" cy={floor + 2} rx="92" ry="9" fill={palette.ink} opacity="0.12" />
      <g transform={`translate(0 ${floor - 230})`}>{shape(art, palette)}</g>
    </svg>
  );
}

function shape(art: ArtKey, p: Palette) {
  const o = p.object;
  const hi = p.canvas;
  switch (art) {
    case "bag":
      return (
        <g>
          <path d="M140 60 L260 60 L272 230 L128 230 Z" fill={o} />
          <path d="M140 60 L260 60 L256 36 L144 36 Z" fill={o} opacity="0.8" />
          <rect x="160" y="120" width="80" height="52" fill={hi} />
          <rect x="172" y="134" width="56" height="5" fill={o} />
          <rect x="180" y="148" width="40" height="4" fill={o} opacity="0.6" />
        </g>
      );
    case "cup":
      return (
        <g>
          <ellipse cx="200" cy="226" rx="96" ry="10" fill={o} opacity="0.5" />
          <path d="M136 120 L264 120 L252 212 Q248 222 236 222 L164 222 Q152 222 148 212 Z" fill={o} />
          <path d="M262 140 Q300 140 296 170 Q292 196 256 196" fill="none" stroke={o} strokeWidth="12" />
          <ellipse cx="200" cy="120" rx="64" ry="9" fill={hi} opacity="0.35" />
        </g>
      );
    case "sneaker":
      return (
        <g>
          <path d="M92 196 Q96 150 132 146 L182 140 Q204 118 232 124 L262 150 Q300 162 312 184 L316 206 L92 206 Z" fill={o} />
          <rect x="88" y="204" width="232" height="18" rx="6" fill={hi} />
          <path d="M190 148 L214 170 M206 142 L230 164" stroke={hi} strokeWidth="5" opacity="0.7" />
        </g>
      );
    case "jacket":
      return (
        <g>
          <path d="M150 40 L250 40 L300 70 L322 200 L290 206 L276 110 L276 230 L124 230 L124 110 L110 206 L78 200 L100 70 Z" fill={o} />
          <path d="M200 52 L200 230" stroke={p.canvas} strokeWidth="3" opacity="0.5" />
          <path d="M170 40 L200 72 L230 40" fill="none" stroke={p.canvas} strokeWidth="4" opacity="0.5" />
        </g>
      );
    case "vase":
      return (
        <g>
          <path d="M178 30 L222 30 L220 60 Q270 100 262 170 Q256 224 214 230 L186 230 Q144 224 138 170 Q130 100 180 60 Z" fill={o} />
          <ellipse cx="200" cy="30" rx="22" ry="5" fill={p.ink} opacity="0.25" />
        </g>
      );
    case "bowl":
      return (
        <g>
          <path d="M104 150 L296 150 Q292 222 214 230 L186 230 Q108 222 104 150 Z" fill={o} />
          <ellipse cx="200" cy="150" rx="96" ry="12" fill={p.ink} opacity="0.2" />
        </g>
      );
    case "bottle":
      return (
        <g>
          <rect x="160" y="100" width="80" height="130" rx="10" fill={o} />
          <rect x="182" y="72" width="36" height="30" fill={p.ink} opacity="0.75" />
          <rect x="190" y="30" width="20" height="44" rx="10" fill={p.ink} opacity="0.75" />
          <rect x="174" y="140" width="52" height="40" fill={hi} opacity="0.85" />
        </g>
      );
    case "tube":
      return (
        <g>
          <path d="M162 60 L238 60 L228 208 L172 208 Z" fill={o} />
          <rect x="176" y="206" width="48" height="24" rx="4" fill={p.ink} opacity="0.75" />
          <rect x="160" y="52" width="80" height="10" fill={o} opacity="0.7" />
          <rect x="180" y="110" width="40" height="46" fill={hi} opacity="0.85" />
        </g>
      );
    case "tee":
      return (
        <g>
          <path d="M160 40 Q200 62 240 40 L310 72 L290 124 L262 112 L262 230 L138 230 L138 112 L110 124 L90 72 Z" fill={o} />
          <path d="M170 44 Q200 70 230 44" fill="none" stroke={p.canvas} strokeWidth="4" opacity="0.5" />
        </g>
      );
    case "jar":
      return (
        <g>
          <rect x="140" y="130" width="120" height="100" rx="14" fill={o} />
          <rect x="146" y="104" width="108" height="30" rx="6" fill={p.ink} opacity="0.75" />
          <rect x="170" y="160" width="60" height="36" fill={hi} opacity="0.85" />
        </g>
      );
  }
}
