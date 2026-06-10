"use client"

import { useState, useEffect, createContext, useContext, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export interface HostOnboardingData {
  // Page 2-3: Address
  address?: {
    country?: string
    street?: string
    flat?: string
    city?: string
    state?: string
    pinCode?: string
    landmark?: string
  }
  // Page 4: Location
  location?: {
    lat: number
    lng: number
    address: string
  }
  // Page 5: About Place
  aboutPlace?: {
    description?: string
  }
  // Page 6: Property Type
  propertyType?: string
  // Page 7: Property Name
  propertyName?: string
  // Page 8: Final Details
  hostDetails?: {
    fullName?: string
    email?: string
    birthday?: string
    gender?: string
  }
  travelExperience?: string
  travelStyle?: string
  interests?: string[]
}

interface HostOnboardingContextType {
  data: HostOnboardingData
  currentStep: number
  totalSteps: number
  updateData: (key: keyof HostOnboardingData, value: any) => void
  goToStep: (step: number) => void
  goNext: () => void
  goBack: () => void
  saveAndExit: () => void
  isStepValid: () => boolean
}

const HostOnboardingContext = createContext<HostOnboardingContextType | null>(null)

const STORAGE_KEY = "vt_onboarding_host_v2"

const pageRoutes = [
  "/onboarding/host/welcome",
  "/onboarding/host/address",
  "/onboarding/host/address-confirm",
  "/onboarding/host/location",
  "/onboarding/host/about-place",
  "/onboarding/host/property-type",
  "/onboarding/host/property-name",
  "/onboarding/host/final-details",
]

export function HostOnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const [data, setData] = useState<HostOnboardingData>(() => {
    if (typeof window === "undefined") return {}
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Cross-user safety
        if (parsed.userId && user && parsed.userId !== user.id) {
          localStorage.removeItem(STORAGE_KEY)
          return {}
        }
        return parsed.data || {}
      } catch {}
    }
    return {}
  })

  const currentStep = pageRoutes.indexOf(pathname)
  const totalSteps = pageRoutes.length

  const save = useCallback((updatedData: HostOnboardingData) => {
    if (!user) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      userId: user.id,
      data: updatedData,
      lastUpdated: new Date().toISOString(),
    }))
  }, [user])

  const updateData = useCallback((key: keyof HostOnboardingData, value: any) => {
    setData(prev => {
      const next = { ...prev, [key]: value }
      save(next)
      return next
    })
  }, [save])

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < pageRoutes.length) {
      router.push(pageRoutes[step])
    }
  }, [router])

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      router.push(pageRoutes[currentStep + 1])
    }
  }, [currentStep, totalSteps, router])

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      router.push(pageRoutes[currentStep - 1])
    }
  }, [currentStep, router])

  const saveAndExit = useCallback(() => {
    save(data)
    router.push("/host/dashboard")
  }, [save, data, router])

  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 1: // Address
        return !!data.address?.street && !!data.address?.city
      case 2: // Address Confirm
        return !!data.address?.street && !!data.address?.city && !!data.address?.state && !!data.address?.pinCode
      case 3: // Location
        return !!data.location?.lat && !!data.location?.lng
      case 4: // About Place
        return true
      case 5: // Property Type
        return !!data.propertyType
      case 6: // Property Name
        return !!data.propertyName && data.propertyName.trim().length > 0
      case 7: // Final Details
        return !!data.hostDetails?.fullName && !!data.hostDetails?.email
      default:
        return true
    }
  }, [currentStep, data])

  return (
    <HostOnboardingContext.Provider
      value={{
        data,
        currentStep,
        totalSteps,
        updateData,
        goToStep,
        goNext,
        goBack,
        saveAndExit,
        isStepValid,
      }}
    >
      {children}
    </HostOnboardingContext.Provider>
  )
}

export function useHostOnboarding() {
  const context = useContext(HostOnboardingContext)
  if (!context) {
    throw new Error("useHostOnboarding must be used within HostOnboardingProvider")
  }
  return context
}
