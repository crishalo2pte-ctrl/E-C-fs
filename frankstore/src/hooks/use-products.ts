"use client"

import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"

export function useProducts(filters?: { cat?: string; search?: string; featured?: boolean; bestSeller?: boolean }) {
  const params = new URLSearchParams()
  if (filters?.cat) params.set("cat", filters.cat)
  if (filters?.search) params.set("search", filters.search)
  if (filters?.featured) params.set("featured", "true")
  if (filters?.bestSeller) params.set("bestseller", "true")

  const qs = params.toString()
  const key = qs ? `/api/products?${qs}` : "/api/products"

  const { data, error, isLoading } = useSWR<{ products: import("@/lib/products").Product[] }>(key, fetcher)

  return {
    products: data?.products ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate: () => mutate(key),
  }
}

export function useProduct(id: string) {
  const { data, error, isLoading } = useSWR<import("@/lib/products").Product & { images: string[]; variants: unknown[] }>(
    id ? `/api/products/${id}` : null,
    fetcher
  )

  return {
    product: data,
    isLoading,
    isError: !!error,
    error,
  }
}
