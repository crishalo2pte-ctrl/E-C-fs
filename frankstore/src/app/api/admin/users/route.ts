import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-middleware"

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true } },
      payments: { select: { amount: true } },
    },
  })

  const mapped = users.map((u) => ({
    id: u.id,
    name: `${u.name} ${u.lastName}`,
    email: u.email,
    role: u.role,
    orders: u._count.orders,
    totalSpent: u.payments.reduce((sum, p) => sum + p.amount, 0),
    joined: u.createdAt.toLocaleDateString("es-AR"),
    status: u.status,
  }))

  return NextResponse.json(mapped)
}
