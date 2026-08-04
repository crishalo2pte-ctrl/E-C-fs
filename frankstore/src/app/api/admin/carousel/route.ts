import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-middleware"

export async function PUT(request: NextRequest) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  const body = await request.json()
  const productIds: string[] = Array.isArray(body?.productIds) ? body.productIds : []

  await prisma.$executeRaw`
    UPDATE "Product"
    SET "carousel" = "id" = ANY(${productIds}::text[]),
        "carouselOrder" = COALESCE(array_position(${productIds}::text[], "id"), 0)
  `

  revalidatePath("/")

  return NextResponse.json({ success: true, count: productIds.length })
}
