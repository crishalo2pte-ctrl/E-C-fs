"use client"

import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"

export interface AdminCategory {
  id: string
  name: string
  slug: string
  image: string | null
  productCount: number
  createdAt: string
}

export function useAdminCategories() {
  const { data, error, isLoading } = useSWR<AdminCategory[]>("/api/admin/categories", fetcher)

  return {
    categories: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate: () => mutate("/api/admin/categories"),
  }
}
