import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
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
    method: p.method,
    status: p.status,
    date: p.date.toLocaleDateString("es-AR"),
    product: p.product,
  }))

  return NextResponse.json(mapped)
}
