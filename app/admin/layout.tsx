import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";
import { getSession, logout } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If we're on login page, we don't need the admin nav
  // But nested layouts apply to all children. We can conditionally render the nav.
  
  return (
    <>
      {session && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link href="/admin/dashboard" className="navbar-brand">
              <i className="bi bi-shield-lock me-2"></i> Admin Panel
            </Link>
            <div className="ms-auto d-flex gap-2">
              <Link href="/" className="btn btn-outline-light btn-sm" target="_blank">
                <i className="bi bi-eye me-1"></i> View Site
              </Link>
              <form
                action={async () => {
                  "use server";
                  await logout();
                  redirect("/admin/login");
                }}
              >
                <button type="submit" className="btn btn-danger btn-sm">
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </form>
            </div>
          </div>
        </nav>
      )}
      <main className="bg-light" style={{ minHeight: "100vh" }}>
        {children}
      </main>
    </>
  );
}
