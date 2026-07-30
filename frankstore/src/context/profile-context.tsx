"use client"

import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode,
} from "react"
import type { UserProfile } from "@/lib/profile-data"

const STORAGE_KEY = "frankstore-profile"

const EMPTY_PROFILE: UserProfile = {
  id: "",
  name: "",
  lastName: "",
  email: "",
  phone: "",
  avatar: "",
  level: "Silver",
  registeredAt: "",
  birthDate: "",
}

const DEFAULT_PROFILE: UserProfile = {
  id: "usr_001",
  name: "Diego",
  lastName: "Ramírez",
  email: "diego@frankstore.com.ar",
  phone: "+54 351 456 7890",
  avatar: "",
  level: "Premium",
  registeredAt: "1 Ene 2026",
  birthDate: "15/06/1992",
}

interface ProfileContextType {
  profile: UserProfile
  updateProfile: (data: Partial<UserProfile>) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  saveProfile: () => void
  isLoaded: boolean
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

function loadProfileFromStorage(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UserProfile) : DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

async function fetchProfileFromAPI(): Promise<UserProfile | null> {
  try {
    const res = await fetch("/api/profile", { credentials: "include" })
    if (!res.ok) return null
    const data = await res.json()
    return {
      id: data.id,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? "",
      avatar: data.avatar ?? "",
      level: data.level ?? "Silver",
      registeredAt: data.registeredAt ?? "",
      birthDate: data.birthDate ?? "",
    }
  } catch {
    return null
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setProfile(EMPTY_PROFILE)
        setIsLoaded(true)
        return
      }
      const apiProfile = await fetchProfileFromAPI()
      if (apiProfile) {
        setProfile(apiProfile)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apiProfile))
      } else {
        setProfile(loadProfileFromStorage())
      }
      setIsLoaded(true)
    }
    load()

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "auth_token") load()
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    }
  }, [profile, isLoaded])

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }))
  }, [])

  const saveProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          birthDate: profile.birthDate,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setProfile((prev) => ({ ...prev, ...data }))
      }
    } catch {
      // Keep local changes if API fails
    }
    setIsEditing(false)
  }, [profile])

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        isEditing,
        setIsEditing,
        saveProfile,
        isLoaded,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider")
  return ctx
}