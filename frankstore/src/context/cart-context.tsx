"use client"

import {
  createContext, useContext, useCallback, useSyncExternalStore,
  type ReactNode,
} from "react"
import type { Product } from "@/lib/products"

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isEmpty: boolean
  isLoading: boolean
  addToCart: (product: Product, qty?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = "frankstore-cart"

const EMPTY_CART: CartItem[] = []

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

let cachedItems: CartItem[] | null = null

function getSnapshot(): CartItem[] {
  if (cachedItems === null) {
    cachedItems = loadCart()
  }
  return cachedItems
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cachedItems = loadCart()
      emitChange()
    }
  }
  window.addEventListener("storage", handleStorage)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", handleStorage)
  }
}

function updateItems(next: CartItem[]) {
  cachedItems = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
  }
  emitChange()
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isLoading = useSyncExternalStore(
    () => () => {},
    () => false,
    () => true
  )

  const addToCart = useCallback((product: Product, qty = 1) => {
    const current = cachedItems ?? loadCart()
    const existing = current.find((i) => i.productId === product.id)
    if (existing) {
      updateItems(
        current.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + qty } : i
        )
      )
      return
    }
    updateItems([
      ...current,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: qty,
      },
    ])
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    const current = cachedItems ?? loadCart()
    updateItems(current.filter((i) => i.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty < 1) return
    const current = cachedItems ?? loadCart()
    updateItems(
      current.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
    )
  }, [])

  const clearCart = useCallback(() => {
    updateItems([])
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const isEmpty = items.length === 0

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isEmpty,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}
