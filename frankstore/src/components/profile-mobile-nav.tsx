"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { User, Package, MapPin, Heart, Settings, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { profileNavItems, isProfileNavActive } from "@/lib/profile-nav"

export function ProfileMobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <div className="sticky top-16 z-40 lg:hidden border-b bg-background supports-[color:color-mix(in_oklab,red_50%,white)]:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex overflow-x-auto">
        {profileNavItems.map((item) => {
          const Icon = item.icon
          const active = isProfileNavActive(pathname, item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-colors min-w-[52px]",
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
        <button
          onClick={handleLogout}
          className="flex flex-1 flex-col items-center gap-1 px-2 py-3 text-xs font-medium text-muted-foreground transition-colors min-w-[52px] hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>
      </nav>
    </div>
  )
}
