"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, Heart, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/products"

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartActions({ product }: AddToCartButtonProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product)
    router.push("/checkout")
  }

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button size="lg" className="flex-1 rounded-full" onClick={handleAdd}>
        {added ? (
          <>
            <Check className="mr-2 h-4 w-4" /> Agregado
          </>
        ) : (
          <>
            <ShoppingBag className="mr-2 h-4 w-4" /> Agregar al Carrito
          </>
        )}
      </Button>
      <Button variant="outline" size="icon" className="h-11 w-11 rounded-full" onClick={handleBuyNow}>
        <Heart className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-11 w-11 rounded-full">
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}