"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, LogOut } from "lucide-react"

import { useAuth } from "@/context/auth-context"
import { ProfileCard, ProfileNavLinks } from "@/components/profile-nav-panel"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function ProfileSidebar() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

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
          <ProfileCard className="mb-2" />
          <Separator className="mb-4" />
          <ProfileNavLinks />
        </ScrollArea>
        <div className="border-t p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  )
}
