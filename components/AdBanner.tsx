"use client";

import { useEffect, useState } from "react";

interface AdBannerProps {
  label?: string;
  className?: string;
}

export default function AdBanner({
  label = "Advertisement",
  className = "",
}: AdBannerProps) {
  // Use state to only render iframe on client side to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const adScript = `
    <html>
      <head>
        <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100%; background: transparent; }</style>
      </head>
      <body>
        <script>
          atOptions = {
            'key' : 'd4bb0cc5c9b409a0861935ac8f24f04a',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script src="https://www.highrevenueformat.com/d4bb0cc5c9b409a0861935ac8f24f04a/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`ad-container my-4 text-center ${className}`}>
      {label && <span className="ad-label text-uppercase text-muted d-block small mb-1">{label}</span>}
      <div 
        className="ad-slot bg-light d-flex align-items-center justify-content-center border rounded-3 mx-auto"
        style={{ minHeight: "250px", width: "100%", maxWidth: "320px", overflow: "hidden" }}
      >
        {mounted ? (
          <iframe
            srcDoc={adScript}
            width="300"
            height="250"
            frameBorder="0"
            scrolling="no"
            style={{ display: "block", margin: "0 auto" }}
            title="Adsterra Banner"
          ></iframe>
        ) : (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading ad...</span>
          </div>
        )}
      </div>
    </div>
  );
}
