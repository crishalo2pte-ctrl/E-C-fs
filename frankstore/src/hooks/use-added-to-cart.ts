"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/products"

export function useAddedToCart(product: Product, duration = 2000) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const trigger = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), duration)
  }

  return { added, trigger }
}