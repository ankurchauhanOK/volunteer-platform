"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export function AuthGuard({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.push("/auth/login")
      return
    }
    if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
      router.push("/")
      return
    }
    // Block un-onboarded users from every page except onboarding and auth flows
    if (!user.onboardingComplete) {
      const onboardingPath = user.role === "host" ? "/onboarding/host" : "/onboarding/volunteer"
      if (pathname !== onboardingPath && !pathname.startsWith("/auth/")) {
        router.replace("/auth/select-role")
      }
    }
  }, [user, isLoading, router, pathname, requiredRole])

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
