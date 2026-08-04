"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, Flame, Home, LayoutDashboard, LayoutGrid, Menu, Search, Shirt, ShoppingBag, Star, TrendingUp, User, X, type LucideIcon } from "lucide-react"
import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { mainNavLinks } from "@/lib/navigation"

const menuIcons: Record<string, LucideIcon> = {
  "/": Home,
  "/catalogo": LayoutGrid,
  "/catalogo?cat=ropa": Shirt,
  "/catalogo?cat=imperdibles": Flame,
  "/catalogo?cat=coleccion-destacada": Star,
  "/catalogo?cat=mas-vendidos": TrendingUp,
}

export function Header() {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth()

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (query) {
      router.push(`/catalogo?search=${encodeURIComponent(query)}`)
      closeSearch()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background supports-[color:color-mix(in_oklab,red_50%,white)]:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {isSearchOpen && (
          <form
            onSubmit={handleSearch}
            className="absolute inset-0 z-10 flex items-center gap-2 bg-background px-4 sm:px-6 md:hidden"
          >
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <Button type="submit" variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={closeSearch}>
              <X className="h-4 w-4" />
            </Button>
          </form>
        )}

        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Menú principal</SheetTitle>
            <div className="flex h-16 shrink-0 items-center border-b px-6">
              <Link
                href="/"
                onClick={() => setIsMobileOpen(false)}
                className="text-xl font-bold tracking-tight"
              >
                FRANK<span className="text-neon-gray">STORE</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Categorías
              </p>
              <nav className="flex flex-col gap-1.5">
                {mainNavLinks.map((link) => {
                  const Icon = menuIcons[link.href] ?? LayoutGrid
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="group flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                      {link.label}
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  )
                })}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    <LayoutDashboard className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    Panel Admin
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                )}
              </nav>
            </div>
            <div className="border-t px-6 py-4">
              <p className="text-xs text-muted-foreground">
                ¿Necesitás ayuda?{" "}
                <Link
                  href="/contacto"
                  onClick={() => setIsMobileOpen(false)}
                  className="font-medium text-primary hover:underline"
                >
                  Contactanos
                </Link>
              </p>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="text-xl font-bold tracking-tight">
          FRANK<span className="text-neon-gray">STORE</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Panel Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="hidden items-center gap-2 md:flex">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary md:w-56"
                autoFocus
              />
              <Button type="submit" variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={closeSearch}>
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>
          )}
          {!isLoading && isAuthenticated && user ? (
            <Button variant="ghost" size="icon" asChild>
              <Link href={isAdmin ? "/admin" : "/profile"}>
                <Avatar size="sm">
                  <AvatarFallback className="text-xs font-medium">
                    {user.name.charAt(0)}
                    {user.lastName?.charAt(0) ?? ""}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <User className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/checkout">
              <span className="relative">
                <ShoppingBag className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}