import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { DEFAULT_USER_ID } from "@/lib/api"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { name, street, city, department, postalCode, phone, isDefault } = body

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: DEFAULT_USER_ID },
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

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const address = await prisma.address.findUnique({ where: { id } })

  if (!address || address.userId !== DEFAULT_USER_ID) {
    return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 })
  }

  const wasDefault = address.isDefault
  await prisma.address.delete({ where: { id } })

  if (wasDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { createdAt: "asc" },
    })
    if (nextAddress) {
      await prisma.address.update({ where: { id: nextAddress.id }, data: { isDefault: true } })
    }
  }

  return NextResponse.json({ success: true })
}
