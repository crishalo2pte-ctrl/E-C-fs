import { prisma } from "@/lib/prisma"
import { AdminProductForm } from "@/components/admin-product-form"

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  return (
    <AdminProductForm
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  )
}
