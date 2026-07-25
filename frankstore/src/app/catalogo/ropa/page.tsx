import type { Metadata } from "next"
import { ProductCard } from "@/components/product-card"
import { SectionHeader } from "@/components/section-header"
import { products } from "@/lib/products"
import { Container } from "@/components/container"

export const metadata: Metadata = {
  title: "Ropa",
  description: "Descubrí nuestra colección de ropa con estilo único. Prendas de calidad en Córdoba, Argentina.",
}

export default function RopaPage() {
  const ropaProducts = products.filter((p) => p.categorySlug === "ropa")

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
