import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  const mapped = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    image: p.image,
    images: p.images,
    category: p.category.name,
    categorySlug: p.category.slug,
    categoryId: p.categoryId,
    featured: p.featured,
    bestSeller: p.bestSeller,
    createdAt: p.createdAt.toISOString(),
  }))

  return NextResponse.json(mapped)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, slug, description, price, image, categoryId, featured, bestSeller } = body

  const product = await prisma.product.create({
    data: {
      name,
      slug: slug ?? name.toLowerCase().replace(/\s+/g, "-"),
      description,
      price: Number(price),
      image: image ?? "/images/placeholder.jpg",
      images: [image ?? "/images/placeholder.jpg"],
      categoryId,
      featured: featured ?? false,
      bestSeller: bestSeller ?? false,
    },
    include: { category: true },
  })

  return NextResponse.json({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category.name,
    categorySlug: product.category.slug,
    featured: product.featured,
    bestSeller: product.bestSeller,
  })
}
