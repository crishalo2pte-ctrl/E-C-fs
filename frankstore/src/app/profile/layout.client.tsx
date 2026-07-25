"use client"

import { ProfileProvider } from "@/context/profile-context"
import { ProfileSidebar } from "@/components/profile-sidebar"
import { ProfileMobileNav } from "@/components/profile-mobile-nav"
import { ReactNode } from "react"

export function ProfileInnerLayout({ children }: { children: ReactNode }) {
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