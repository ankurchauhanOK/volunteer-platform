"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { User, UserRole } from "@/lib/types"
import { db } from "@/lib/store"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  googleLogin: (email: string, name: string, picture?: string) => Promise<{ success: boolean; error?: string; isNewUser?: boolean; role?: string; onboardingComplete?: boolean }>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  refreshUser: () => void
  deleteAccount: () => void
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

  const googleLogin = async (email: string, name: string, picture?: string) => {
    const existing = db.users.findByEmail(email)
    if (existing) {
      setUser(existing)
      localStorage.setItem("vt_current_user", JSON.stringify(existing))
      return { success: true, isNewUser: false, role: existing.role, onboardingComplete: existing.onboardingComplete }
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

  const deleteAccount = () => {
    if (!user) return
    const userId = user.id
    const role = user.role

    db.users.delete(userId)

    if (role === "host") {
      const profiles = getHostProfiles()
      setItem("hostProfiles", profiles.filter((p: any) => p.userId !== userId))
      const listings = getListings()
      const hostListings = listings.filter((l: any) => l.hostId === userId)
      const listingIds = hostListings.map((l: any) => l.id)
      setItem("listings", listings.filter((l: any) => l.hostId !== userId))
      const apps = getApps()
      setItem("applications", apps.filter((a: any) => a.hostId !== userId && !listingIds.includes(a.listingId)))
    } else {
      const profiles = getVolProfiles()
      setItem("volunteerProfiles", profiles.filter((p: any) => p.userId !== userId))
      const apps = getApps()
      setItem("applications", apps.filter((a: any) => a.volunteerId !== userId))
    }

    const allThreads = getThreads()
    const userThreadIds = allThreads.filter((t: any) => t.participants.includes(userId)).map((t: any) => t.id)
    setItem("threads", allThreads.filter((t: any) => !userThreadIds.includes(t.id)))
    const allMsgs = getMsgs()
    setItem("messages", allMsgs.filter((m: any) => !userThreadIds.includes(m.threadId)))

    const allSaved = getSaved()
    setItem("savedListings", allSaved.filter((s: any) => s.userId !== userId))
    const allNotifs = getNotifs()
    setItem("notifications", allNotifs.filter((n: any) => n.userId !== userId))
    const allReviews = getReviews()
    setItem("reviews", allReviews.filter((r: any) => r.fromUserId !== userId && r.toUserId !== userId))

    logout()
  }

  const getHostProfiles = () => JSON.parse(localStorage.getItem("vt_hostProfiles") || "[]")
  const getVolProfiles = () => JSON.parse(localStorage.getItem("vt_volunteerProfiles") || "[]")
  const getListings = () => JSON.parse(localStorage.getItem("vt_listings") || "[]")
  const getApps = () => JSON.parse(localStorage.getItem("vt_applications") || "[]")
  const getThreads = () => JSON.parse(localStorage.getItem("vt_threads") || "[]")
  const getMsgs = () => JSON.parse(localStorage.getItem("vt_messages") || "[]")
  const getSaved = () => JSON.parse(localStorage.getItem("vt_savedListings") || "[]")
  const getNotifs = () => JSON.parse(localStorage.getItem("vt_notifications") || "[]")
  const getReviews = () => JSON.parse(localStorage.getItem("vt_reviews") || "[]")
  const setItem = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data))

  return (
      <AuthContext.Provider value={{ user, isLoading, login, googleLogin, logout, updateUser, refreshUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
