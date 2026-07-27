import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const addresses = await prisma.address.findMany({
    where: { userId: auth.userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  })

  const mapped = addresses.map((a) => ({
    id: a.id,
    name: a.name,
    street: a.street,
    city: a.city,
    department: a.department,
    postalCode: a.postalCode,
    phone: a.phone,
    isDefault: a.isDefault,
  }))

  return NextResponse.json(mapped)
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const body = await request.json()
  const { name, street, city, department, postalCode, phone, isDefault } = body

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: auth.userId },
      data: { isDefault: false },
    })
  }

  const address = await prisma.address.create({
    data: { userId: auth.userId, name, street, city, department, postalCode, phone, isDefault: isDefault ?? false },
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
