import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  const mapped = await Promise.all(
    users.map(async (u) => {
      const orderCount = await prisma.order.count({ where: { userId: u.id } })
      const payments = await prisma.payment.findMany({ where: { userId: u.id } })
      const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0)

      return {
        id: u.id,
        name: `${u.name} ${u.lastName}`,
        email: u.email,
        role: u.role,
        orders: orderCount,
        totalSpent,
        joined: u.createdAt.toLocaleDateString("es-AR"),
        status: u.status,
      }
    })
  )

  return NextResponse.json(mapped)
}
