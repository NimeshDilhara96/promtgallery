"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slotId?: string;
  adClient?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  label?: string;
}

export default function AdBanner({
  slotId,
  adClient,
  format = "auto",
  responsive = true,
  className = "",
  label = "Advertisement",
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Trigger Google Ads push if adsbygoogle is available
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.debug("Ad push error or Adblock active:", err);
    }
  }, []);

  return (
    <div className={`ad-container my-4 text-center ${className}`}>
      {label && <span className="ad-label text-uppercase text-muted d-block small mb-1">{label}</span>}
      <div 
        ref={adRef} 
        className="ad-slot bg-light d-flex align-items-center justify-content-center border rounded-3 p-2 mx-auto"
        style={{ minHeight: "90px", maxWidth: "100%", overflow: "hidden" }}
      >
        {slotId && adClient ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client={adClient}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive={responsive ? "true" : "false"}
          />
        ) : (
          <div className="text-muted small py-3">
            <i className="bi bi-badge-ad me-1 fs-5 align-middle"></i>
            <span className="align-middle">Ad Space Ready</span>
          </div>
        )}
      </div>
    </div>
  );
}
