"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { ProfileProvider } from "@/context/profile-context"
import { ProfileSidebar } from "@/components/profile-sidebar"
import { ProfileMobileNav } from "@/components/profile-mobile-nav"
import { ReactNode } from "react"

export function ProfileInnerLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading, refreshUser } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?from=/profile")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  if (isLoading) return null

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-[#FAFAFA]">
        <ProfileMobileNav />
        <ProfileSidebar />
        <main className="lg:pl-60">
          <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </ProfileProvider>
  )
}