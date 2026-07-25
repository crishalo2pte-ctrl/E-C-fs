import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { name, slug, description, price, image, categoryId, featured, bestSeller } = body

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(image !== undefined && { image }),
      ...(categoryId !== undefined && { categoryId }),
      ...(featured !== undefined && { featured }),
      ...(bestSeller !== undefined && { bestSeller }),
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

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  await prisma.favorite.deleteMany({ where: { productId: id } })
  await prisma.variant.deleteMany({ where: { productId: id } })
  await prisma.product.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
