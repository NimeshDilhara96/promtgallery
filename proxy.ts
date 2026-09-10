import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession, getSession } from "@/lib/session";

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/admin") && path !== "/admin/login";

  if (isProtectedRoute) {
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return await updateSession(request) || NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
