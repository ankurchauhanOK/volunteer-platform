"use client"

import { OnboardingLayout } from "@/components/onboarding/host/OnboardingLayout"
import { useHostOnboarding } from "@/components/onboarding/host/HostOnboardingContext"

export default function WelcomePage() {
  const { goNext } = useHostOnboarding()

  return (
    <OnboardingLayout
      showFooter={false}
      showHeader={true}
    >
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-[1280px] flex items-center justify-between gap-16 px-8">
          {/* Left Side: Text Content */}
          <div className="flex-1 max-w-[560px]">
            <h1
              className="font-semibold tracking-tight leading-[1.1] mb-6"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "64px",
                color: "#0D4F3A",
              }}
            >
              Start hosting meaningful stays.
            </h1>
            <p
              className="leading-relaxed mb-10"
              style={{
                fontFamily: "var(--font-sans), Inter, sans-serif",
                fontSize: "18px",
                color: "#6F756F",
                lineHeight: 1.6,
              }}
            >
              Create your Voluntree listing and welcome mindful travellers from around the world.
            </p>
            <button
              onClick={goNext}
              className="h-14 px-10 rounded-full text-base font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: "#0D4F3A",
                color: "#FFFFFF",
                borderRadius: "999px",
              }}
            >
              Get Started
            </button>
          </div>

          {/* Right Side: Hero Image */}
          <div className="flex-shrink-0">
            <div
              className="overflow-hidden"
              style={{
                width: "560px",
                height: "560px",
                borderRadius: "40px",
                background: "linear-gradient(135deg, #1a3a2f 0%, #2d5a3f 30%, #4a7a5a 60%, #6a9a7a 100%)",
                position: "relative",
              }}
            >
              {/* Placeholder nature illustration - replace with actual image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-32 h-32 mx-auto mb-4 opacity-40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                    style={{ color: "#FFFFFF" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.375 3.375h.008v.008h-.008v-.008zm0 3.375h.008v.008h-.008v-.008zm0 3.375h.008v.008h-.008v-.008z"
                    />
                  </svg>
                  <p
                    className="text-sm opacity-50"
                    style={{ color: "#FFFFFF" }}
                  >
                    Hero Image Placeholder
                  </p>
                  <p
                    className="text-xs opacity-30 mt-1"
                    style={{ color: "#FFFFFF" }}
                  >
                    Replace with your property image
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
