"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-light d-flex flex-column min-vh-100">
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="text-center py-5">
          <i className="bi bi-x-circle display-1 text-danger mb-3"></i>
          <h2 className="h3 mb-3">Something went wrong!</h2>
          <p className="text-muted mb-4 max-w-md mx-auto">
            We encountered an unexpected error while trying to process your request.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <button onClick={() => reset()} className="btn btn-primary px-4 py-2">
              <i className="bi bi-arrow-clockwise me-2"></i>Try Again
            </button>
            <Link href="/" className="btn btn-outline-secondary px-4 py-2">
              <i className="bi bi-house me-2"></i>Go Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
