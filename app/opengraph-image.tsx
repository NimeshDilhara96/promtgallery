import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "AI Prompt Gallery - Curated AI Art Prompts";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "linear-gradient(135deg, #0b0f19 0%, #171e31 50%, #0d1a3a 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(13, 110, 253, 0.4) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(13, 202, 240, 0.3) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        />

        {/* Brand Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
              }}
            >
              ✨
            </div>
            <span
              style={{
                fontSize: "32px",
                fontWeight: "900",
                letterSpacing: "-0.5px",
                background: "linear-gradient(90deg, #ffffff, #dbeafe)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              AI Prompt Gallery
            </span>
          </div>

          <div
            style={{
              backgroundColor: "rgba(13, 110, 253, 0.25)",
              border: "1px solid rgba(13, 110, 253, 0.5)",
              color: "#93c5fd",
              padding: "10px 22px",
              borderRadius: "50px",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            🔥 100% Free Forever
          </div>
        </div>

        {/* Center Main Message */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", zIndex: 10 }}>
          <h1
            style={{
              fontSize: "58px",
              fontWeight: "900",
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
              margin: 0,
              background: "linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)",
              backgroundClip: "text",
              color: "transparent",
              maxWidth: "1000px",
            }}
          >
            Create Stunning <span style={{ color: "#38bdf8", WebkitTextFillColor: "#38bdf8" }}>AI Art</span> with Curated Prompts
          </h1>

          <p
            style={{
              fontSize: "24px",
              lineHeight: 1.4,
              color: "#94a3b8",
              margin: 0,
              maxWidth: "950px",
            }}
          >
            Copy, customize, and generate professional AI images with tested prompts for Midjourney, DALL-E 3, and Stable Diffusion.
          </p>
        </div>

        {/* Features / Platforms pill tags footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "24px",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            {["Midjourney", "DALL-E 3", "Stable Diffusion", "Leonardo AI"].map((tool) => (
              <span
                key={tool}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#e2e8f0",
                  padding: "6px 16px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {tool}
              </span>
            ))}
          </div>

          <span
            style={{
              fontSize: "22px",
              color: "#38bdf8",
              fontWeight: "800",
            }}
          >
            aipromptgallery.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
