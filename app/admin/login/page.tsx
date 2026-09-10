import { redirect } from "next/navigation";
import { login, getSession } from "@/lib/session";
import dbConnect from "@/lib/db";
import { Admin } from "@/lib/models";
import bcrypt from "bcryptjs";
import Link from "next/link";
import { LoginClientForm } from "./LoginClientForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin/dashboard");
  }

  async function loginAction(formData: FormData) {
    "use server";
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      return { error: "Please enter both username and password." };
    }

    await dbConnect();
    const admin = await Admin.findOne({ username }).lean();

    if (admin && admin.password) {
      // The PHP app used password_verify which is compatible with bcrypt
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        await Admin.findByIdAndUpdate(admin._id, { last_login: new Date() });
        await login(username, admin._id.toString());
        redirect("/admin/dashboard");
      }
    }
    
    // In actual implementation we return error state to client component
    // But since this is a server component handling the form, we can redirect to a route with an error query param
    // or use a client component. Let's make this page a client component wrapper.
    redirect("/admin/login?error=Invalid username or password");
  }

  return (
    <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="login-container w-100" style={{ maxWidth: "420px", padding: "15px" }}>
        <div className="login-card bg-white" style={{ borderRadius: "20px", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)", overflow: "hidden" }}>
          <div className="login-header text-white p-4 text-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <i className="bi bi-shield-lock" style={{ fontSize: "3rem", marginBottom: "1rem" }}></i>
            <h3 className="mb-0">Admin Login</h3>
            <p className="mb-0 small">AI Prompt Gallery</p>
          </div>
          <div className="login-body p-4">
            <LoginClientForm loginAction={loginAction} />
            <div className="text-center mt-4">
              <Link href="/" className="text-decoration-none small">
                <i className="bi bi-arrow-left me-1"></i>Back to Gallery
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center mt-3 text-white small">
          <i className="bi bi-shield-check me-1"></i>Secure Admin Area
        </div>
      </div>
    </div>
  );
}
