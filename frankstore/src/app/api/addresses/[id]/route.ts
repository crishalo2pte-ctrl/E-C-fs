import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-middleware"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const body = await request.json()
  const { name, street, city, department, postalCode, phone, isDefault } = body

  const existing = await prisma.address.findUnique({ where: { id } })
  if (!existing || existing.userId !== auth.userId) {
    return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 })
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: auth.userId },
      data: { isDefault: false },
    })
  }

  const address = await prisma.address.update({
    where: { id },
    data: { name, street, city, department, postalCode, phone, isDefault: isDefault ?? false },
  })

  return NextResponse.json({
    id: address.id,
    name: address.name,
    street: address.street,
    city: address.city,
    department: address.department,
    postalCode: address.postalCode,
    phone: address.phone,
    isDefault: address.isDefault,
  })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const address = await prisma.address.findUnique({ where: { id } })

  if (!address || address.userId !== auth.userId) {
    return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 })
  }

  const wasDefault = address.isDefault
  await prisma.address.delete({ where: { id } })

  if (wasDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: { userId: auth.userId },
      orderBy: { createdAt: "asc" },
    })
    if (nextAddress) {
      await prisma.address.update({ where: { id: nextAddress.id }, data: { isDefault: true } })
    }
  }

  return NextResponse.json({ success: true })
}
