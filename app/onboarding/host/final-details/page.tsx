"use client"

import { useState } from "react"
import { OnboardingLayout } from "@/components/onboarding/host/OnboardingLayout"
import { useHostOnboarding } from "@/components/onboarding/host/HostOnboardingContext"

const travelExperienceOptions = ["0–1 year", "1–3 years", "3+ years"]
const travelStyleOptions = ["Solo", "With Friends", "Travel Group", "Open To Anything"]
const interestOptions = [
  "Hiking", "Sustainability", "Volunteering", "Storytelling",
  "Wellness", "Photography", "Nature", "Eco Tourism", "Slow Travel",
]

export default function FinalDetailsPage() {
  const { goBack, updateData } = useHostOnboarding()
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    birthday: "",
    gender: "",
    travelExperience: "",
    travelStyle: "",
    interests: [] as string[],
  })

  const toggleInterest = (interest: string) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleFinish = () => {
    updateData("hostDetails", {
      fullName: form.fullName,
      email: form.email,
      birthday: form.birthday,
      gender: form.gender,
    })
    updateData("travelExperience", form.travelExperience)
    updateData("travelStyle", form.travelStyle)
    updateData("interests", form.interests)
    // Navigate to finish or dashboard
  }

  const isValid = form.fullName && form.email && form.gender && form.travelExperience && form.travelStyle

  return (
    <OnboardingLayout
      onBack={goBack}
      nextLabel="Continue Your Journey"
      nextDisabled={!isValid}
      onNext={handleFinish}
    >
      <div className="w-full flex flex-col items-center min-h-[calc(100vh-200px)] py-10">
        <div className="w-full max-w-[720px] mx-auto">
          {/* Title */}
          <h1
            className="font-semibold tracking-tight leading-[1.1] mb-3"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "48px",
              color: "#0D4F3A",
            }}
          >
            Provide a few final details
          </h1>
          <p className="text-base mb-10" style={{ color: "#6F756F", lineHeight: 1.6 }}>
            This information helps build trust with travelers and allows guests to connect with the host more confidently.
          </p>

          {/* Card Container */}
          <div
            className="p-10 mb-10"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "32px",
              border: "1px solid #D9DDD8",
            }}
          >
            <h2
              className="font-semibold tracking-tight mb-6"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "32px",
                color: "#0D4F3A",
              }}
            >
              Tell us something about yourself
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6F756F" }}>
              Guests appreciate knowing who they&apos;re booking with. Add a few details about yourself or your business.
            </p>

            {/* About You Fields */}
            <div className="space-y-3 mb-8">
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Business owner's name"
                className="w-full h-[52px] px-5 rounded-full border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
              />
              <input
                type="tel"
                value={form.birthday}
                onChange={(e) => setForm(prev => ({ ...prev, birthday: e.target.value }))}
                placeholder="Contact number"
                className="w-full h-[52px] px-5 rounded-full border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email address"
                className="w-full h-[52px] px-5 rounded-full border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
              />
              <input
                type="url"
                placeholder="Website (optional)"
                className="w-full h-[52px] px-5 rounded-full border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
              />
              <input
                type="text"
                placeholder="Social media handle (optional)"
                className="w-full h-[52px] px-5 rounded-full border border-[#D9DDD8] bg-white text-base text-[#1A1A1A] placeholder-[#6F756F] outline-none focus:border-[#0D4F3A] transition-all"
              />
            </div>
          </div>

          {/* Travel Experience */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#6F756F" }}>
              Travel Experience
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {travelExperienceOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setForm(prev => ({ ...prev, travelExperience: opt }))}
                  className="px-6 h-12 rounded-full border text-sm font-medium transition-all duration-200"
                  style={{
                    borderColor: form.travelExperience === opt ? "#0D4F3A" : "#D9DDD8",
                    backgroundColor: form.travelExperience === opt ? "#F6F4EF" : "#FFFFFF",
                    color: form.travelExperience === opt ? "#0D4F3A" : "#1A1A1A",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#6F756F" }}>
              Travel Style
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {travelStyleOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setForm(prev => ({ ...prev, travelStyle: opt }))}
                  className="px-6 h-12 rounded-full border text-sm font-medium transition-all duration-200"
                  style={{
                    borderColor: form.travelStyle === opt ? "#0D4F3A" : "#D9DDD8",
                    backgroundColor: form.travelStyle === opt ? "#F6F4EF" : "#FFFFFF",
                    color: form.travelStyle === opt ? "#0D4F3A" : "#1A1A1A",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#6F756F" }}>
              Interests
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className="px-6 h-12 rounded-full border text-sm font-medium transition-all duration-200"
                  style={{
                    borderColor: form.interests.includes(interest) ? "#0D4F3A" : "#D9DDD8",
                    backgroundColor: form.interests.includes(interest) ? "#F6F4EF" : "#FFFFFF",
                    color: form.interests.includes(interest) ? "#0D4F3A" : "#1A1A1A",
                  }}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-3 mb-10">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#6F756F" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="text-sm" style={{ color: "#6F756F" }}>
              Your personal information stays private and is only used for communication and account verification.
            </p>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
