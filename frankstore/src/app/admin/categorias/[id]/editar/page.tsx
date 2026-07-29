import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminCategoryForm, type CategoryFormData } from "@/components/admin-category-form"

export const dynamic = "force-dynamic"

export default async function EditarCategoriaPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) notFound()

  const formData: CategoryFormData = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image,
  }

  return <AdminCategoryForm category={formData} />
}
