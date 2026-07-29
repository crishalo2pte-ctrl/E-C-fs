import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { deleteImage, extractPublicId } from "@/lib/cloudinary"
import { requireAdmin } from "@/lib/admin-middleware"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  })
  if (!category) {
    return NextResponse.json({ message: "Categoría no encontrada" }, { status: 404 })
  }

  return NextResponse.json({
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image,
    productCount: category._count.products,
  })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const body = await request.json()
  const { name, slug, image } = body

  const existing = await prisma.category.findUnique({ where: { id }, select: { image: true } })
  if (!existing) {
    return NextResponse.json({ message: "Categoría no encontrada" }, { status: 404 })
  }

  if (image && image !== existing.image && existing.image) {
    const publicId = extractPublicId(existing.image)
    if (publicId) await deleteImage(publicId).catch(() => {})
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(image !== undefined && { image }),
    },
  })

  revalidatePath("/")
  revalidatePath("/catalogo")

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    slug: updated.slug,
    image: updated.image,
  })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const category = await prisma.category.findUnique({ where: { id }, select: { image: true } })

  if (category?.image) {
    const publicId = extractPublicId(category.image)
    if (publicId) await deleteImage(publicId).catch(() => {})
  }

  await prisma.category.delete({ where: { id } })

  revalidatePath("/")
  revalidatePath("/catalogo")

  return NextResponse.json({ success: true })
}
