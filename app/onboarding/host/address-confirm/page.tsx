"use client"

import { useState, useEffect } from "react"
import { OnboardingLayout } from "@/components/onboarding/host/OnboardingLayout"
import { useHostOnboarding } from "@/components/onboarding/host/HostOnboardingContext"

export default function AddressConfirmPage() {
  const { data, updateData, goNext, goBack } = useHostOnboarding()

  const [form, setForm] = useState({
    street: "",
    flat: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    landmark: "",
  })

  // Pre-fill from selected address
  useEffect(() => {
    if (data.address) {
      setForm((prev) => ({
        street: data.address?.street || prev.street,
        flat: data.address?.flat || prev.flat,
        city: data.address?.city || prev.city,
        state: data.address?.state || prev.state,
        country: data.address?.country || prev.country,
        pinCode: data.address?.pinCode || prev.pinCode,
        landmark: data.address?.landmark || prev.landmark,
      }))
    }
  }, [])

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    updateData("address", {
      ...data.address,
      ...form,
    })
    goNext()
  }

  const isValid = form.street && form.city && form.state && form.pinCode

  return (
    <OnboardingLayout
      onNext={handleNext}
      onBack={goBack}
      nextDisabled={!isValid}
    >
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-[640px] mx-auto">
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

            <div className="space-y-4">
              {/* Country (read-only) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6F756F" }}>
                  Country / Region
                </label>
                <div
                  className="w-full h-14 px-5 rounded-2xl border border-[#D9DDD8] bg-[#F9F9F7] flex items-center text-base text-[#6F756F]"
                >
                  {form.country || "India"}
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6F756F" }}>
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => update("street", e.target.value)}
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
                  value={form.flat}
                  onChange={(e) => update("flat", e.target.value)}
                  placeholder="e.g. Apt 4B"
                  className="w-full h-14 px-5 rounded-2xl border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
                />
              </div>

              {/* City, State, PIN */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6F756F" }}>
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="City"
                    className="w-full h-14 px-5 rounded-2xl border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6F756F" }}>
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                    placeholder="State"
                    className="w-full h-14 px-5 rounded-2xl border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6F756F" }}>
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.pinCode}
                    onChange={(e) => update("pinCode", e.target.value)}
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
                  value={form.landmark}
                  onChange={(e) => update("landmark", e.target.value)}
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
