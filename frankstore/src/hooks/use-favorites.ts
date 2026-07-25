"use client"

import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"

export function useFavorites() {
  const { data, error, isLoading } = useSWR<import("@/lib/profile-data").Favorite[]>("/api/favorites", fetcher)

  return {
    favorites: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate: () => mutate("/api/favorites"),
  }
}
