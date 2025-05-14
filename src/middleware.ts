import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const authCookie = req.cookies.get("auth_session");

  if (!authCookie?.value) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/api/auth/github";
    redirectUrl.search = `?redirectTo=${encodeURIComponent(req.nextUrl.pathname)}`;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/app/:path*",
};
