import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, updateSession } from "@/lib/session";

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/admin") && path !== "/admin/login";

  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get("session")?.value;
    let session = null;
    
    if (sessionCookie) {
      try {
        session = await decrypt(sessionCookie);
      } catch (err) {
        session = null;
      }
    }

    if (!session) {
      // If it is a Server Action POST request, return 401 instead of redirecting
      if (request.method === "POST") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return (await updateSession(request)) || NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
