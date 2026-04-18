import { AUTH_COOKIE_NAME, PASSWORD_TYPE_COOKIE } from "@/lib/app-config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const passwordType = request.cookies.get(PASSWORD_TYPE_COOKIE)?.value;

  const currentPath = request.nextUrl.pathname;
  const isLoginPage = currentPath === "/login";
  const isChangePasswordPage = currentPath === "/change-password";

  if (!token) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (passwordType === "admin_created") {
    if (!isChangePasswordPage) {
      return NextResponse.redirect(new URL("/change-password", request.url));
    }
    return NextResponse.next();
  }

  if (passwordType === "user_created" && isChangePasswordPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg).*)",
  ],
};
