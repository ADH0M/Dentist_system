import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // const session = request.cookies.get("session")?.value;
  // const role = request.cookies.get("role")?.value;

  // // Protect Admin Routes
  // if (request.nextUrl.pathname.startsWith("/admin")) {
  //   if (!session || role !== "admin") {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
