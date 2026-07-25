import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { DEFAULT_USER_ID } from "@/lib/api"

export async function GET() {
  const favorites = await prisma.favorite.findMany({
    where: { userId: DEFAULT_USER_ID },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  })

  const mapped = favorites.map((f) => ({
    id: f.id,
    name: f.product.name,
    price: f.product.price,
    image: f.product.image,
    inStock: true,
    slug: f.product.slug,
    category: f.product.category.name,
  }))

  return NextResponse.json(mapped)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { productId } = body

  if (!productId) {
    return NextResponse.json({ error: "productId requerido" }, { status: 400 })
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: DEFAULT_USER_ID, productId } },
  })

  if (existing) {
    return NextResponse.json({ error: "Ya está en favoritos" }, { status: 409 })
  }

  const favorite = await prisma.favorite.create({
    data: { userId: DEFAULT_USER_ID, productId },
  })

  return NextResponse.json(favorite)
}
