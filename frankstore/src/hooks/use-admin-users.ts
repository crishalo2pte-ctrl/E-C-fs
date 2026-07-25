"use client"

import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"
import type { AdminUser } from "@/lib/admin-data"

export function useAdminUsers() {
  const { data, error, isLoading } = useSWR<AdminUser[]>("/api/admin/users", fetcher)

  return {
    users: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate: () => mutate("/api/admin/users"),
  }
}
