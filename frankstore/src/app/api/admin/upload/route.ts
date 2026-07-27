import { NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/cloudinary"
import { requireAdmin } from "@/lib/admin-middleware"

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"]
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ message: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ message: "Solo se permiten archivos PNG, JPG y JPEG" }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: "El archivo supera los 5MB" }, { status: 400 })
    }

    const result = await uploadImage(file)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ message: "Error al subir la imagen" }, { status: 500 })
  }
}
