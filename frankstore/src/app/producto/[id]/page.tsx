import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/product-card"
import { AddToCartActions } from "@/components/add-to-cart-button"
import { prisma } from "@/lib/prisma"
import { formatARS } from "@/lib/format"
import { Container } from "@/components/container"

async function getProduct(idOrSlug: string) {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: { category: true },
  })
  if (!product) return null
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    image: product.image,
    images: product.images,
    category: product.category.name,
    categorySlug: product.category.slug,
    featured: product.featured,
    bestSeller: product.bestSeller,
  }
}

async function getRelatedProducts(categorySlug: string, excludeId: string) {
  const products = await prisma.product.findMany({
    where: { category: { slug: categorySlug }, id: { not: excludeId } },
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

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await props.params
  const product = await getProduct(id)

  if (!product) {
    return { title: "Producto no encontrado" }
  }

  return {
    title: product.name,
    description: `${product.name} — ${product.description.slice(0, 120)}. ${formatARS(product.price)}. Envíos a toda Argentina.`,
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      type: "website",
      images: product.image ? [{ url: product.image }] : [],
    },
  }
}

export default async function ProductoPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const product = await getProduct(id)

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Producto no encontrado</h2>
        <p className="mt-2 text-muted-foreground">
          El producto que buscas no existe o ha sido removido.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/catalogo">Volver al Catálogo</Link>
        </Button>
      </div>
    )
  }

  const relatedProducts = await getRelatedProducts(product.categorySlug, product.id)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frankstore.com.ar"
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "ARS",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/producto/${product.slug}`,
    },
  }

  return (
    <Container py={8}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Link
        href="/catalogo"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <span className="text-9xl font-bold text-primary/20">{product.name.charAt(0)}</span>
        </div>

        <div className="flex flex-col justify-center">
          <Badge className="mb-3 w-fit rounded-full" variant="secondary">
            {product.category}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold text-primary">
            {formatARS(product.price)}
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <Separator className="my-6" />

          <AddToCartActions product={product} />

          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Envío gratis a toda Argentina en compras superiores a $150.000.
              Devoluciones gratuitas dentro de los primeros 30 días.
            </p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Productos Relacionados</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </Container>
  )
}

export function ProductoSkeleton() {
  return (
    <Container py={8}>
      <div className="mb-6 h-6 w-32 animate-pulse bg-muted rounded" />
      <div className="space-y-6">
        <div className="aspect-[4/5] rounded-xl animate-pulse bg-muted" />
        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse bg-muted rounded-full" />
          <div className="h-8 w-3/4 animate-pulse bg-muted rounded" />
          <div className="h-10 w-1/4 animate-pulse bg-muted rounded" />
          <div className="h-4 w-full animate-pulse bg-muted rounded" />
          <div className="h-4 w-2/3 animate-pulse bg-muted rounded" />
          <div className="h-4 w-1/2 animate-pulse bg-muted rounded" />
          <div className="h-48 w-full animate-pulse bg-muted rounded-lg" />
        </div>
      </div>
      <div className="mt-16 space-y-4">
        <div className="h-6 w-48 animate-pulse bg-muted rounded" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] rounded-lg bg-muted" />
              <div className="mt-3 h-4 w-3/4 bg-muted rounded" />
              <div className="mt-2 h-4 w-1/2 bg-muted rounded" />
              <div className="mt-2 h-5 w-1/4 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
