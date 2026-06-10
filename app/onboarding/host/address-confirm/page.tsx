"use client"

import { OnboardingLayout } from "@/components/onboarding/host/OnboardingLayout"
import { useHostOnboarding } from "@/components/onboarding/host/HostOnboardingContext"

export default function AddressConfirmPage() {
  const { goNext, goBack, isStepValid } = useHostOnboarding()

  return (
    <OnboardingLayout
      onNext={goNext}
      onBack={goBack}
      nextDisabled={!isStepValid()}
    >
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-[640px] mx-auto">
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
              className="text-center mb-3"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "48px",
                fontWeight: 600,
                color: "#0D4F3A",
              }}
            >
              Confirm your address
            </h1>
            <p className="text-center text-sm mb-10" style={{ color: "#6F756F" }}>
              Guests will only receive your exact address after booking confirmation.
            </p>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Country */}
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6F756F" }}>
                  Country / Region
                </label>
                <div className="h-14 px-5 rounded-2xl border border-[#D9DDD8] bg-white flex items-center justify-between">
                  <span className="text-base text-[#1A1A1A]">India - IN</span>
                  <svg className="w-5 h-5 text-[#6F756F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6F756F" }}>
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="Street name and number"
                  className="w-full h-14 px-5 rounded-2xl border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
                />
              </div>

              {/* Flat / House */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6F756F" }}>
                  Flat, House, etc. (if applicable)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apt 4B"
                  className="w-full h-14 px-5 rounded-2xl border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
                />
              </div>

              {/* City, State, PIN */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6F756F" }}>
                    City / Town
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full h-14 px-5 rounded-2xl border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6F756F" }}>
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="State"
                    className="w-full h-14 px-5 rounded-2xl border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6F756F" }}>
                    PIN Code
                  </label>
                  <input
                    type="text"
                    placeholder="Zip / Postal"
                    className="w-full h-14 px-5 rounded-2xl border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
                  />
                </div>
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6F756F" }}>
                  Nearby Landmark (if applicable)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Central Park"
                  className="w-full h-14 px-5 rounded-2xl border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
