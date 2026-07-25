import { User, Package, MapPin, Heart, Settings } from "lucide-react"

export const profileNavItems = [
  { href: "/profile", label: "Mi Perfil", shortLabel: "Perfil", icon: User, exact: true },
  { href: "/profile/orders", label: "Mis Pedidos", shortLabel: "Pedidos", icon: Package, exact: false },
  { href: "/profile/addresses", label: "Direcciones", shortLabel: "Direcciones", icon: MapPin, exact: false },
  { href: "/profile/favorites", label: "Favoritos", shortLabel: "Favoritos", icon: Heart, exact: false },
  { href: "/profile/settings", label: "Configuracion", shortLabel: "Config", icon: Settings, exact: false },
]

export function isProfileNavActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname.startsWith(href)
}