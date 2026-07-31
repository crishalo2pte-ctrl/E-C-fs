"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useProfile } from "@/context/profile-context"
import { profileNavItems, isProfileNavActive } from "@/lib/profile-nav"

export function ProfileCard({ className }: { className?: string }) {
  const { profile } = useProfile()

  return (
    <div className={cn("flex flex-col items-center px-4 mb-6", className)}>
      <Avatar className="h-20 w-20 mb-3">
        <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
          {profile.name.charAt(0)}
          {profile.lastName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <p className="font-semibold text-sm">{profile.name} {profile.lastName}</p>
      <p className="text-xs text-muted-foreground">{profile.email}</p>
      <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
        {profile.level}
      </span>
    </div>
  )
}

export function ProfileNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5">
      {profileNavItems.map((item) => {
        const Icon = item.icon
        const active = isProfileNavActive(pathname, item.href, item.exact)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
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
  )
}
