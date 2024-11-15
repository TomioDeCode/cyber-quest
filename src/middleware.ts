import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type UserRole = "admin" | "user";

interface AuthConfig {
  adminPaths: string[];
  userPaths: string[];
  publicPaths: string[];
  authPaths: string[];
  loginPath: string;
  adminDashboard: string;
  userDashboard: string;
  unauthorizedPath: string;
}

const authConfig: AuthConfig = {
  adminPaths: ["/admin", "/dashboard/admin"],
  userPaths: ["/dashboard", "/profile"],
  publicPaths: ["/", "/api/auth"],
  authPaths: ["/login", "/register"],
  loginPath: "/login",
  adminDashboard: "/admin/dashboard",
  userDashboard: "/dashboard",
  unauthorizedPath: "/unauthorized",
};

/**
 * Helper function untuk mengecek apakah path dimulai dengan salah satu dari paths yang diberikan
 */

function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some((path) => pathname.startsWith(path));
}

/**
 * Helper function untuk membuat URL redirect
 */

function createRedirectUrl(
  path: string,
  baseUrl: string,
  callbackUrl?: string
): URL {
  const url = new URL(path, baseUrl);
  if (callbackUrl) {
    url.searchParams.set("callbackUrl", callbackUrl);
  }
  return url;
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (matchesPath(pathname, authConfig.authPaths) && token) {
      if (token.role === "admin") {
        return NextResponse.redirect(
          new URL(authConfig.adminDashboard, request.url)
        );
      }
      return NextResponse.redirect(
        new URL(authConfig.userDashboard, request.url)
      );
    }

    if (
      matchesPath(pathname, [
        ...authConfig.publicPaths,
        ...authConfig.authPaths,
      ])
    ) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(
        createRedirectUrl(authConfig.loginPath, request.url, pathname)
      );
    }

    const userRole = token.role as UserRole;

    if (matchesPath(pathname, authConfig.adminPaths)) {
      if (userRole !== "admin") {
        return NextResponse.redirect(
          createRedirectUrl(authConfig.unauthorizedPath, request.url)
        );
      }
    }

    if (matchesPath(pathname, authConfig.userPaths)) {
      if (!["user", "admin"].includes(userRole)) {
        return NextResponse.redirect(
          createRedirectUrl(authConfig.unauthorizedPath, request.url)
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(
      createRedirectUrl(authConfig.loginPath, request.url)
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match semua request paths kecuali:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. public folder
     * 5. api routes yang tidak memerlukan auth
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/public).*)",
  ],
};
