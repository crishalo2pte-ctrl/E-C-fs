"use client"

import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"

export function useAddresses() {
  const { data, error, isLoading } = useSWR<import("@/lib/profile-data").Address[]>("/api/addresses", fetcher)

  return {
    addresses: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate: () => mutate("/api/addresses"),
  }
}
