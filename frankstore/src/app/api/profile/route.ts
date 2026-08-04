import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
  })

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    level: user.level,
    registeredAt: user.registeredAt.toLocaleDateString("es-AR", { year: "numeric", month: "short", day: "numeric" }),
    birthDate: user.birthDate ?? "",
  })
}

export async function PATCH(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const body = await request.json()
  const { name, lastName, email, phone, birthDate } = body

  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: { name, lastName, email, phone, birthDate },
  })

  return NextResponse.json({
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    level: user.level,
    registeredAt: user.registeredAt.toLocaleDateString("es-AR", { year: "numeric", month: "short", day: "numeric" }),
    birthDate: user.birthDate ?? "",
  })
}
