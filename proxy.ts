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
      if (request.method === "POST") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Fix Cloudflare proxy CSRF: ensure x-forwarded-host matches the Origin
  const requestHeaders = new Headers(request.headers);
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      requestHeaders.set("x-forwarded-host", originHost);
    } catch {}
  }

  const sessionResponse = await updateSession(request);
  if (sessionResponse) {
    return sessionResponse;
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
