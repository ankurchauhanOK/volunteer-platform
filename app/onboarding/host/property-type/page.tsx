"use client"

import { useState } from "react"
import { OnboardingLayout } from "@/components/onboarding/host/OnboardingLayout"
import { useHostOnboarding } from "@/components/onboarding/host/HostOnboardingContext"

const propertyTypes = [
  { value: "homestay", label: "Homestay", icon: "🏡" },
  { value: "hostel", label: "Hostel", icon: "🏨" },
  { value: "farm-stay", label: "Farm Stay", icon: "🌾" },
  { value: "eco-lodge", label: "Eco Lodge", icon: "🌿" },
  { value: "retreat-center", label: "Retreat Center", icon: "🧘" },
  { value: "guest-house", label: "Guest House", icon: "🏠" },
  { value: "community-project", label: "Community Project", icon: "🤝" },
  { value: "coworking-coliving", label: "Coworking / Coliving", icon: "💻" },
  { value: "other", label: "Other", icon: "✨" },
]

export default function PropertyTypePage() {
  const { goNext, goBack, updateData, isStepValid } = useHostOnboarding()
  const [selected, setSelected] = useState<string>("")

  const handleSelect = (value: string) => {
    setSelected(value)
    updateData("propertyType", value)
  }

  return (
    <OnboardingLayout
      onNext={goNext}
      onBack={goBack}
      nextDisabled={!selected}
    >
      <div className="w-full flex flex-col items-center min-h-[calc(100vh-200px)]">
        {/* Title */}
        <div className="text-center mb-10">
          <h1
            className="font-semibold tracking-tight leading-[1.1]"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "48px",
              color: "#0D4F3A",
              maxWidth: "600px",
            }}
          >
            Which of these best describes your place?
          </h1>
          <p className="text-sm mt-3" style={{ color: "#6F756F" }}>
            Choose the option that best matches your stay or space.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-4 max-w-[900px] w-full">
          {propertyTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleSelect(type.value)}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all duration-200 hover:shadow-md"
              style={{
                borderColor: selected === type.value ? "#0D4F3A" : "#D9DDD8",
                backgroundColor: selected === type.value ? "#F6F4EF" : "#FFFFFF",
                minHeight: "140px",
              }}
            >
              <span className="text-3xl">{type.icon}</span>
              <span
                className="text-sm font-medium"
                style={{
                  color: selected === type.value ? "#0D4F3A" : "#1A1A1A",
                }}
              >
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  )
}
