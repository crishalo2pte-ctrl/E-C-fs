import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const ADMIN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "")

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const { payload } = await jwtVerify(token, ADMIN_SECRET)
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
