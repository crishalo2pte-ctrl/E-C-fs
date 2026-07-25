import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { DEFAULT_USER_ID } from "@/lib/api"

export async function GET() {
  const orders = await prisma.order.findMany({
    where: { userId: DEFAULT_USER_ID },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  const mapped = orders.map((o) => ({
    id: o.id,
    number: o.number,
    date: o.createdAt.toLocaleDateString("es-AR", { year: "numeric", month: "short", day: "numeric" }),
    status: o.status,
    total: o.total,
    paymentMethod: o.paymentMethod,
    address: o.addressSnapshot,
    items: o.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
  }))

  return NextResponse.json(mapped)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { items, address, paymentMethod, notes } = body

  if (!items?.length) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 })
  }

  const total = items.reduce((sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity, 0)

  const lastOrder = await prisma.order.findFirst({ orderBy: { createdAt: "desc" } })
  const lastNumber = lastOrder ? parseInt(lastOrder.number.split("-").pop() ?? "0", 10) : 0
  const number = `FS-${new Date().getFullYear()}-${String(lastNumber + 1).padStart(4, "0")}`

  const order = await prisma.order.create({
    data: {
      number,
      userId: DEFAULT_USER_ID,
      total,
      paymentMethod,
      addressSnapshot: address,
      notes: notes ?? null,
      items: {
        create: items.map((item: { productId: string; name: string; price: number; quantity: number; image?: string }) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image ?? null,
        })),
      },
    },
    include: { items: true },
  })

  return NextResponse.json({
    id: order.id,
    number: order.number,
    total: order.total,
    status: order.status,
  })
}
