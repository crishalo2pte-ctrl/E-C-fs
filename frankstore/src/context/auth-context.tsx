"use client"

import {
  createContext, useContext, useCallback, useSyncExternalStore,
  type ReactNode,
} from "react"

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

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

let cachedUser: User | null | undefined
let cachedToken: string | null | undefined

function getSnapshot(): User | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem("auth_token")
  if (token === cachedToken && cachedUser !== undefined) {
    return cachedUser
  }
  cachedToken = token
  const raw = localStorage.getItem("user_data")
  if (!token || !raw) {
    cachedUser = null
  } else {
    try {
      cachedUser = JSON.parse(raw) as User
    } catch {
      cachedUser = null
    }
  }
  return cachedUser
}

function getServerSnapshot(): User | null {
  return null
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  const handleStorage = (e: StorageEvent) => {
    if (e.key === "auth_token" || e.key === "user_data" || e.key === null) {
      cachedToken = undefined
      cachedUser = undefined
      emitChange()
    }
  }
  window.addEventListener("storage", handleStorage)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", handleStorage)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isLoading = useSyncExternalStore(
    () => () => {},
    () => false,
    () => true
  )

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("user_data", JSON.stringify(userData))
    cachedToken = token
    cachedUser = userData
    emitChange()
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch("/api/login", { method: "DELETE" })
    } catch {

    }
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    localStorage.removeItem("admin_session")
    cachedToken = undefined
    cachedUser = null
    emitChange()
  }, [])

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      cachedToken = undefined
      cachedUser = null
      emitChange()
      return
    }
    try {
      const res = await fetch("/api/login", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        if (data.token) {
          localStorage.setItem("auth_token", data.token)
          cachedToken = data.token
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
          cachedUser = userData
          emitChange()
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
        cachedUser = userData
        emitChange()
      } else if (resProfile.status === 401) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_data")
        cachedToken = undefined
        cachedUser = null
        emitChange()
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
