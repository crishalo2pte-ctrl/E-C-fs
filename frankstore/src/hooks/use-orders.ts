"use client"

import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"

export function useOrders() {
  const { data, error, isLoading } = useSWR<import("@/lib/profile-data").Order[]>("/api/orders", fetcher)

  return {
    orders: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate: () => mutate("/api/orders"),
  }
}
