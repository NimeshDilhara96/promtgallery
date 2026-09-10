"use client";

import { useSearchParams } from "next/navigation";

export function LoginClientForm({ loginAction }: { loginAction: (formData: FormData) => void }) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <form action={loginAction}>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="username" className="form-label fw-bold">
          <i className="bi bi-person-circle me-2"></i>Username
        </label>
        <div className="input-group">
          <span className="input-group-text bg-transparent border-end-0">
            <i className="bi bi-person"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            id="username"
            name="username"
            placeholder="Enter username"
            required
            autoFocus
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="form-label fw-bold">
          <i className="bi bi-key-fill me-2"></i>Password
        </label>
        <div className="input-group">
          <span className="input-group-text bg-transparent border-end-0">
            <i className="bi bi-lock"></i>
          </span>
          <input
            type="password"
            className="form-control border-start-0"
            id="password"
            name="password"
            placeholder="Enter password"
            required
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary w-100 p-2 text-white fw-bold" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none" }}>
        <i className="bi bi-box-arrow-in-right me-2"></i>Login
      </button>
    </form>
  );
}
