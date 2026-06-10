"use client"

import { OnboardingLayout } from "@/components/onboarding/host/OnboardingLayout"
import { useHostOnboarding } from "@/components/onboarding/host/HostOnboardingContext"

export default function AddressPage() {
  const { goNext, goBack, isStepValid } = useHostOnboarding()

  return (
    <OnboardingLayout
      onNext={goNext}
      onBack={goBack}
      nextDisabled={!isStepValid()}
    >
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-[820px] mx-auto">
          {/* Modal-style container */}
          <div
            className="w-full p-10"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "32px",
              border: "1px solid #D9DDD8",
            }}
          >
            <h1
              className="text-center mb-8"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "48px",
                fontWeight: 600,
                color: "#0D4F3A",
              }}
            >
              Enter your address
            </h1>

            {/* Search Field */}
            <div className="relative mb-8">
              <div className="flex items-center h-14 px-5 rounded-full border border-[#D9DDD8] bg-[#F9F9F7]">
                <svg className="w-5 h-5 text-[#6F756F] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for your address..."
                  className="flex-1 bg-transparent outline-none text-base text-[#1A1A1A] placeholder-[#6F756F]"
                />
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#6F756F] hover:text-[#1A1A1A]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Suggested Locations */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "#6F756F" }}
              >
                Suggested Locations
              </p>
              <div className="space-y-3">
                {[
                  { title: "Gaur City Mall", address: "Greater Noida West, Gaur City 1, Sector 4, Greater Noida, Uttar Pradesh, India" },
                  { title: "Gaur City 2", address: "Ghaziabad, Uttar Pradesh, India" },
                  { title: "Gaur City 1, Sector 4", address: "Ghaziabad, Uttar Pradesh, India" },
                  { title: "Gaur City Center", address: "Greater Noida West Road, Gaur City 1, Sector 4, Ghaziabad, Uttar Pradesh, India" },
                ].map((location, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#D9DDD8] hover:border-[#0D4F3A] hover:bg-[#F6F4EF] transition-all duration-200 text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F6F4EF] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#0D4F3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-medium text-[#1A1A1A]">{location.title}</p>
                      <p className="text-sm text-[#6F756F]">{location.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
