import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminProductForm, type ProductFormData } from "@/components/admin-product-form"

export default async function EditarProductoPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  if (!product) notFound()

  const formData: ProductFormData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    image: product.image,
    categoryId: product.categoryId,
    featured: product.featured,
    bestSeller: product.bestSeller,
  }

  return (
    <AdminProductForm
      product={formData}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  )
}
