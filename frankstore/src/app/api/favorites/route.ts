import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const favorites = await prisma.favorite.findMany({
    where: { userId: auth.userId },
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
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const body = await request.json()
  const { productId } = body

  if (!productId) {
    return NextResponse.json({ error: "productId requerido" }, { status: 400 })
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: auth.userId, productId } },
  })

  if (existing) {
    return NextResponse.json({ error: "Ya está en favoritos" }, { status: 409 })
  }

  const favorite = await prisma.favorite.create({
    data: { userId: auth.userId, productId },
  })

  return NextResponse.json(favorite)
}
