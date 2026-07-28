import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const orders = await prisma.order.findMany({
    where: { userId: auth.userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  const mapped = orders.map((o) => ({
    id: o.id,
    number: o.number,
    date: o.createdAt.toLocaleDateString("es-AR", { year: "numeric", month: "short", day: "numeric" }),
    status: o.status,
    total: o.total,
    currency: o.currency,
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
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const body = await request.json()
  const { items, address, paymentMethod, notes } = body

  if (!items?.length) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 })
  }

  if (!address || !paymentMethod) {
    return NextResponse.json({ error: "Dirección y método de pago son requeridos" }, { status: 400 })
  }

  const productIds = items.map((item: { productId: string }) => item.productId)
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
  })

  const productMap = new Map(dbProducts.map((p) => [p.id, p]))

  for (const item of items) {
    if (!productMap.has(item.productId)) {
      return NextResponse.json({ error: `Producto ${item.productId} no encontrado` }, { status: 400 })
    }
  }

  const validatedItems = items.map((item: { productId: string; quantity: number; image?: string }) => {
    const dbProduct = productMap.get(item.productId)!
    return {
      productId: item.productId,
      name: dbProduct.name,
      price: dbProduct.price,
      quantity: item.quantity,
      image: item.image ?? dbProduct.image,
    }
  })

  const total = validatedItems.reduce((sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity, 0)

  async function generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const prefix = `FS-${year}-`

    for (let attempt = 0; attempt < 5; attempt++) {
      const lastOrder = await prisma.order.findFirst({
        where: { number: { startsWith: prefix } },
        orderBy: { number: "desc" },
      })
      const lastNumber = lastOrder ? parseInt(lastOrder.number.split("-").pop() ?? "0", 10) : 0
      const candidate = `${prefix}${String(lastNumber + 1).padStart(4, "0")}`

      const exists = await prisma.order.findUnique({ where: { number: candidate } })
      if (!exists) return candidate
    }
    throw new Error("No se pudo generar número de orden único")
  }

  const number = await generateOrderNumber()

  const order = await prisma.order.create({
    data: {
      number,
      userId: auth.userId,
      total,
      currency: "ARS",
      paymentMethod,
      addressSnapshot: address,
      notes: notes ?? null,
      items: {
        create: validatedItems.map((item: { productId: string; name: string; price: number; quantity: number; image: string }) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
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
