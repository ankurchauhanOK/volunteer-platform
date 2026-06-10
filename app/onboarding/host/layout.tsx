"use client"

import { HostOnboardingProvider } from "@/components/onboarding/host/HostOnboardingContext"

export default function HostOnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <HostOnboardingProvider>
      {children}
    </HostOnboardingProvider>
  )
}
