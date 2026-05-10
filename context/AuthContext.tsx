"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { User, UserRole } from "@/lib/types"
import { db } from "@/lib/store"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: { name: string; email: string; password: string; role: UserRole }) => Promise<{ success: boolean; error?: string }>
  googleLogin: (email: string, name: string, picture?: string) => Promise<{ success: boolean; error?: string; isNewUser?: boolean; role?: string }>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(() => {
    const stored = localStorage.getItem("vt_current_user")
    if (stored) {
      const parsed = JSON.parse(stored)
      const fresh = db.users.find(parsed.id)
      if (fresh) {
        setUser(fresh)
        localStorage.setItem("vt_current_user", JSON.stringify(fresh))
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    db.seed()
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const found = db.users.findByEmail(email)
    if (!found) return { success: false, error: "No account found with this email" }
    if (found.password !== password) return { success: false, error: "Incorrect password" }
    setUser(found)
    localStorage.setItem("vt_current_user", JSON.stringify(found))
    return { success: true }
  }

  const signup = async (data: { name: string; email: string; password: string; role: UserRole }) => {
    const existing = db.users.findByEmail(data.email)
    if (existing) return { success: false, error: "An account with this email already exists" }
    const user = db.users.create({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      onboardingComplete: false,
    })
    setUser(user)
    localStorage.setItem("vt_current_user", JSON.stringify(user))
    return { success: true }
  }

  const googleLogin = async (email: string, name: string, picture?: string) => {
    const existing = db.users.findByEmail(email)
    if (existing) {
      setUser(existing)
      localStorage.setItem("vt_current_user", JSON.stringify(existing))
      return { success: true, isNewUser: false, role: existing.role }
    }
    const newUser = db.users.create({
      email,
      password: "",
      name,
      role: "volunteer" as UserRole,
      avatar: picture,
      onboardingComplete: false,
    })
    setUser(newUser)
    localStorage.setItem("vt_current_user", JSON.stringify(newUser))
    return { success: true, isNewUser: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("vt_current_user")
  }

  const updateUser = (data: Partial<User>) => {
    if (!user) return
    const updated = db.users.update(user.id, data)
    if (updated) {
      setUser(updated)
      localStorage.setItem("vt_current_user", JSON.stringify(updated))
    }
  }

  return (
      <AuthContext.Provider value={{ user, isLoading, login, signup, googleLogin, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
