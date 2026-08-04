import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { deleteImage, extractPublicId } from "@/lib/cloudinary"
import { requireAdmin } from "@/lib/admin-middleware"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const body = await request.json()
  const { name, slug, description, price, image, images, categoryId, featured, bestSeller, carousel, carouselOrder } = body

  const product = await prisma.product.findUnique({ where: { id }, select: { images: true } })

  if (images?.length && product?.images?.length) {
    const oldUrls = new Set(product.images)
    const newUrls = new Set(images)
    for (const url of oldUrls) {
      if (!newUrls.has(url)) {
        const publicId = extractPublicId(url)
        if (publicId) await deleteImage(publicId).catch(() => {})
      }
    }
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(image !== undefined && { image }),
      ...(images !== undefined && { images }),
      ...(categoryId !== undefined && { categoryId }),
      ...(featured !== undefined && { featured }),
      ...(bestSeller !== undefined && { bestSeller }),
      ...(carousel !== undefined && { carousel }),
      ...(carouselOrder !== undefined && { carouselOrder }),
    },
    include: { category: true },
  })

  revalidatePath("/")

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    slug: updated.slug,
    description: updated.description,
    price: updated.price,
    image: updated.image,
    images: updated.images,
    category: updated.category.name,
    categorySlug: updated.category.slug,
    featured: updated.featured,
    bestSeller: updated.bestSeller,
    carousel: updated.carousel,
    carouselOrder: updated.carouselOrder,
  })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  const product = await prisma.product.findUnique({ where: { id }, select: { image: true, images: true } })
  const allImages = [...new Set([product?.image, ...(product?.images ?? [])].filter(Boolean) as string[])]
  for (const url of allImages) {
    const publicId = extractPublicId(url)
    if (publicId) await deleteImage(publicId).catch(() => {})
  }

  await prisma.favorite.deleteMany({ where: { productId: id } })
  await prisma.variant.deleteMany({ where: { productId: id } })
  await prisma.product.delete({ where: { id } })

  revalidatePath("/")

  return NextResponse.json({ success: true })
}
