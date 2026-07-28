import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

import { ProductCarousel } from "@/components/product-carousel"
import { ProductCard } from "@/components/product-card"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/container"
import { prisma } from "@/lib/prisma"

async function getProductsByCategory(slug: string) {
  const products = await prisma.product.findMany({
    where: { category: { slug } },
    include: { category: true },
    take: 4,
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

async function getAllProducts() {
  const products = await prisma.product.findMany({
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

export default async function Home() {
  const [allProducts, ropaProducts, imperdiblesProducts, destacadaProducts, masVendidosProducts] = await Promise.all([
    getAllProducts(),
    getProductsByCategory("ropa"),
    getProductsByCategory("imperdibles"),
    getProductsByCategory("coleccion-destacada"),
    getProductsByCategory("mas-vendidos"),
  ])

  return (
    <>
      <ProductCarousel />

      <section className="py-16">
        <Container>
          <SectionHeader
            title="Ropa"
            description="Prendas de vestir para todo momento"
            href="/catalogo?cat=ropa"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ropaProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-muted/50 py-16">
        <Container>
          <SectionHeader
            title="Imperdibles"
            description="Productos esenciales que no pueden faltar"
            href="/catalogo?cat=imperdibles"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {imperdiblesProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeader
            title="Colección Destacada"
            description="Selección especial del equipo FrankStore"
            href="/catalogo?cat=coleccion-destacada"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destacadaProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-muted/50 py-16">
        <Container>
          <SectionHeader
            title="Más Vendidos"
            description="Los favoritos de nuestros clientes"
            href="/catalogo?cat=mas-vendidos"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {masVendidosProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-primary py-16 text-primary-foreground">
        <Container className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Listo para renovar tu estilo?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
            Suscríbete y recibe un 10% de descuento en tu primera compra.
          </p>
          <div className="mx-auto mt-6 flex max-w-md gap-3">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white"
            />
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full bg-white text-primary hover:bg-white/90"
            >
              Suscribirme
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeader
            title="Lo Último"
            description="Novedades en FrankStore"
            href="/catalogo"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link href="/catalogo">
                Ver todo <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
