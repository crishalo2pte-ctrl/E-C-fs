import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-middleware"

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

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
    carousel: p.carousel,
    carouselOrder: p.carouselOrder,
    createdAt: p.createdAt.toISOString(),
  }))

  return NextResponse.json(mapped)
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const body = await request.json()
  const { name, slug, description, price, image, images, categoryId, featured, bestSeller } = body

  const imageUrls = images?.length ? images : [image ?? "/images/placeholder.jpg"]

  const product = await prisma.product.create({
    data: {
      name,
      slug: slug ?? name.toLowerCase().replace(/\s+/g, "-"),
      description,
      price: Number(price),
      image: image ?? imageUrls[0],
      images: imageUrls,
      categoryId,
      featured: featured ?? false,
      bestSeller: bestSeller ?? false,
      carousel: false,
      carouselOrder: 0,
    },
    include: { category: true },
  })

  revalidatePath("/")

  return NextResponse.json({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    image: product.image,
    images: product.images,
    category: product.category.name,
    categorySlug: product.category.slug,
    featured: product.featured,
    bestSeller: product.bestSeller,
    carousel: product.carousel,
    carouselOrder: product.carouselOrder,
  })
}
