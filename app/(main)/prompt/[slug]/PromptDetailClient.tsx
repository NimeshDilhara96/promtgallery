"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PromptCard } from "@/components/PromptCard";
import AdBanner from "@/components/AdBanner";

export function PromptDetailClient({ prompt, relatedPrompts }: { prompt: any; relatedPrompts: any[] }) {
  const [copied, setCopied] = useState(false);
  const [views, setViews] = useState(prompt.stats?.views || 0);
  const [copies, setCopies] = useState(prompt.stats?.copies || 0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Track view
    const storageKey = `viewed_${prompt._id}`;
    if (!sessionStorage.getItem(storageKey)) {
      sessionStorage.setItem(storageKey, "true");
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prompt._id, type: "view" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.stats) {
            setViews(data.stats.views);
          }
        })
        .catch(console.error);
    }
  }, [prompt._id]);

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
        }
      }
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt.title,
          text: prompt.prompt.substring(0, 100),
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const categories = Array.isArray(prompt.category)
    ? prompt.category
    : prompt.category
    ? [prompt.category]
    : [];

  const imageSrc = prompt.image ? (prompt.image.startsWith("/") ? prompt.image : `/${prompt.image}`) : null;

  return (
    <>
      <section className="py-2 py-md-3 bg-white border-bottom">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item">
                <Link href="/">
                  <i className="bi bi-house-door"></i>
                  <span className="d-none d-sm-inline ms-1">Home</span>
                </Link>
              </li>
              {categories.map((cat: string) => (
                <li key={cat} className="breadcrumb-item">
                  <Link href={`/?category=${encodeURIComponent(cat)}`}>
                    {cat}
                  </Link>
                </li>
              ))}
              <li
                className="breadcrumb-item active text-truncate"
                aria-current="page"
                style={{ maxWidth: "200px" }}
              >
                {prompt.title}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="py-3 py-md-5">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-10 col-xl-9 mx-auto">
              <div
                className="prompt-detail-container mb-3 mb-md-4 bg-white"
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 2px 15px rgba(0, 0, 0, 0.08)",
                  overflow: "hidden",
                }}
              >
                {imageSrc && (
                  <div
                    className="prompt-image-container"
                    style={{
                      position: "relative",
                      width: "100%",
                      background: "#f8f9fa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      cursor: "zoom-in",
                    }}
                    onClick={() => setShowModal(true)}
                  >
                    <img
                      src={imageSrc}
                      alt={prompt.title}
                      loading="eager"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "600px",
                        display: "block",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                <div className="prompt-content p-4">
                  <div className="mb-3 mb-md-4">
                    <h1 className="h2 fw-bold mb-3">{prompt.title}</h1>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {categories.map((cat: string) => (
                        <Link
                          key={cat}
                          href={`/?category=${encodeURIComponent(cat)}`}
                          className="badge bg-primary text-decoration-none"
                        >
                          <i className="bi bi-tag-fill me-1"></i>
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mb-3 mb-md-4">
                    <div
                      className="stats-badge"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.5rem 0.75rem",
                        background: "#f8f9fa",
                        borderRadius: "50px",
                        fontSize: "0.875rem",
                      }}
                    >
                      <i className="bi bi-eye-fill text-primary"></i>
                      <span>
                        <strong>{views}</strong>
                        <span className="d-none d-sm-inline"> views</span>
                      </span>
                    </div>
                    <div
                      className="stats-badge"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.5rem 0.75rem",
                        background: "#f8f9fa",
                        borderRadius: "50px",
                        fontSize: "0.875rem",
                      }}
                    >
                      <i className="bi bi-clipboard-check text-success"></i>
                      <span>
                        <strong>{copies}</strong>
                        <span className="d-none d-sm-inline"> copies</span>
                      </span>
                    </div>
                    <div
                      className="stats-badge"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.5rem 0.75rem",
                        background: "#f8f9fa",
                        borderRadius: "50px",
                        fontSize: "0.875rem",
                      }}
                    >
                      <i className="bi bi-laptop text-info"></i>
                      <span className="d-none d-sm-inline">
                        {prompt.platform || "All Platforms"}
                      </span>
                      <span className="d-sm-none">Platform</span>
                    </div>
                  </div>

                  <div className="alert alert-info mb-3 mb-md-4">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-lightbulb-fill me-2 mt-1 fs-5"></i>
                      <div className="small">
                        <strong>How to use:</strong> Copy this prompt and upload
                        your own photo to an AI platform like Gemini,
                        Midjourney, or DALL-E.{" "}
                        <Link
                          href="/instructions"
                          className="alert-link d-block d-sm-inline mt-1 mt-sm-0"
                        >
                          Learn more →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 mb-md-4">
                    <h3 className="h6 mb-2 mb-md-3">
                      <i className="bi bi-code-square me-2"></i>Full Prompt:
                    </h3>
                    <div
                      className="prompt-text-box position-relative"
                      style={{
                        background: "#f8f9fa",
                        borderLeft: "4px solid #0d6efd",
                        padding: "1.5rem",
                        borderRadius: "8px",
                        fontFamily: "'Courier New', monospace",
                        fontSize: "0.95rem",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                      }}
                    >
                      {prompt.prompt}
                    </div>
                  </div>

                  {prompt.tags && prompt.tags.length > 0 && (
                    <div className="mb-3 mb-md-4">
                      <h3 className="h6 mb-2">
                        <i className="bi bi-tags me-2"></i>Tags:
                      </h3>
                      <div className="d-flex flex-wrap gap-2">
                        {prompt.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="badge bg-light text-dark border small"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(prompt.created_at || prompt.updated_at) && (
                    <div className="mb-3 mb-md-4 text-muted small d-none d-md-block">
                      {prompt.created_at && (
                        <span className="me-3">
                          <i className="bi bi-calendar-plus me-1"></i> Created:{" "}
                          {new Date(prompt.created_at).toLocaleDateString()}
                        </span>
                      )}
                      {prompt.updated_at && (
                        <span>
                          <i className="bi bi-calendar-check me-1"></i> Updated:{" "}
                          {new Date(prompt.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="d-none d-md-flex gap-2 flex-wrap justify-content-between align-items-center">
                    <button
                      className={`btn btn-lg px-4 px-md-5 ${
                        copied ? "btn-success" : "btn-primary"
                      }`}
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <i className="bi bi-check-lg me-2"></i> Copied!
                        </>
                      ) : (
                        <>
                          <i className="bi bi-clipboard me-2"></i> Copy Prompt
                        </>
                      )}
                    </button>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => window.print()}
                        title="Print"
                      >
                        <i className="bi bi-printer"></i>
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleShare}
                        title="Share"
                      >
                        <i className="bi bi-share"></i>
                      </button>
                      <Link
                        href="/"
                        className="btn btn-outline-secondary"
                        title="Back to Gallery"
                      >
                        <i className="bi bi-arrow-left me-1 d-none d-lg-inline"></i>
                        Back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advertisement Banner */}
              <AdBanner label="Sponsored Advertisement" className="my-4" />

              {relatedPrompts.length > 0 && (
                <div className="mt-4 mt-md-5">
                  <h2 className="h5 h4-md mb-3 mb-md-4">
                    <i className="bi bi-collection me-2"></i>Related Prompts
                  </h2>
                  <div className="row g-3 g-md-4">
                    {relatedPrompts.map((related) => (
                      <div
                        key={related._id}
                        className="col-12 col-sm-6 col-lg-4"
                      >
                        <PromptCard prompt={related} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center mt-4 mt-md-5 d-none d-md-block">
                <Link href="/" className="btn btn-outline-primary btn-lg px-5">
                  <i className="bi bi-grid-3x3-gap me-2"></i>Back to Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mobile-action-bar d-md-none position-fixed bottom-0 start-0 end-0 bg-white p-3 shadow-lg border-top" style={{ zIndex: 1000 }}>
        <div className="d-flex gap-2">
          <button
            className={`btn flex-grow-1 ${
              copied ? "btn-success" : "btn-primary"
            }`}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <i className="bi bi-check-lg me-1"></i> Copied!
              </>
            ) : (
              <>
                <i className="bi bi-clipboard me-1"></i> Copy Prompt
              </>
            )}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleShare}
          >
            <i className="bi bi-share"></i>
          </button>
          <Link href="/" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left"></i>
          </Link>
        </div>
      </div>

      {showModal && imageSrc && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-body p-0 text-center position-relative">
                <button
                  type="button"
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                  }}
                  style={{ zIndex: 10 }}
                ></button>
                <img
                  src={imageSrc}
                  className="img-fluid rounded"
                  alt="Full size"
                  style={{ maxHeight: "90vh", cursor: "zoom-out" }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
