"use client"

import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  lastName: string
  email: string
  role: string
  level?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userData: User) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      const raw = localStorage.getItem("user_data")
      if (raw) {
        try {
          setUser(JSON.parse(raw))
        } catch {
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user_data")
        }
      }
    }
    setIsLoading(false)

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "auth_token" || e.key === "user_data") {
        const token = localStorage.getItem("auth_token")
        if (token) {
          const raw = localStorage.getItem("user_data")
          if (raw) {
            try {
              setUser(JSON.parse(raw))
              return
            } catch {

            }
          }
        }
        setUser(null)
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("user_data", JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch("/api/login", { method: "DELETE" })
    } catch {

    }
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    localStorage.removeItem("admin_session")
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      setUser(null)
      return
    }
    try {
      const res = await fetch("/api/login", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        if (data.token) {
          localStorage.setItem("auth_token", data.token)
        }
        if (data.user) {
          const userData: User = {
            id: data.user.id,
            name: data.user.name,
            lastName: data.user.lastName,
            email: data.user.email,
            role: data.user.role || "user",
            level: data.user.level,
            avatar: data.user.avatar,
          }
          localStorage.setItem("user_data", JSON.stringify(userData))
          setUser(userData)
          return
        }
      }
      const resProfile = await fetch("/api/profile", { credentials: "include" })
      if (resProfile.ok) {
        const data = await resProfile.json()
        const userData: User = {
          id: data.id,
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          role: data.role || "user",
          level: data.level,
          avatar: data.avatar,
        }
        localStorage.setItem("user_data", JSON.stringify(userData))
        setUser(userData)
      } else if (resProfile.status === 401) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_data")
        setUser(null)
      }
    } catch {

    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
