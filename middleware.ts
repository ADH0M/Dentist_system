import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/utils/jwt";

export async function middleware(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");   
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user =await verifyToken(token);
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/assistant")) {
    if (!["admin", "dentist", "assistant"].includes(user.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/receptionist")) {
    if (user.role !== "receptionist") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/patient") || pathname.startsWith("/user")) {
    if (user.role === "patient") {
      if (!pathname.includes(`/${user.userId}/`) && !pathname.includes(`/${user.patientId}/`)) {
        return NextResponse.redirect(new URL(`/patient/${user.patientId}`, request.url));
      }
    } else if (!["admin", "dentist", "assistant", "receptionist"].includes(user.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/assistant/:path*",
    "/receptionist/:path*",
    "/patient/:path*",
    "/user/:path*",
  ],
};