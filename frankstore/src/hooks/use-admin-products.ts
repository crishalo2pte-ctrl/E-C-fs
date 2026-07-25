"use client"

import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"
import type { Product } from "@/lib/products"

export function useAdminProducts() {
  const { data, error, isLoading } = useSWR<Product[]>("/api/admin/products", fetcher)

  return {
    products: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate: () => mutate("/api/admin/products"),
  }
}
