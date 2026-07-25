"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  User, Package, MapPin, Heart, Settings, LogOut, ChevronLeft,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { profileData } from "@/lib/profile-data"
import { profileNavItems } from "@/lib/profile-nav"

export function ProfileSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <>
      <div className="hidden lg:flex lg:w-60 lg:flex-col lg:border-r lg:bg-white lg:fixed lg:inset-y-0">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Link href="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            Tienda
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3 py-6">
          <div className="flex flex-col items-center px-4 mb-6">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                {profileData.name.charAt(0)}{profileData.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold text-sm">{profileData.name} {profileData.lastName}</p>
            <p className="text-xs text-muted-foreground">{profileData.email}</p>
            <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {profileData.level}
            </span>
          </div>
          <Separator className="mb-2" />
          <nav className="flex flex-col gap-0.5">
            {profileNavItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href, item.exact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        <div className="border-t p-3">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  )
}
