import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cat = searchParams.get("cat")
  const search = searchParams.get("search")
  const featured = searchParams.get("featured")
  const bestSeller = searchParams.get("bestseller")
  const carousel = searchParams.get("carousel")

  const where: Record<string, unknown> = {}

  if (cat) {
    where.category = { slug: cat }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  if (featured === "true") {
    where.featured = true
  }

  if (bestSeller === "true") {
    where.bestSeller = true
  }

  if (carousel === "true") {
    where.carousel = true
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: carousel === "true"
      ? [{ carouselOrder: "asc" }, { createdAt: "desc" }]
      : { createdAt: "desc" },
  })

  const mapped = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    image: p.image,
    category: p.category.name,
    categorySlug: p.category.slug,
    featured: p.featured,
    bestSeller: p.bestSeller,
    carousel: p.carousel,
    carouselOrder: p.carouselOrder,
  }))

  return NextResponse.json({ products: mapped })
}
