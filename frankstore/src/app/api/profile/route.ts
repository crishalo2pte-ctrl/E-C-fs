import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { DEFAULT_USER_ID } from "@/lib/api"

export async function GET() {
  const user = await prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID },
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
    level: user.level as "Premium" | "Gold" | "Silver",
    registeredAt: user.registeredAt.toLocaleDateString("es-AR", { year: "numeric", month: "short", day: "numeric" }),
    birthDate: user.birthDate ?? "",
  })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { name, lastName, email, phone, birthDate } = body

  const user = await prisma.user.update({
    where: { id: DEFAULT_USER_ID },
    data: { name, lastName, email, phone, birthDate },
  })

  return NextResponse.json({
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    level: user.level as "Premium" | "Gold" | "Silver",
    registeredAt: user.registeredAt.toLocaleDateString("es-AR", { year: "numeric", month: "short", day: "numeric" }),
    birthDate: user.birthDate ?? "",
  })
}
