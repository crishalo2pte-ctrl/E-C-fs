import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-middleware"

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(
    categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image,
      productCount: c._count.products,
      createdAt: c.createdAt.toISOString(),
    }))
  )
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const body = await request.json()
  const { name, slug, image } = body

  const category = await prisma.category.create({
    data: {
      name,
      slug: slug ?? name.toLowerCase().replace(/\s+/g, "-"),
      image: image ?? null,
    },
  })

  revalidatePath("/")
  revalidatePath("/catalogo")

  return NextResponse.json({
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image,
  })
}
