"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const visibleCount = typeof window !== "undefined" && window.innerWidth < 768 ? 2 : 3
  const totalSlides = Math.ceil(products.length / visibleCount)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % totalSlides)
  }, [totalSlides])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) next()
    }, 3000)
    intervalRef.current = timer
    return () => clearInterval(timer)
  }, [isHovered, next])

  useEffect(() => {
    const handleResize = () => {
      const newVisibleCount = window.innerWidth < 768 ? 2 : 3
      const newTotalSlides = Math.ceil(products.length / newVisibleCount)
      setCurrent((c) => Math.min(c, newTotalSlides - 1))
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [products.length])

  if (products.length === 0) return null

  const startIndex = current * visibleCount
  const visibleProducts = products.slice(startIndex, startIndex + visibleCount)

  return (
    <section className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <SectionHeader title={title} description="" href={href} />
      <div className="relative">
        <div className="flex gap-6 overflow-hidden">
          <div
            className="flex gap-6 transition-none duration-0"
            style={{
              transform: `translateX(-${current * (100 / visibleCount)}%)`,
            }}
          >
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className={`flex-shrink-0 basis-[calc(100%/${visibleCount})] max-w-[calc(100%/${visibleCount})]`}
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