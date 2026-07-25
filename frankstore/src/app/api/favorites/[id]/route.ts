import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { DEFAULT_USER_ID } from "@/lib/api"

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const favorite = await prisma.favorite.findUnique({ where: { id } })

  if (!favorite || favorite.userId !== DEFAULT_USER_ID) {
    return NextResponse.json({ error: "Favorito no encontrado" }, { status: 404 })
  }

  await prisma.favorite.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
