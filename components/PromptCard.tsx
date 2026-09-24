"use client";


import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function PromptCard({ prompt }: { prompt: any }) {
  const promptUrl = `/prompt/${prompt.slug}`;
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const promptCategories = Array.isArray(prompt.category)
    ? prompt.category
    : prompt.category
    ? [prompt.category]
    : ["General"];

  const displayText = prompt.prompt.replace(/<[^>]*>?/gm, "");
  const truncatedText =
    displayText.length > 150
      ? displayText.substring(0, 150) + "..."
      : displayText;

  const imageSrc = prompt.image ? (prompt.image.startsWith("/") ? prompt.image : `/${prompt.image}`) : null;

  return (
    <div className="card prompt-card h-100 shadow-sm border position-relative">
      <Link
        href="/instructions"
        className="position-absolute top-0 start-0 m-2 text-decoration-none"
        style={{ zIndex: 10 }}
        title="Learn how to use this prompt with your photos"
      >
        <span className="badge bg-info text-white rounded-circle p-2 shadow-sm">
          <i className="bi bi-question-circle-fill"></i>
        </span>
      </Link>

      <div
        className={`card-img-container ${!imgLoaded && !imgError && imageSrc ? 'placeholder-glow' : ''}`}
        style={{
          position: "relative",
          minHeight: "200px",
          maxHeight: "280px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!imgLoaded && !imgError && imageSrc && (
          <div className="placeholder position-absolute top-0 start-0 w-100 h-100 bg-secondary opacity-25" style={{ zIndex: 1 }}></div>
        )}
        
        {imageSrc && !imgError ? (
          <Image
            src={imageSrc}
            alt={prompt.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "contain",
              transition: "transform 0.4s ease, opacity 0.5s ease",
              opacity: imgLoaded ? 1 : 0
            }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center bg-light w-100 h-100 position-absolute top-0 start-0"
            style={{ minHeight: "200px", zIndex: 1 }}
          >
            <i className="bi bi-image text-muted" style={{ fontSize: "3rem" }}></i>
          </div>
        )}

        <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 5 }}>
          {promptCategories.slice(0, 2).map((cat: string) => (
            <Link
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}`}
              className="badge bg-white text-primary shadow-sm mb-1 d-block text-decoration-none"
              style={{
                maxWidth: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <div className="card-body d-flex flex-column">
        <h3 className="h5 card-title mb-3" style={{ minHeight: "48px" }}>
          {prompt.title}
        </h3>

        <div className="prompt-text mb-3 small" style={{ minHeight: "60px" }}>
          {truncatedText}
        </div>

        {prompt.tags && prompt.tags.length > 0 && (
          <div className="mb-3" style={{ minHeight: "30px" }}>
            {prompt.tags.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="badge bg-light text-primary tag-badge me-1 mb-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted">
              <i className="bi bi-laptop me-1"></i>
              {prompt.platform || "All Platforms"}
            </small>

            <div>
              <span
                className="badge bg-primary rounded-pill views-count me-1"
                title="Views"
              >
                <i className="bi bi-eye-fill me-1"></i>
                {prompt.stats?.views || 0}
              </span>
              <span
                className="badge bg-success rounded-pill copies-count"
                title="Copies"
              >
                <i className="bi bi-clipboard-check me-1"></i>
                {prompt.stats?.copies || 0}
              </span>
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <Link
              href={promptUrl}
              className="btn btn-primary btn-sm w-100"
              title="View full prompt details"
            >
              <i className="bi bi-eye me-2"></i>View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
