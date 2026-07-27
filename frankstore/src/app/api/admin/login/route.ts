import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { comparePassword, generateAccessToken, createRefreshToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email y contraseña requeridos" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 })
    }

    if (!user.passwordHash) {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 })
    }

    const isValidPassword = await comparePassword(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 })
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
    const refreshToken = await createRefreshToken(user.id)

    const response = NextResponse.json({
      token: accessToken,
      user: {
        id: user.id,
        name: `${user.name} ${user.lastName}`,
        email: user.email,
        role: user.role,
      },
    })

    response.cookies.set("admin_token", accessToken, {
      path: "/admin",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60,
    })
    response.cookies.set("admin_refresh_token", refreshToken, {
      path: "/admin",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
