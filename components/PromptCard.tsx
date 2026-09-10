"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function PromptCard({ prompt }: { prompt: any }) {
  const [copied, setCopied] = useState(false);
  const [copies, setCopies] = useState(prompt.stats?.copies || 0);
  const [views, setViews] = useState(prompt.stats?.views || 0);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      const storageKey = `prompt_copy_${prompt._id}`;
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, Date.now().toString());
        const res = await fetch(`/api/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: prompt._id, type: "copy" }),
        });
        const data = await res.json();
        if (data.success && data.stats) {
          setCopies(data.stats.copies);
          setViews(data.stats.views);
        }
      }
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const promptUrl = `/prompt/${prompt.slug}`;

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
        <span className="badge bg-info text-white rounded-circle p-2">
          <i className="bi bi-question-circle-fill"></i>
        </span>
      </Link>

      <div
        className="card-img-container"
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
        {imageSrc ? (
          <img
            src={imageSrc}
            className="card-img-top w-100"
            alt={prompt.title}
            loading="lazy"
            style={{
              maxHeight: "280px",
              objectFit: "contain",
              transition: "transform 0.4s ease",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.innerHTML +=
                "<div class='d-flex align-items-center justify-content-center bg-light w-100' style='min-height: 200px;'><i class='bi bi-image text-muted' style='font-size: 3rem;'></i></div>";
            }}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center bg-light w-100"
            style={{ minHeight: "200px" }}
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
                {views}
              </span>
              <span
                className="badge bg-success rounded-pill copies-count"
                title="Copies"
              >
                <i className="bi bi-clipboard-check me-1"></i>
                {copies}
              </span>
            </div>
          </div>

          <div className="d-grid gap-2">
            <button
              className={`btn btn-sm ${copied ? "btn-success" : "btn-primary"}`}
              onClick={handleCopy}
              title="Copy prompt to clipboard"
            >
              {copied ? (
                <>
                  <i className="bi bi-check-lg me-2"></i>Copied!
                </>
              ) : (
                <>
                  <i className="bi bi-clipboard me-2"></i>Copy Prompt
                </>
              )}
            </button>
            <Link
              href={promptUrl}
              className="btn btn-outline-primary btn-sm w-100"
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
