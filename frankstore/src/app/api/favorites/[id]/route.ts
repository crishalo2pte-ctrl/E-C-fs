import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-middleware"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  const favorite = await prisma.favorite.findUnique({ where: { id } })

  if (!favorite || favorite.userId !== auth.userId) {
    return NextResponse.json({ error: "Favorito no encontrado" }, { status: 404 })
  }

  await prisma.favorite.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
