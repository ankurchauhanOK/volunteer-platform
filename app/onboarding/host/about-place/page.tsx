"use client"

import { OnboardingLayout } from "@/components/onboarding/host/OnboardingLayout"
import { useHostOnboarding } from "@/components/onboarding/host/HostOnboardingContext"

export default function AboutPlacePage() {
  const { goNext, goBack, isStepValid } = useHostOnboarding()

  return (
    <OnboardingLayout
      onNext={goNext}
      onBack={goBack}
      nextDisabled={!isStepValid()}
    >
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-[1280px] flex items-center justify-between gap-16 px-8">
          {/* Left Side */}
          <div className="flex-1 max-w-[520px]">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: "#0D4F3A" }}
            >
              Step 1
            </p>
            <h1
              className="font-semibold tracking-tight leading-[1.1] mb-6"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "48px",
                color: "#0D4F3A",
              }}
            >
              Tell us about your place
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
              In this step, we will ask about your property type, whether guests book the whole place or just a room, and how many guests can stay.
            </p>
            <div className="flex items-center gap-2" style={{ color: "#6F756F" }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.831a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <span className="text-sm font-medium">Estimated time: 2 minutes</span>
            </div>
          </div>

          {/* Right Side: Illustration */}
          <div className="flex-shrink-0">
            <div
              className="overflow-hidden flex items-center justify-center"
              style={{
                width: "520px",
                height: "520px",
                borderRadius: "40px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #D9DDD8",
              }}
            >
              <div className="text-center">
                <svg
                  className="w-32 h-32 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                  style={{ color: "#D9DDD8" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.375 3.375h.008v.008h-.008v-.008zm0 3.375h.008v.008h-.008v-.008zm0 3.375h.008v.008h-.008v-.008z"
                  />
                </svg>
                <p className="text-sm" style={{ color: "#6F756F" }}>
                  Place illustration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
