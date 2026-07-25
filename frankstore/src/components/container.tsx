import { ReactNode } from "react"
import { cn } from "@/lib/utils"

const pyClasses = {
  0: "py-0",
  4: "py-4",
  6: "py-6",
  8: "py-8",
  10: "py-10",
  12: "py-12",
  16: "py-16",
  20: "py-20",
} as const

type PyValue = keyof typeof pyClasses

export function Container({
  children,
  className,
  py = 12,
  ...props
}: {
  children: ReactNode
  className?: string
  py?: PyValue
}) {
  return (
    <div
      className={cn(`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${pyClasses[py]}`, className)}
      {...props}
    >
      {children}
    </div>
  )
}