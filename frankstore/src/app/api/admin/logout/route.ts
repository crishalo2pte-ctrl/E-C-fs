import { NextRequest, NextResponse } from "next/server"
import { revokeRefreshToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("admin_refresh_token")?.value

  if (refreshToken) {
    await revokeRefreshToken(refreshToken).catch(() => {})
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set("admin_token", "", {
    path: "/admin",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  })
  response.cookies.set("admin_refresh_token", "", {
    path: "/admin",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  })

  return response
}
