"use client"

import Link from "next/link"
import { ShoppingBag, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/products"
import { formatARS } from "@/lib/format"
import { useAddedToCart } from "@/hooks/use-added-to-cart"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { added, trigger: handleAdd } = useAddedToCart(product)

  return (
    <Link href={`/producto/${product.slug}`} className="block">
      <Card variant="flat" className="group overflow-hidden border-0 bg-card shadow-sm transition-all hover:shadow-md cursor-pointer">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-8">
            <span className="text-6xl font-bold text-primary/20">{product.name.charAt(0)}</span>
          </div>
          {product.featured && (
            <Badge className="absolute left-3 top-3 rounded-full bg-primary text-primary-foreground">
              Destacado
            </Badge>
          )}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="secondary" size="icon" onClick={(e) => { e.preventDefault(); handleAdd(); }}>
              {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
            {product.category}
          </p>
          <h3 className="font-semibold text-primary">
            {product.name}
          </h3>
          <p className="mt-1 font-bold text-primary">
            {formatARS(product.price)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}