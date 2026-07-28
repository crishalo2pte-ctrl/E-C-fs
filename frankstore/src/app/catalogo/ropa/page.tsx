import type { Metadata } from "next"
import { ProductCard } from "@/components/product-card"
import { SectionHeader } from "@/components/section-header"
import { prisma } from "@/lib/prisma"
import { Container } from "@/components/container"

export const metadata: Metadata = {
  title: "Ropa",
  description: "Descubrí nuestra colección de ropa con estilo único. Prendas de calidad en Córdoba, Argentina.",
}

async function getRopaProducts() {
  const products = await prisma.product.findMany({
    where: { category: { slug: "ropa" } },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    image: p.image,
    category: p.category.name,
    categorySlug: p.category.slug,
    featured: p.featured,
    bestSeller: p.bestSeller,
  }))
}

export default async function RopaPage() {
  const ropaProducts = await getRopaProducts()

  return (
    <Container py={12}>
      <SectionHeader
        title="Ropa"
        description="Descubre nuestra colección de ropa con estilo único"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ropaProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
  )
}
