"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export function AuthGuard({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.push("/auth/login")
      return
    }
    if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
      router.push("/")
    }
  }, [user, isLoading, router, requiredRole])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  if (!user) return null
  if (requiredRole && user.role !== requiredRole && user.role !== "admin") return null

  return <>{children}</>
}
