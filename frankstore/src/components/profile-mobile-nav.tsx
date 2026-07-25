"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, MapPin, Heart, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { profileNavItems, isProfileNavActive } from "@/lib/profile-nav"

export function ProfileMobileNav() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-40 lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex overflow-x-auto">
        {profileNavItems.map((item) => {
          const Icon = item.icon
          const active = isProfileNavActive(pathname, item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 px-3 py-3 text-xs font-medium transition-colors min-w-[64px]",
                active
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.shortLabel}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
