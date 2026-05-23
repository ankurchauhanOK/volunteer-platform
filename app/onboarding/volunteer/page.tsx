"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Providers } from "@/components/Providers"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { db } from "@/lib/store"
import { StepLayout } from "@/components/onboarding/StepLayout"
import { PromptPersonalityFlow } from "@/components/onboarding/PromptPersonalityFlow"
import type { PromptAnswer } from "@/lib/types"

const TOTAL_STEPS = 6

interface OnboardingForm {
  step: number
  userId?: string
  fullName: string
  email: string
  birthDay: string
  birthMonth: string
  birthYear: string
  gender: string
  travelDuration: string
  travelCompanion: string
  languages: string[]
  qualification: string
  interests: string[]
  skills: string[]
  talentAreas: string[]
  otherSkill: string
  hobbies: string[]
  hobbyRepresentation: string
  hobbyDescription: string
  hobbyProofUrl: string
  photos: string[]
  bio: string
  preferredDestinations: string[]
  travelType: string
  preferredEnvironment: string[]
  preferredStayType: string[]
  soloOrGroup: string
  travelStyle: string
  experienceLevel: string
  remoteWork: boolean
  emergencyName: string
  emergencyPhone: string
  emergencyRelation: string
  emergencyNotes: string
  medicalConsiderations: string
  specialRequirements: string
  communityGuidelinesAgreed: boolean
  respectfulConductAgreed: boolean
  promptAnswers: PromptAnswer[]
}

const defaultForm: OnboardingForm = {
  step: 0,
  fullName: "", email: "", birthDay: "", birthMonth: "", birthYear: "",
  gender: "", travelDuration: "", travelCompanion: "",
  languages: [], qualification: "",
  interests: [], skills: [], talentAreas: [], otherSkill: "",
  hobbies: [], hobbyRepresentation: "", hobbyDescription: "", hobbyProofUrl: "", photos: [], bio: "",
  preferredDestinations: [], travelType: "", preferredEnvironment: [],
  preferredStayType: [], soloOrGroup: "",
  travelStyle: "", experienceLevel: "", remoteWork: false,
  emergencyName: "", emergencyPhone: "", emergencyRelation: "",
  emergencyNotes: "", medicalConsiderations: "", specialRequirements: "",
  communityGuidelinesAgreed: false, respectfulConductAgreed: false,
  promptAnswers: [],
}

function calcCompleteness(form: OnboardingForm): number {
  const fields = [
    form.fullName, form.email, form.birthDay, form.gender,
    form.travelDuration, form.travelCompanion,
    form.interests.length > 0,
    form.photos.filter(Boolean).length >= 2,
    form.bio.length > 10,
    form.promptAnswers.length >= 3,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}



const hobbyIcons: Record<string, string> = {
  trekking: "🏔️", photography: "📸", yoga: "🧘", cooking: "🍳",
  music: "🎵", reading: "📖", writing: "✍️", dancing: "💃",
  meditation: "🧘", "film making": "🎬", "bird watching": "🐦",
  rafting: "🛶", sketching: "✏️", painting: "🎨", gardening: "🌱",
  journaling: "📓", "travel storytelling": "🗺️", pottery: "🏺",
  calligraphy: "🖋️", cycling: "🚴", swimming: "🏊", surfing: "🏄",
}

const destIcons: Record<string, string> = {
  "Himachal Pradesh": "🏔️", Uttarakhand: "🌲", Kerala: "🌴", Goa: "🏖️",
  Rajasthan: "🏰", Sikkim: "🏔️", Ladakh: "⛰️", Karnataka: "🌳",
  "Tamil Nadu": "🏛️", Maharashtra: "🏙️", Meghalaya: "🌧️",
  "Andaman Islands": "🏝️", Haryana: "🌾", Punjab: "🌾", "Delhi NCR": "🏛️",
}

export default function VolunteerOnboardingPage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [interestSearch, setInterestSearch] = useState("")
  const [form, setForm] = useState<OnboardingForm>(() => {
    if (typeof window === "undefined") return defaultForm
    const saved = localStorage.getItem("vt_onboarding_volunteer")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return { ...defaultForm, ...parsed }
      } catch {}
    }
    return defaultForm
  })
  const [step, setStepState] = useState(form.step)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const completeness = useMemo(() => calcCompleteness(form), [form])
  const bioWordCount = useMemo(() => form.bio.trim().length > 0 ? form.bio.trim().split(/\s+/).length : 0, [form.bio])

  const setStep = useCallback((s: number) => {
    setStepState(s)
    setForm(prev => ({ ...prev, step: s }))
  }, [])

  useEffect(() => {
    if (user) {
      // If saved state belongs to a different user, reset to step 0
      if (form.userId && form.userId !== user.id) {
        localStorage.removeItem("vt_onboarding_volunteer")
        setForm(defaultForm)
        setStepState(0)
        return
      }
      // Prefill from profile setup localStorage if available
      let setupData: { firstName?: string; photos?: string[]; interests?: string[] } = {}
      if (typeof window !== "undefined") {
        const setup = localStorage.getItem("vt_profile_setup")
        if (setup) {
          try {
            setupData = JSON.parse(setup)
          } catch {}
        }
      }
      const nameParts = (user.name || setupData.firstName || "").split(" ")
      setForm(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || setupData.firstName || "",
        email: prev.email || user.email || "",
        hobbies: prev.hobbies.length > 0 ? prev.hobbies : (setupData.interests || []),
      }))
    }
  }, [user, form.userId])

  const save = useCallback((updated: OnboardingForm) => {
    if (!user) return
    localStorage.setItem("vt_onboarding_volunteer", JSON.stringify({ ...updated, userId: user.id }))
  }, [user])

  const update = <K extends keyof OnboardingForm>(key: K, value: OnboardingForm[K]) => {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      save(next)
      return next
    })
  }

  const handleContinue = () => {
    save(form)
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSkip = () => {
    save(form)
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)
    save(form)

    db.volunteerProfiles.upsert({
      userId: user.id,
      gender: form.gender || undefined,
      country: "India",
      bio: form.bio || form.hobbyDescription || undefined,
      languages: form.languages,
      interests: form.interests,
      skills: form.skills,
      preferredDestinations: form.preferredDestinations,
      travelStyle: form.travelStyle || undefined,
      travelExperience: form.experienceLevel || undefined,
      emergencyContact: form.emergencyName
        ? { name: form.emergencyName, phone: form.emergencyPhone, relation: form.emergencyRelation }
        : undefined,
      profileCompleteness: completeness,
      qualification: form.qualification || undefined,
      talentAreas: form.talentAreas,
      hobbies: form.hobbies,
      hobbyRepresentation: form.hobbyRepresentation || undefined,
      hobbyDescription: form.hobbyDescription || undefined,
      hobbyProofUrl: form.hobbyProofUrl || undefined,
      travelType: form.travelType || undefined,
      preferredEnvironment: form.preferredEnvironment,
      preferredStayType: form.preferredStayType,
      experienceLevel: form.experienceLevel || undefined,
      remoteWork: form.remoteWork || undefined,
      emergencyNotes: form.emergencyNotes || undefined,
      medicalConsiderations: form.medicalConsiderations || undefined,
      specialRequirements: form.specialRequirements || undefined,
      communityGuidelinesAgreed: form.communityGuidelinesAgreed || undefined,
      respectfulConductAgreed: form.respectfulConductAgreed || undefined,
      onboardingStep: step,
      promptAnswers: form.promptAnswers,
    })

    db.users.update(user.id, {
      onboardingComplete: true,
    })
    localStorage.removeItem("vt_onboarding_volunteer")
    refreshUser()
    setLoading(false)
    router.push("/volunteer/dashboard")
  }

  const renderStep = () => {
    switch (step) {
      case 0: return renderBasicDetails()
      case 1: return renderInterests()
      case 2: return renderProfileIntro()
      case 3: return renderPhotoUpload()
      case 4: return renderBio()
      case 5: return (
        <PromptPersonalityFlow
          answers={form.promptAnswers}
          onAnswersChange={(answers) => update("promptAnswers", answers)}
          onComplete={handleContinue}
          onBackToPreviousStep={() => setStep(step - 1)}
        />
      )
      default: return null
    }
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const travelDurationOptions = ["0-1 year", "1-3 year", "3 year +"]
  const travelCompanionOptions = ["Solo", "With friends", "With a travel group", "I'm open to anything"]

  const renderBasicDetails = () => (
    <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Editorial Header */}
      <div className="text-center mb-12 md:mb-16">
        <h1
          className="font-tanker text-[#234232] leading-[1.08] tracking-tight mb-4 text-balance"
          style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
        >
          Tell us about yourself
        </h1>
        <p className="text-base text-[#6F8B78] max-w-lg mx-auto leading-relaxed">
          Help us personalize your volunteering journey.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-10 md:space-y-12">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-[#234232] uppercase tracking-wider mb-2.5">
            Name
          </label>
          <input
            type="text"
            value={form.fullName}
            onChange={e => update("fullName", e.target.value)}
            placeholder="Your full name"
            className="w-full h-12 px-4 rounded-xl bg-[#E8F1EA] border border-[#7FA58A] text-[#234232] placeholder-[#6F8B78] focus:outline-none focus:border-[#5A8A6B] focus:ring-1 focus:ring-[#5A8A6B]/30 transition-all duration-250"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#234232] uppercase tracking-wider mb-2.5">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => update("email", e.target.value)}
            placeholder="your@email.com"
            className="w-full h-12 px-4 rounded-xl bg-[#E8F1EA] border border-[#7FA58A] text-[#234232] placeholder-[#6F8B78] focus:outline-none focus:border-[#5A8A6B] focus:ring-1 focus:ring-[#5A8A6B]/30 transition-all duration-250"
          />
        </div>

        {/* Birthday */}
        <div>
          <label className="block text-xs font-semibold text-[#234232] uppercase tracking-wider mb-2.5">
            Birthday
          </label>
          <div className="flex gap-3">
            <select
              value={form.birthMonth}
              onChange={e => update("birthMonth", e.target.value)}
              className="h-12 px-3 rounded-xl bg-[#E8F1EA] border border-[#7FA58A] text-[#234232] focus:outline-none focus:border-[#5A8A6B] focus:ring-1 focus:ring-[#5A8A6B]/30 transition-all duration-250 appearance-none flex-1 min-w-0"
            >
              <option value="">Month</option>
              {months.map((m, i) => (
                <option key={m} value={String(i + 1)}>{m}</option>
              ))}
            </select>
            <select
              value={form.birthDay}
              onChange={e => update("birthDay", e.target.value)}
              className="h-12 px-3 rounded-xl bg-[#E8F1EA] border border-[#7FA58A] text-[#234232] focus:outline-none focus:border-[#5A8A6B] focus:ring-1 focus:ring-[#5A8A6B]/30 transition-all duration-250 appearance-none w-20"
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
              ))}
            </select>
            <select
              value={form.birthYear}
              onChange={e => update("birthYear", e.target.value)}
              className="h-12 px-3 rounded-xl bg-[#E8F1EA] border border-[#7FA58A] text-[#234232] focus:outline-none focus:border-[#5A8A6B] focus:ring-1 focus:ring-[#5A8A6B]/30 transition-all duration-250 appearance-none w-24"
            >
              <option value="">Year</option>
              {Array.from({ length: 60 }, (_, i) => {
                const year = new Date().getFullYear() - 16 - i
                return <option key={year} value={String(year)}>{year}</option>
              })}
            </select>
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-semibold text-[#234232] uppercase tracking-wider mb-3">
            Gender
          </label>
          <div className="flex flex-wrap gap-2.5">
            {["Man", "Woman", "Non-binary", "More +"].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => update("gender", g)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  form.gender === g
                    ? "bg-[#234232] text-[#F7F4EE]"
                    : "bg-transparent text-[#234232] border border-[#7FA58A] hover:border-[#5A8A6B]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Duration */}
        <div>
          <label className="block text-xs font-semibold text-[#234232] uppercase tracking-wider mb-3">
            I have been travelling for
          </label>
          <div className="flex flex-wrap gap-2.5">
            {travelDurationOptions.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => update("travelDuration", opt)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  form.travelDuration === opt
                    ? "bg-[#234232] text-[#F7F4EE]"
                    : "bg-transparent text-[#234232] border border-[#7FA58A] hover:border-[#5A8A6B]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Companion */}
        <div>
          <label className="block text-xs font-semibold text-[#234232] uppercase tracking-wider mb-3">
            I usually travel
          </label>
          <div className="flex flex-wrap gap-2.5">
            {travelCompanionOptions.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => update("travelCompanion", opt)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  form.travelCompanion === opt
                    ? "bg-[#234232] text-[#F7F4EE]"
                    : "bg-transparent text-[#234232] border border-[#7FA58A] hover:border-[#5A8A6B]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <button
            onClick={handleContinue}
            disabled={!form.fullName || !form.email}
            className="w-full h-14 rounded-full bg-[#234232] text-[#F7F4EE] text-base font-semibold shadow-[0_4px_14px_rgba(35,66,50,0.25)] hover:shadow-[0_6px_20px_rgba(35,66,50,0.35)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_14px_rgba(35,66,50,0.25)] transition-all duration-300"
          >
            Continue Your Journey
          </button>
        </div>
      </div>
    </div>
  )

  const allInterestOptions = [
    "Photography", "Filmmaking", "Content creation", "Social media",
    "Blogging", "Writing", "Digital marketing", "Graphic design",
    "Website designing", "Video editing", "Video making", "Music",
    "Dance", "Painting & drawing", "Art", "Reading",
    "Podcasts", "Fashion & style", "Cooking", "Baking",
    "Cooking classes", "Yoga", "Meditation", "Wellness",
    "Sports", "Hiking", "Cycling", "Trekking",
    "Camping", "Adventure activities", "Travel", "Solo travel",
    "Cultural exchange", "Nature", "Environmentalism", "Eco projects",
    "Gardening", "Farming", "Agricultural skills", "Animal care",
    "Teaching", "Language learning", "Community management", "Hospitality",
    "Front desk management", "Trip leading", "Surfing", "Swimming",
    "Rafting", "Bird watching", "Crafts", "DIY projects",
    "Pottery", "Calligraphy", "Journaling", "Technology",
    "Movies", "Theater", "History", "Festivals",
    "Volunteering", "Storytelling", "Travel storytelling", "Creative arts",
    "Content strategy", "Public speaking", "Event management", "Science & research",
    "Health & fitness", "Mindfulness", "Remote work", "Sustainability",
    "Eco tourism", "Spirituality", "Culture", "Street photography",
    "Documentary making", "Illustration", "Animation", "Interior styling",
    "Coffee culture", "Cafe hopping", "Minimalism", "Backpacking",
    "Homestay living", "Farm stay life", "Wildlife", "Ocean life",
    "Mountain life", "Urban exploration", "Slow travel", "Creative travel",
  ]

  const toggleInterest = (interest: string) => {
    setForm(prev => {
      if (prev.interests.includes(interest)) {
        const updated = { ...prev, interests: prev.interests.filter(i => i !== interest) }
        save(updated)
        return updated
      }
      if (prev.interests.length >= 7) return prev
      const updated = { ...prev, interests: [...prev.interests, interest] }
      save(updated)
      return updated
    })
  }

  const removeInterest = (interest: string) => {
    setForm(prev => {
      const updated = { ...prev, interests: prev.interests.filter(i => i !== interest) }
      save(updated)
      return updated
    })
  }

  const renderInterests = () => {
    const searchLower = interestSearch.trim().toLowerCase()
    const filtered = searchLower
      ? allInterestOptions.filter(o => !form.interests.includes(o) && o.toLowerCase().includes(searchLower))
      : allInterestOptions.filter(o => !form.interests.includes(o))

    return (
      <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1
            className="font-tanker text-[#234232] leading-[1.08] tracking-tight mb-3 text-balance"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
          >
            What are you into?
          </h1>
          <p className="text-base text-[#6F8B78] leading-relaxed">
            Select the things that genuinely interest you.
          </p>
        </div>

        {/* Selected Picks */}
        {form.interests.length > 0 && (
          <div className="mb-8">
            <div className="bg-[#EFE9E1]/60 rounded-xl border border-[#7FA58A]/30 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6F8B78] uppercase tracking-wider">
                  Your picks
                </span>
                <span className="text-xs font-medium text-[#234232]">
                  {form.interests.length} / 7 selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.interests.map(interest => (
                  <div
                    key={interest}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-[#E8F1EA] border border-[#7FA58A] text-[#234232]"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-[#7FA58A]/20 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-8 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F8B78] pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={interestSearch}
            onChange={e => setInterestSearch(e.target.value)}
            placeholder="Search interests..."
            className="w-full h-12 rounded-full border bg-white pl-11 pr-10 text-sm text-[#234232] placeholder:text-[#6F8B78] focus:outline-none focus:border-[#5A8A6B] focus:ring-1 focus:ring-[#5A8A6B]/30 transition-all duration-200 border-[#7FA58A]/40"
          />
          {interestSearch && (
            <button
              type="button"
              onClick={() => setInterestSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[#6F8B78] hover:text-[#234232] hover:bg-[#E8F1EA] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Chip Cloud */}
        <div className="flex flex-wrap justify-center gap-2.5 pb-8">
          {filtered.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              disabled={form.interests.length >= 7 && !form.interests.includes(interest)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-transparent text-[#234232] border border-[#7FA58A] hover:border-[#5A8A6B] hover:bg-[#E8F1EA]/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {interest}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={handleContinue}
            className="w-14 h-14 rounded-full bg-[#234232] text-[#F7F4EE] flex items-center justify-center shadow-[0_4px_14px_rgba(35,66,50,0.25)] hover:shadow-[0_6px_20px_rgba(35,66,50,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  const renderProfileIntro = () => (
    <div className="relative min-h-[calc(100vh-180px)] flex items-center justify-center overflow-hidden">
      {/* Cinematic background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #E8E4DC 0%, #D4CFC4 40%, #C8C2B5 100%)",
        }}
      />
      {/* Soft cloud-like overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.6) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.4) 0%, transparent 50%)",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(31,77,58,0.08) 100%)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-[700px] mx-auto">
        <h1
          className="font-tanker text-[#1F4D3A] leading-[1.1] tracking-tight mb-5 text-balance"
          style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
        >
          Now let&apos;s bring your profile to life with photos and prompts.
        </h1>
        <p className="text-lg text-[#4A6B5A] leading-relaxed max-w-lg mx-auto mb-10">
          Show hosts the energy, personality, and moments that make you unique.
        </p>
        <button
          onClick={handleContinue}
          className="px-10 h-14 rounded-full bg-[#1F4D3A] text-[#F4F1EA] text-base font-semibold shadow-[0_4px_20px_rgba(31,77,58,0.3)] hover:shadow-[0_6px_28px_rgba(31,77,58,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        >
          Continue
        </button>
      </div>
    </div>
  )

  const renderPhotoUpload = () => {
    const handleFileSelect = (index: number) => {
      fileInputRefs.current[index]?.click()
    }

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      setForm(prev => {
        const newPhotos = [...prev.photos]
        newPhotos[index] = url
        const updated = { ...prev, photos: newPhotos }
        save(updated)
        return updated
      })
    }

    const handleRemove = (index: number) => {
      setForm(prev => {
        const newPhotos = prev.photos.filter((_, i) => i !== index)
        const updated = { ...prev, photos: newPhotos }
        save(updated)
        return updated
      })
    }

    const uploadedCount = form.photos.filter(Boolean).length

    return (
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* LEFT: Text content */}
          <div className="lg:sticky lg:top-24">
            <h1
              className="font-tanker text-[#1F4D3A] leading-[1.08] tracking-tight mb-4 text-balance"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              Add photos and videos that represent you
            </h1>
            <p className="text-base text-[#4A6B5A] leading-relaxed mb-6">
              Upload at least 2 photos or videos to continue.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F1EA] border border-[#7FA58A]/40 text-xs font-medium text-[#234232]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              PNG, JPG and MP4 supported
            </div>
            <p className="text-sm text-[#6F8B78] mt-6 leading-relaxed max-w-sm">
              Authentic travel moments help hosts understand who you are.
            </p>

            {/* CTA */}
            <div className="mt-8">
              <button
                onClick={handleContinue}
                disabled={uploadedCount < 2}
                className="w-full sm:w-auto px-8 h-12 rounded-full bg-[#1F4D3A] text-[#F4F1EA] text-sm font-semibold shadow-[0_4px_14px_rgba(31,77,58,0.25)] hover:shadow-[0_6px_20px_rgba(31,77,58,0.35)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300"
              >
                Continue{" "}
                <span className="text-xs opacity-70 ml-1">
                  ({uploadedCount}/2 min)
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT: Upload grid */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i}>
                <input
                  ref={el => { fileInputRefs.current[i] = el }}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,video/mp4"
                  className="hidden"
                  onChange={e => handleFileChange(i, e)}
                />
                <button
                  type="button"
                  onClick={() => handleFileSelect(i)}
                  className="relative w-full aspect-square rounded-[28px] bg-[#F4F1EA] border-2 border-dashed border-[#7FA58A]/30 hover:border-[#7FA58A]/60 hover:bg-[#EFE9E1] transition-all duration-300 flex items-center justify-center overflow-hidden group"
                >
                  {form.photos[i] ? (
                    <>
                      <img
                        src={form.photos[i]}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); handleRemove(i) }}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 text-[#1F4D3A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1F4D3A] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-[#F4F1EA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderBio = () => {
    return (
      <div className="relative min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">
          {/* Progress dots */}
          <div className="flex items-center gap-3 mb-10">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${
                  i === step
                    ? "w-8 h-2 bg-[#1F4D3A]"
                    : i < step
                    ? "w-2 h-2 bg-[#1F4D3A]/40"
                    : "w-2 h-2 bg-[#D4CFC4]"
                }`}
              />
            ))}
          </div>

          <h1
            className="font-tanker text-[#1F4D3A] leading-[1.1] tracking-tight mb-5 text-balance"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
          >
            Tell us something about yourself
          </h1>
          <p className="font-sans text-lg text-[#4A6B5A] leading-relaxed max-w-xl mb-10">
            Share a little about your personality, travel mindset, or the experiences that shape you.
          </p>

          {/* Textarea */}
          <div className="w-full relative group">
            <textarea
              value={form.bio}
              onChange={e => update("bio", e.target.value)}
              placeholder="I love slow travel, meeting new people, and experiencing cultures through local communities..."
              className="w-full h-64 md:h-80 bg-white border border-[#E5E5E5] focus:border-[#1F4D3A] focus:ring-2 focus:ring-[#1F4D3A]/10 resize-none px-6 py-6 md:px-8 md:py-8 font-sans text-base text-[#1c1c18] placeholder:text-[#c0c9c2] rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgba(2,54,37,0.03)]"
            />
            <div className="absolute bottom-5 right-6 md:right-8 flex items-center gap-4">
              <span
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  bioWordCount > 0 ? "text-[#1F4D3A]/70" : "text-[#717973]"
                }`}
              >
                {bioWordCount} word{bioWordCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <button
              onClick={handleContinue}
              className="group relative px-10 h-14 bg-[#1F4D3A] text-[#F4F1EA] rounded-full font-sans text-sm font-semibold shadow-[0_4px_20px_rgba(31,77,58,0.25)] hover:shadow-[0_8px_28px_rgba(31,77,58,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2"
            >
              <span>Complete Profile</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const stepLabels = [
    "Basic Details", "Interests", "Profile Intro", "Photos", "Your Story", "Personality Prompts",
  ]

  const getContinueLabel = () => {
    if (step === TOTAL_STEPS - 1) return "Complete Profile"
    if (step === 4) return "Continue"
    return "Continue"
  }

  const getContinueDisabled = () => {
    if (step === 0) return !form.fullName || !form.email
    if (step === 1) return form.interests.length === 0
    if (step === 3) return form.photos.filter(Boolean).length < 2
    if (step === 5) return form.promptAnswers.length < 3
    return false
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  // Inline-CTA steps handle their own Continue; StepLayout footer shows Back only.
  const isInlineCtaStep = [0, 1, 2, 3, 4].includes(step)

  return (
    <Providers>
      <StepLayout
        title={stepLabels[step]}
        subtitle={
          step === 0 ? "Help hosts get to know the real you."
          : step === 1 ? "Select what genuinely interests you."
          : undefined
        }
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        onBack={step > 0 ? () => setStep(step - 1) : undefined}
        onContinue={isInlineCtaStep ? undefined : handleContinue}
        continueLabel={getContinueLabel()}
        continueDisabled={getContinueDisabled()}
        loading={loading}
        hideBack={step === 0}
        hideHeader={step === 5}
        dashboard
        bare={[0, 2, 3, 4, 5].includes(step)}
        hideFooter={[0, 5].includes(step)}
      >
        {renderStep()}
      </StepLayout>
    </Providers>
  )
}
