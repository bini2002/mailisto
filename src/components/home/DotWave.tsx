/**
 * Dotted "data wave" background, like a field of particles in perspective.
 * Each row is a single SVG path of zero-length round-capped segments (one element per row,
 * not one per dot), so it stays light. Rendered on the server; the only motion is a slow CSS drift.
 */
const ROWS = 18;
const COLS = 84;
const W = 1600;

function rowPath(j: number) {
  const d = j / (ROWS - 1); // 0 = far, 1 = near
  const parts: string[] = [];
  for (let i = 0; i <= COLS; i++) {
    const x = (i / COLS) * W;
    const y =
      150 +
      j * (10 + d * 9) +
      Math.sin(x * 0.0055 + j * 0.3) * (22 + 46 * d) +
      Math.sin(x * 0.0019 - j * 0.42) * 28;
    parts.push(`M${Math.round(x)} ${Math.round(y)}h0`);
  }
  return { d: parts.join(""), width: 1.4 + d * 2.4, opacity: 0.08 + d * 0.32 };
}

const rows = Array.from({ length: ROWS }, (_, j) => rowPath(j));

export function DotWave({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <svg viewBox={`0 0 ${W} 600`} preserveAspectRatio="xMidYMid slice" className="dot-wave h-full w-full">
        {rows.map((r, j) => (
          <path key={j} d={r.d} stroke="#ffffff" strokeOpacity={r.opacity} strokeWidth={r.width} strokeLinecap="round" fill="none" />
        ))}
      </svg>
    </div>
  );
}
