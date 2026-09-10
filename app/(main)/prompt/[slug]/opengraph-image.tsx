import { ImageResponse } from "next/og";
import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";

export const runtime = "nodejs";
export const alt = "AI Prompt Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();

  const prompt = await Prompt.findOne({ slug }).lean();

  const title = prompt?.title || "AI Prompt Details";
  const promptText = prompt?.prompt
    ? prompt.prompt.length > 180
      ? prompt.prompt.substring(0, 180) + "..."
      : prompt.prompt
    : "Explore curated high-quality prompts for Midjourney, DALL-E 3, and Stable Diffusion.";
  const category = Array.isArray(prompt?.category)
    ? prompt.category[0]
    : prompt?.category || "AI Art";
  const platform = prompt?.platform || "All AI Platforms";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #0b0f19 0%, #171e31 50%, #0d1a3a 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle decorative glow circles */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(13, 110, 253, 0.35) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(13, 202, 240, 0.25) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        />

        {/* Header Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              ✨
            </div>
            <span
              style={{
                fontSize: "26px",
                fontWeight: "800",
                letterSpacing: "-0.5px",
                background: "linear-gradient(90deg, #ffffff, #dbeafe)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              AI Prompt Gallery
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <span
              style={{
                backgroundColor: "rgba(13, 110, 253, 0.25)",
                border: "1px solid rgba(13, 110, 253, 0.5)",
                color: "#60a5fa",
                padding: "8px 18px",
                borderRadius: "50px",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              🏷️ {category}
            </span>
            <span
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#93c5fd",
                padding: "8px 18px",
                borderRadius: "50px",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              ⚡ {platform}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", zIndex: 10 }}>
          <h1
            style={{
              fontSize: "52px",
              fontWeight: "900",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              margin: 0,
              color: "#ffffff",
              maxWidth: "1050px",
            }}
          >
            {title}
          </h1>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderLeft: "5px solid #0d6efd",
              padding: "20px 24px",
              borderRadius: "12px",
              fontSize: "22px",
              lineHeight: 1.4,
              color: "#cbd5e1",
              maxWidth: "1050px",
              fontFamily: "monospace",
            }}
          >
            "{promptText}"
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "20px",
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: "18px", color: "#94a3b8", fontWeight: "500" }}>
            Free for Midjourney, DALL-E 3 & Stable Diffusion
          </span>
          <span
            style={{
              fontSize: "20px",
              color: "#38bdf8",
              fontWeight: "700",
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
