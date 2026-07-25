"use client"

import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"

export function useProfile() {
  const { data, error, isLoading } = useSWR<import("@/lib/profile-data").UserProfile>("/api/profile", fetcher)

  return {
    profile: data,
    isLoading,
    isError: !!error,
    error,
    mutate: () => mutate("/api/profile"),
  }
}
