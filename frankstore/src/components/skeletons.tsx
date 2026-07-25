"use client"

import { cn } from "@/lib/utils"

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded bg-muted", className)}
      {...props}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="group overflow-hidden border-0 bg-card shadow-sm transition-all hover:shadow-md">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="aspect-[4/5] w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="flex h-20 items-center gap-4 rounded-lg bg-muted/30 p-3" />
      ))}
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg border" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg border" />
    </div>
  )
}

export function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg border" />
      ))}
    </div>
  )
}

export function AddressesSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg border" />
      ))}
    </div>
  )
}

export function FavoritesSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function AdminTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg border" />
      ))}
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
  )
}

export function ButtonSkeleton() {
  return <Skeleton className="h-10 w-32 rounded-full" />
}