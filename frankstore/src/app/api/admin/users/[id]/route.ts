import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-middleware"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: { select: { orders: true } },
      payments: { select: { amount: true } },
    },
  })
  if (!user) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
  }

  return NextResponse.json({
    id: user.id,
    name: `${user.name} ${user.lastName}`,
    email: user.email,
    role: user.role,
    status: user.status,
    orders: user._count.orders,
    totalSpent: user.payments.reduce((sum, p) => sum + p.amount, 0),
    joined: user.registeredAt.toLocaleDateString("es-AR"),
    phone: user.phone,
    level: user.level,
    avatar: user.avatar,
  })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const body = await request.json()
  const { name, lastName, email, phone, role, level } = body

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
  }

  if (id === auth.userId && role !== undefined && role !== "admin") {
    return NextResponse.json({ message: "No puedes cambiar tu propio rol" }, { status: 400 })
  }

  if (role !== undefined && role === "user" && user.role === "admin") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } })
    if (adminCount <= 1) {
      return NextResponse.json({ message: "No se puede desactivar el último admin" }, { status: 400 })
    }
  }

  const validRoles = ["user", "admin"]
  if (role !== undefined && !validRoles.includes(role)) {
    return NextResponse.json({ message: "Rol inválido" }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(lastName !== undefined && { lastName }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(role !== undefined && { role }),
      ...(level !== undefined && { level }),
    },
  })

  return NextResponse.json({
    id: updated.id,
    name: `${updated.name} ${updated.lastName}`,
    email: updated.email,
    role: updated.role,
    status: updated.status,
  })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
  }

  if (id === auth.userId) {
    return NextResponse.json({ message: "No puedes bloquearte a ti mismo" }, { status: 400 })
  }

  const newStatus = user.status === "activo" ? "bloqueado" : "activo"

  const updated = await prisma.user.update({
    where: { id },
    data: { status: newStatus },
  })

  return NextResponse.json({
    id: updated.id,
    name: `${updated.name} ${updated.lastName}`,
    email: updated.email,
    role: updated.role,
    status: updated.status,
  })
}
