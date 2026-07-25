import type { Metadata } from "next"
import { ProductCard } from "@/components/product-card"
import { SectionHeader } from "@/components/section-header"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Container } from "@/components/container"

async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } })
}

async function getFilteredProducts(cat?: string, search?: string) {
  const where: Record<string, unknown> = {}
  if (cat) {
    where.category = { slug: cat }
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }
  const products = await prisma.product.findMany({
    where,
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

export async function generateMetadata(props: {
  searchParams?: Promise<{ cat?: string; search?: string }>
}): Promise<Metadata> {
  const searchParams = await props.searchParams
  const cat = searchParams?.cat
  const search = searchParams?.search

  if (cat) {
    const dbCategory = await prisma.category.findUnique({ where: { slug: cat } })
    if (dbCategory) {
      return {
        title: dbCategory.name,
        description: `Explorá nuestra colección de ${dbCategory.name.toLowerCase()} en FrankStore. Calidad y estilo único en Córdoba, Argentina.`,
        alternates: { canonical: `/catalogo?cat=${cat}` },
      }
    }
  }

  if (search) {
    return {
      title: `Resultados para "${search}"`,
      description: `Buscá productos en FrankStore: ${search}. Ropa y accesorios de calidad en Córdoba Capital.`,
      robots: { index: false, follow: true },
    }
  }

  return {
    title: "Catálogo",
    description: "Explorá todos nuestros productos de ropa y accesorios. Envíos a toda Argentina.",
  }
}

export default async function CatalogoPage(props: {
  searchParams?: Promise<{ cat?: string; search?: string }>
}) {
  const searchParams = await props.searchParams
  const cat = searchParams?.cat
  const search = searchParams?.search

  const [categories, filteredProducts] = await Promise.all([
    getAllCategories(),
    getFilteredProducts(cat, search),
  ])

  let title = "Catálogo"
  let description = "Explora todos nuestros productos"

  if (cat) {
    const category = categories.find((c) => c.slug === cat)
    title = category?.name ?? "Catálogo"
    description = `Explora nuestra categoría de ${title.toLowerCase()}`
  } else if (search) {
    title = `Resultados para "${search}"`
    description = `Se encontraron ${filteredProducts.length} producto${filteredProducts.length !== 1 ? "s" : ""}`
  }

  return (
    <Container py={12}>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <Link
          href="/catalogo"
          className={`text-sm font-medium transition-colors hover:text-primary ${!cat ? "text-primary" : "text-muted-foreground"}`}
        >
          Todos
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/catalogo?cat=${c.slug}`}
            className={`text-sm font-medium transition-colors hover:text-primary ${cat === c.slug ? "text-primary" : "text-muted-foreground"}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No se encontraron productos.</p>
          </div>
        )}
      </div>
    </Container>
  )
}
