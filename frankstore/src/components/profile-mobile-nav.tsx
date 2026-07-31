"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, LogOut, ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { profileNavItems, isProfileNavActive } from "@/lib/profile-nav"
import { ProfileCard, ProfileNavLinks } from "@/components/profile-nav-panel"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function ProfileMobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleLogout = async () => {
    setIsDrawerOpen(false)
    await logout()
    router.push("/login")
  }

  return (
    <div className="sticky top-16 z-40 lg:hidden border-b bg-background supports-[color:color-mix(in_oklab,red_50%,white)]:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-stretch">
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Abrir menú"
              className="flex shrink-0 items-center justify-center self-stretch border-r px-4 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Menú de perfil</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex h-16 shrink-0 items-center border-b px-6">
                <Link
                  href="/"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Tienda
                </Link>
              </div>
              <ScrollArea className="flex-1 px-3 py-6">
                <ProfileCard className="mb-2" />
                <Separator className="mb-4" />
                <ProfileNavLinks onNavigate={() => setIsDrawerOpen(false)} />
              </ScrollArea>
              <div className="border-t p-3">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <nav className="flex flex-1 overflow-x-auto">
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
    </div>
  )
}
