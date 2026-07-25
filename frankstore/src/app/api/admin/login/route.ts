import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ message: "Email y contraseña requeridos" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 })
  }

  const token = Buffer.from(JSON.stringify({
    id: user.id,
    name: `${user.name} ${user.lastName}`,
    email: user.email,
    role: user.role,
  })).toString("base64")

  const response = NextResponse.json({
    token,
    user: {
      id: user.id,
      name: `${user.name} ${user.lastName}`,
      email: user.email,
      role: user.role,
    },
  })

  response.cookies.set("admin_token", token, {
    path: "/admin",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
  })

  return response
}
