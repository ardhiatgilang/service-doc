import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { TEKNISI_COOKIE, ADMIN_COOKIE } from "@/lib/cookie-names";

const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET ?? "");

async function hasValidSession(token: string | undefined, requiredField: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return Boolean(payload[requiredField]);
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!(await hasValidSession(token, "adminId"))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/teknisi") && pathname !== "/teknisi/login") {
    const token = request.cookies.get(TEKNISI_COOKIE)?.value;
    if (!(await hasValidSession(token, "technicianId"))) {
      return NextResponse.redirect(new URL("/teknisi/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teknisi/:path*"],
};
