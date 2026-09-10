import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-light d-flex flex-column min-vh-100">
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="text-center py-5">
          <i className="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
          <h2 className="display-4 fw-bold">404</h2>
          <h3 className="h4 mb-4">Page Not Found</h3>
          <p className="text-muted mb-4 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link href="/" className="btn btn-primary px-4 py-2">
            <i className="bi bi-house me-2"></i>Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
