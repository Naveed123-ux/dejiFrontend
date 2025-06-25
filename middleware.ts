import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  console.log(token);
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // Redirect authenticated users away from login page
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", // protect dashboard subroutes
    "/dashboard", // protect /dashboard root
    "/login", // include login for redirect if already logged in
    "/",
  ],
};
