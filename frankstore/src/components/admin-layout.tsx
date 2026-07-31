"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  FolderTree,
  ChevronLeft,
  LogOut,
  Menu,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/pagos", label: "Pagos", icon: CreditCard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
]

interface AdminSession {
  id: string
  name: string
  email: string
  role: string
}

function getSession(): AdminSession | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("admin_session")
  if (!raw) return null
  try {
    return JSON.parse(atob(raw))
  } catch {
    return null
  }
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [session] = useState<AdminSession | null>(getSession)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login")
    }
  }, [router, pathname])

  const handleLogout = async () => {
    await fetch("/api/login", { method: "DELETE" }).catch(() => {})
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {})
    localStorage.removeItem("admin_session")
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    router.replace("/login")
  }

  if (!session) {
    return <>{children}</>
  }

  const initials = session.name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex min-h-dvh bg-muted/30">
      <aside className="hidden w-64 flex-col border-r bg-background lg:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Link href="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            Tienda
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link href="/admin" className="text-lg font-bold tracking-tight">
            FRANK<span className="text-neon-gray">ADMIN</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
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
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b bg-background px-4 lg:hidden">
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Menú de administración</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center gap-2 border-b px-6">
                  <Link href="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="h-4 w-4" />
                    Tienda
                  </Link>
                  <span className="text-muted-foreground">|</span>
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="text-lg font-bold tracking-tight"
                  >
                    FRANK<span className="text-neon-gray">ADMIN</span>
                  </Link>
                </div>
                <ScrollArea className="flex-1 px-3 py-4">
                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const active = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileNavOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? "bg-primary text-primary-foreground"
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
                <div className="border-t p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{session.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{session.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="mt-3 w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/admin" className="text-lg font-bold tracking-tight">
            FRANK<span className="text-neon-gray">ADMIN</span>
          </Link>
        </header>
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
