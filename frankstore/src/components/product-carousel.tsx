"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { formatARS } from "@/lib/format"

interface ProductCarouselProps {
  products: Product[]
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((c) => (c + 1) % products.length)
  const prev = () => setCurrent((c) => (c - 1 + products.length) % products.length)

  useEffect(() => {
    const timer = setInterval(next, 1500)
    return () => clearInterval(timer)
  }, [])

  if (products.length === 0) return null

  const product = products[current]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              {product.category}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h2>
            <p className="max-w-md text-muted-foreground">{product.description}</p>
            <p className="text-2xl font-bold text-primary">
              {formatARS(product.price)}
            </p>
            <div className="flex gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href={`/producto/${product.slug}`}>Ver Producto</Link>
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="aspect-square w-full max-w-md rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-12">
              <span className="text-8xl font-bold text-primary/20 sm:text-9xl">
                {product.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-6 bg-primary" : "w-2 bg-primary/30"
                }`}
              />
            ))}
          </div>
          <Button variant="outline" size="icon" className="rounded-full" onClick={next}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
