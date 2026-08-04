"use client"

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react"
import Link from "next/link"
import useSWR from "swr"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import type { Product } from "@/lib/products"
import { fetcher } from "@/lib/api"
import { Button, buttonVariants } from "@/components/ui/button"
import { formatARS } from "@/lib/format"
import { cn } from "@/lib/utils"

const CAROUSEL_LIMIT = 10
const REFRESH_INTERVAL = 30000
const SWIPE_THRESHOLD = 50
const DRAG_LIMIT = 120
const DRAG_RESISTANCE = 0.5

export function ProductCarousel() {
  const { data, isLoading } = useSWR<{ products: Product[] }>(
    "/api/products?carousel=true",
    fetcher,
    { refreshInterval: REFRESH_INTERVAL, revalidateOnFocus: true }
  )

  const products = (data?.products ?? []).slice(0, CAROUSEL_LIMIT)
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragDelta, setDragDelta] = useState(0)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const hasSwiped = useRef(false)

  const next = useCallback(() => setCurrent((c) => (c + 1) % (products.length || 1)), [products.length])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + products.length) % (products.length || 1)), [products.length])

  useEffect(() => {
    if (products.length === 0) return
    const timer = setInterval(() => {
      if (!isHovered && !isDragging) setCurrent((c) => (c + 1) % products.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [products.length, isHovered, isDragging])

  useEffect(() => {
    if (!isDragging) return

    const onMove = (e: PointerEvent) => {
      if (!dragStart.current) return
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      if (Math.abs(dx) > Math.abs(dy)) {
        const resisted = Math.max(-DRAG_LIMIT, Math.min(DRAG_LIMIT, dx * DRAG_RESISTANCE))
        setDragDelta(resisted)
      } else {
        setDragDelta(0)
      }
    }

    const onUp = (e: PointerEvent) => {
      if (!dragStart.current) return
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        hasSwiped.current = true
        if (dx < 0) next()
        else prev()
        setTimeout(() => {
          hasSwiped.current = false
        }, 300)
      }
      dragStart.current = null
      setIsDragging(false)
      setDragDelta(0)
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }, [isDragging, next, prev])

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return
    dragStart.current = { x: e.clientX, y: e.clientY }
    hasSwiped.current = false
    setIsDragging(true)
  }

  const handleSlideClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (hasSwiped.current) {
      e.preventDefault()
      hasSwiped.current = false
    }
  }

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  const safeIndex = current % products.length
  const product = products[safeIndex]

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={onPointerDown}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div
          className={cn(
            "transition-transform",
            isDragging ? "cursor-grabbing duration-0" : "cursor-grab duration-300 ease-out"
          )}
          style={{ transform: `translateX(${dragDelta}px)`, touchAction: "pan-y" }}
        >
          <Link
            href={`/producto/${product.slug}`}
            aria-label={`Ver ${product.name}`}
            onClick={handleSlideClick}
            className="block select-none rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
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
                <span className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-full")}>
                  Ver Producto
                </span>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-12">
                      <span className="text-8xl font-bold text-primary/20 sm:text-9xl">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>

        {products.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-1">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Ver producto ${i + 1}`}
                  className="flex h-6 items-center justify-center px-1"
                >
                  <span
                    className={cn(
                      "block h-2 rounded-full transition-all",
                      i === safeIndex ? "w-6 bg-primary" : "w-2 bg-primary/30"
                    )}
                  />
                </button>
              ))}
            </div>
            <Button variant="outline" size="icon" className="rounded-full" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
