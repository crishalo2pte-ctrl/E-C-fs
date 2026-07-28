"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  ChevronLeft,
  LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
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
  const [session, setSession] = useState<AdminSession | null>(getSession)

  useEffect(() => {
    const s = getSession()
    setSession(s)

    if (s && pathname === "/admin/login") {
      router.replace("/admin")
    } else if (!s && pathname !== "/admin/login") {
      router.replace("/admin/login")
    }
  }, [router, pathname])

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {})
    localStorage.removeItem("admin_session")
    router.replace("/admin/login")
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
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
    <div className="flex min-h-screen bg-muted/30">
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
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
            </Avatar>
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
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6 lg:hidden">
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
