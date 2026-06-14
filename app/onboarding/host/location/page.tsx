"use client"

import { OnboardingLayout } from "@/components/onboarding/host/OnboardingLayout"
import { useHostOnboarding } from "@/components/onboarding/host/HostOnboardingContext"

export default function LocationPage() {
  const { data, goNext, goBack, isStepValid } = useHostOnboarding()
  const displayAddress = data.address?.displayName || "Search for your address"

  return (
    <OnboardingLayout
      onNext={goNext}
      onBack={goBack}
      nextDisabled={!isStepValid()}
    >
      <div className="w-full flex flex-col items-center min-h-[calc(100vh-200px)]">
        {/* Title */}
        <div className="text-center mb-6">
          <h1
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "48px",
              fontWeight: 600,
              color: "#0D4F3A",
            }}
          >
            Is the pin in the right spot?
          </h1>
          <p className="text-sm mt-2" style={{ color: "#6F756F" }}>
            Your exact address is only shared with confirmed guests.
          </p>
        </div>

        {/* Map Container */}
        <div
          className="w-full relative overflow-hidden"
          style={{
            maxWidth: "1080px",
            height: "640px",
            borderRadius: "32px",
            border: "1px solid #D9DDD8",
            backgroundColor: "#E8E4DC",
          }}
        >
          {/* Floating Address Pill */}
          <div
            className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-6 py-3 rounded-full flex items-center gap-2"
            style={{
              backgroundColor: "#4A4A4A",
              color: "#FFFFFF",
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="text-sm font-medium">{displayAddress}</span>
          </div>

          {/* Map Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium mb-2" style={{ color: "#6F756F" }}>
                Google Maps Integration
              </p>
              <p className="text-sm" style={{ color: "#6F756F" }}>
                Map will be loaded here with your API key
              </p>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </button>
          </div>

          {/* Centered Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#0D4F3A" }}>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614f-16.5 0z" />
              </svg>
            </div>
            <div className="w-0 h-0 mx-auto" style={{
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: `12px solid #0D4F3A`,
            }} />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
