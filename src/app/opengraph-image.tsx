import { ImageResponse } from "next/og";

export const alt = "Mailisto: email and SMS marketing for Shopify brands";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000", color: "#fff", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, background: "#B8FA3C", display: "flex" }} />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1.5 }}>mailisto</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3, maxWidth: 1000 }}>Your email list should be making you more money.</div>
          <div style={{ display: "flex", marginTop: 36, fontSize: 26, color: "#A4A49D", gap: 18 }}>
            <span style={{ color: "#B8FA3C" }}>Email & SMS agency</span>
            <span>·</span>
            <span>For Shopify brands</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
