"use client"

import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"
import type { Payment } from "@/lib/admin-data"

export function useAdminPayments() {
  const { data, error, isLoading } = useSWR<Payment[]>("/api/admin/payments", fetcher)

  return {
    payments: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate: () => mutate("/api/admin/payments"),
  }
}
