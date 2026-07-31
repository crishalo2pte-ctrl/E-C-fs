"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/section-header"

interface ProductCarouselSectionProps {
  title: string
  products: Product[]
  href: string
}

export function ProductCarouselSection({ title, products, href }: ProductCarouselSectionProps) {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [visibleCount, setVisibleCount] = useState(3)

  const totalSlides = Math.max(1, Math.ceil(products.length / visibleCount))

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % totalSlides)
  }, [totalSlides])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) next()
    }, 5000)
    return () => clearInterval(timer)
  }, [isHovered, next])

  useEffect(() => {
    const update = () => {
      const count = window.innerWidth < 768 ? 2 : 3
      setVisibleCount(count)
      setCurrent((c) => Math.min(c, Math.max(0, Math.ceil(products.length / count) - 1)))
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [products.length])

  if (products.length === 0) return null

  return (
    <section className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <SectionHeader title={title} description="" href={href} />
      <div className="relative">
        <div className="flex gap-6 overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${current * (100 / visibleCount)}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0"
                style={{
                  flexBasis: `${100 / visibleCount}%`,
                  maxWidth: `${100 / visibleCount}%`,
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 rounded-full bg-background/90 hover:bg-background shadow-md z-10 md:-translate-x-4"
          onClick={prev}
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 rounded-full bg-background/90 hover:bg-background shadow-md z-10 md:translate-x-4"
          onClick={next}
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}