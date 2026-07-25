"use client"

import { Badge } from "@/components/ui/badge"
import { orderStatusConfig } from "@/lib/status-config"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = orderStatusConfig[status as keyof typeof orderStatusConfig] || orderStatusConfig.pendiente
  return (
    <Badge variant="secondary" className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${config.color}`}>
      {config.label}
    </Badge>
  )
}