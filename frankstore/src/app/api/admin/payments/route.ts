import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-middleware"

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const payments = await prisma.payment.findMany({
    include: { user: true },
    orderBy: { date: "desc" },
  })

  const mapped = payments.map((p) => ({
    id: p.id,
    transactionId: p.transactionId,
    user: `${p.user.name} ${p.user.lastName}`,
    email: p.user.email,
    amount: p.amount,
    currency: p.currency,
    method: p.method,
    status: p.status,
    date: p.date.toLocaleDateString("es-AR"),
    product: p.product,
  }))

  return NextResponse.json(mapped)
}
