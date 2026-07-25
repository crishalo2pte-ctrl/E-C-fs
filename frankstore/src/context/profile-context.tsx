"use client"

import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode,
} from "react"
import type { UserProfile } from "@/lib/profile-data"

const STORAGE_KEY = "frankstore-profile"

const DEFAULT_PROFILE: UserProfile = {
  id: "usr_001",
  name: "Diego",
  lastName: "Ramírez",
  email: "diego@frankstore.co",
  phone: "+57 321 456 7890",
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

function loadProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UserProfile) : DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setProfile(loadProfile())
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    }
  }, [profile, isLoaded])

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }))
  }, [])

  const saveProfile = useCallback(() => {
    setIsEditing(false)
  }, [])

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