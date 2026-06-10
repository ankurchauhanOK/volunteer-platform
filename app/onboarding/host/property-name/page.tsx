"use client"

import { useState } from "react"
import { OnboardingLayout } from "@/components/onboarding/host/OnboardingLayout"
import { useHostOnboarding } from "@/components/onboarding/host/HostOnboardingContext"

export default function PropertyNamePage() {
  const { goNext, goBack, updateData } = useHostOnboarding()
  const [name, setName] = useState("")

  const handleNext = () => {
    if (name.trim()) {
      updateData("propertyName", name.trim())
      goNext()
    }
  }

  return (
    <OnboardingLayout
      onNext={handleNext}
      onBack={goBack}
      nextDisabled={!name.trim()}
    >
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-[1280px] flex items-center justify-between gap-16 px-8">
          {/* Left Side */}
          <div className="flex-1 max-w-[480px]">
            <h1
              className="font-semibold tracking-tight leading-[1.1] mb-4"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "48px",
                color: "#0D4F3A",
              }}
            >
              What&apos;s your property called?
            </h1>
            <p
              className="leading-relaxed mb-8"
              style={{
                fontFamily: "var(--font-sans), Inter, sans-serif",
                fontSize: "18px",
                color: "#6F756F",
                lineHeight: 1.6,
              }}
            >
              Give your place a name guests will remember.
            </p>

            {/* Input */}
            <div className="relative mb-4">
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F756F]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614f-16.5 0z" />
              </svg>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your property name"
                className="w-full h-14 pl-14 pr-5 rounded-full border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
              />
            </div>
            <p className="text-xs" style={{ color: "#6F756F" }}>
              Make it short and relevant to your space.
            </p>
          </div>

          {/* Right Side: Image */}
          <div className="flex-shrink-0">
            <div
              className="overflow-hidden relative"
              style={{
                width: "560px",
                height: "560px",
                borderRadius: "40px",
                background: "linear-gradient(135deg, #1a3a2f 0%, #2d5a3f 30%, #4a7a5a 60%, #6a9a7a 100%)",
              }}
            >
              {/* Property Preview Label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm">
                <span className="text-sm font-medium" style={{ color: "#0D4F3A" }}>
                  Property Preview
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
