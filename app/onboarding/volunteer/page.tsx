"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Providers } from "@/components/Providers"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/Progress"
import { Separator } from "@/components/ui/Separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { db } from "@/lib/store"
import { StepLayout } from "@/components/onboarding/StepLayout"
import { ChipInput } from "@/components/onboarding/ChipInput"
import { CardSelect } from "@/components/onboarding/CardSelect"

import { SearchableSelect } from "@/components/onboarding/SearchableSelect"
import { SectionFAQ } from "@/components/onboarding/SectionFAQ"
import {
  skillOptions, popularSkills, talentAreaOptions, hobbyOptions,
  hobbyRepresentationOptions, destinationOptions, travelTypeOptions,
  environmentOptions, stayTypeOptions,
  soloGroupOptions, travelStyleOptions, experienceLevelOptions,
  relationshipOptions, genderOptions,
  qualificationOptions, languageOptions, indianCityOptions,
} from "@/lib/utils"

const TOTAL_STEPS = 4

interface OnboardingForm {
  step: number
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
}

const defaultForm: OnboardingForm = {
  step: 0,
  fullName: "", email: "", birthDay: "", birthMonth: "", birthYear: "",
  gender: "", travelDuration: "", travelCompanion: "",
  languages: [], qualification: "",
  interests: [], skills: [], talentAreas: [], otherSkill: "",
  hobbies: [], hobbyRepresentation: "", hobbyDescription: "", hobbyProofUrl: "", photos: [],
  preferredDestinations: [], travelType: "", preferredEnvironment: [],
  preferredStayType: [], soloOrGroup: "",
  travelStyle: "", experienceLevel: "", remoteWork: false,
  emergencyName: "", emergencyPhone: "", emergencyRelation: "",
  emergencyNotes: "", medicalConsiderations: "", specialRequirements: "",
  communityGuidelinesAgreed: false, respectfulConductAgreed: false,
}

function calcCompleteness(form: OnboardingForm): number {
  const fields = [
    form.fullName, form.email, form.birthDay, form.gender,
    form.travelDuration, form.travelCompanion,
    form.interests.length > 0,
    form.photos.filter(Boolean).length >= 2,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

const skillIcons: Record<string, string> = {
  teaching: "📚", farming: "🌾", hospitality: "🏨", "social media": "📱",
  photography: "📸", video: "🎥", "animal care": "🐾", yoga: "🧘",
  language: "🗣️", cooking: "🍳", "content writing": "✍️", "graphic design": "🎨",
  "web development": "💻", music: "🎵", art: "🎭", dance: "💃",
  sports: "⚽", english: "🔤", marketing: "📢", events: "🎪",
  reception: "💁", housekeeping: "🧹", "event help": "🎯",
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

  const completeness = useMemo(() => calcCompleteness(form), [form])

  const setStep = useCallback((s: number) => {
    setStepState(s)
    setForm(prev => ({ ...prev, step: s }))
  }, [])

  useEffect(() => {
    if (user) {
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
  }, [user])

  const save = useCallback((updated: OnboardingForm) => {
    localStorage.setItem("vt_onboarding_volunteer", JSON.stringify(updated))
  }, [])

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
      bio: form.hobbyDescription || undefined,
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
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

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

  const renderHobbies = () => {
    const showProofSection = !!form.hobbyRepresentation
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <ChipInput
          label="What do you love doing?"
          options={hobbyOptions}
          selected={form.hobbies}
          onChange={v => update("hobbies", v)}
          searchPlaceholder="Search hobbies..."
          helperText="Select the hobbies that make you, you."
          iconMap={hobbyIcons}
        />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text uppercase tracking-wider">How to show your hobby?</label>
          <div className="grid grid-cols-3 gap-1.5">
            {hobbyRepresentationOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("hobbyRepresentation", opt.value)}
                className={`flex flex-col items-center gap-0.5 rounded-lg border py-2 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500 ${
                  form.hobbyRepresentation === opt.value
                    ? "border-sb-200 bg-sb-50"
                    : "border-border hover:border-gray-200"
                }`}
              >
                <span className="text-base">{opt.icon}</span>
                <span className={`text-[10px] font-medium ${
                  form.hobbyRepresentation === opt.value ? "text-sb-700" : "text-text-secondary"
                }`}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {showProofSection && (
          <div className="bg-sb-50 rounded-lg p-3 space-y-2 border border-sb-200/50">
            <p className="text-[10px] font-semibold text-text uppercase tracking-wider flex items-center gap-1">
              <span className="text-sb-500">✦</span> Share your proof
            </p>
            {["text", "mixed"].includes(form.hobbyRepresentation) && (
              <Textarea label="Short description" id="hobbyDesc" value={form.hobbyDescription} onChange={e => update("hobbyDescription", e.target.value)} placeholder="Tell hosts what you enjoy..." rows={2} />
            )}
            {["photo", "mixed"].includes(form.hobbyRepresentation) && (
              <div className="border border-dashed border-gray-200 rounded-lg p-3 text-center"><p className="text-xs text-gray-400">Upload a photo — Coming soon</p></div>
            )}
            {["video", "mixed"].includes(form.hobbyRepresentation) && (
              <div className="border border-dashed border-gray-200 rounded-lg p-3 text-center"><p className="text-xs text-gray-400">Upload a video — Coming soon</p></div>
            )}
            {["audio", "mixed"].includes(form.hobbyRepresentation) && (
              <div className="border border-dashed border-gray-200 rounded-lg p-3 text-center"><p className="text-xs text-gray-400">Record audio — Coming soon</p></div>
            )}
            {["portfolio", "mixed"].includes(form.hobbyRepresentation) && (
              <Input label="Portfolio link" id="portfolio" value={form.hobbyProofUrl} onChange={e => update("hobbyProofUrl", e.target.value)} placeholder="https://..." />
            )}
          </div>
        )}

        <SectionFAQ
          items={[
            { question: "📸 What is profile proof?", answer: "Any example of your work or hobby — a photo, video, recording, or portfolio link. Hosts love seeing real examples!" },
          ]}
        />
        </div>
      </div>
    )
  }

  const renderTravelPrefs = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <ChipInput
        label="Preferred destinations in India"
        options={destinationOptions}
        selected={form.preferredDestinations}
        onChange={v => update("preferredDestinations", v)}
        searchPlaceholder="Search destinations..."
        iconMap={destIcons}
      />

      <CardSelect label="🗺️ Travel type" options={travelTypeOptions} selected={form.travelType} onChange={v => update("travelType", v as any)} />

      <div className="grid grid-cols-2 gap-2.5">
        <CardSelect label="🌿 Environment" options={environmentOptions.map(e => ({ value: e.toLowerCase(), label: e }))} selected={form.preferredEnvironment} onChange={v => update("preferredEnvironment", v as any)} multi columns={2} />
        <CardSelect label="🏠 Stay type" options={stayTypeOptions.map(s => ({ value: s.toLowerCase(), label: s }))} selected={form.preferredStayType} onChange={v => update("preferredStayType", v as any)} multi columns={2} />
      </div>

      <CardSelect label="👤 Solo or group?" options={soloGroupOptions.map(s => ({ value: s.value, label: s.label }))} selected={form.soloOrGroup} onChange={v => update("soloOrGroup", v as any)} columns={2} />

      <SectionFAQ
        items={[
          { question: "🤔 Why ask for travel preferences?", answer: "The more specific you are, the better your matches. Hosts look for volunteers who genuinely want to visit their region." },
        ]}
      />
      </div>
    </div>
  )

  const renderAvailability = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <SearchableSelect label="Travel style" options={travelStyleOptions} value={form.travelStyle} onChange={v => update("travelStyle", v)} placeholder="How do you like to travel?" />

        <CardSelect label="Experience" options={experienceLevelOptions} selected={form.experienceLevel} onChange={v => update("experienceLevel", v as any)} columns={2} />

      <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-white">
        <div>
          <p className="text-xs font-medium text-gray-900">Remote work while traveling?</p>
          <p className="text-[10px] text-gray-500">Do you work remotely during volunteering?</p>
        </div>
        <div className="flex gap-1">
          {["Yes", "No"].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => update("remoteWork", opt === "Yes")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500 ${
                (opt === "Yes" ? form.remoteWork === true : form.remoteWork === false)
                  ? "bg-sb-50 text-sb-700 border border-sb-200"
                  : "bg-gray-50 text-gray-500 border border-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      </div>
    </div>
  )

  const renderSafety = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
        <span className="text-base">🛡️</span>
        <div className="text-[11px] text-amber-800 leading-relaxed">
          <p className="font-medium">Your safety matters</p>
          Emergency contact details are only shared with hosts after your application is accepted.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Input label="Emergency contact name" id="emergencyName" value={form.emergencyName} onChange={e => update("emergencyName", e.target.value)} placeholder="Full name" />
        <Input label="Emergency contact phone" id="emergencyPhone" type="tel" value={form.emergencyPhone} onChange={e => update("emergencyPhone", e.target.value)} placeholder="+91-XXXXXXXXXX" />
      </div>

      <SearchableSelect label="Relationship" options={relationshipOptions} value={form.emergencyRelation} onChange={v => update("emergencyRelation", v)} placeholder="Select relationship" />

      <details className="group rounded-lg border border-border bg-white">
        <summary className="text-[11px] font-medium text-text-secondary cursor-pointer hover:text-text transition-colors px-3 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500">
          Optional emergency details
        </summary>
        <div className="px-3 pb-3 space-y-2">
          <Textarea label="Notes" id="emergencyNotes" value={form.emergencyNotes} onChange={e => update("emergencyNotes", e.target.value)} placeholder="Special instructions?" rows={1} />
          <Textarea label="Medical" id="medical" value={form.medicalConsiderations} onChange={e => update("medicalConsiderations", e.target.value)} placeholder="Allergies, conditions..." rows={1} />
          <Input label="Special requirements" id="special" value={form.specialRequirements} onChange={e => update("specialRequirements", e.target.value)} placeholder="Dietary, accessibility, etc." />
        </div>
      </details>

      <div className="space-y-2">
        {[
          { key: "communityGuidelinesAgreed", label: "I agree to follow Voluntree's community guidelines and treat all hosts and volunteers with respect." },
          { key: "respectfulConductAgreed", label: "I commit to respectful, responsible conduct during my volunteer stays." },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-start gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={form[key as keyof OnboardingForm] as boolean}
              onChange={e => update(key as keyof OnboardingForm, e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-sb-600 focus:ring-sb-500"
            />
            <span className="text-[11px] text-gray-600 group-hover:text-gray-900 transition-colors leading-relaxed">{label}</span>
          </label>
        ))}
      </div>

      <SectionFAQ
        items={[
          { question: "🛡️ Why is emergency contact needed?", answer: "Standard safety practice. Only shared with hosts after application is confirmed." },
          { question: "👁️ How will hosts see my profile?", answer: "Skills, hobbies, and preferences are visible. Emergency contact is never on your public profile." },
        ]}
      />
      </div>
    </div>
  )

  const renderReview = () => {
    const suggestions: string[] = []
    if (!form.skills.length) suggestions.push("Add more skills")
    if (!form.hobbies.length) suggestions.push("Add hobbies")
    if (!form.hobbyRepresentation) suggestions.push("Upload proof of your hobby")
    if (!form.hobbyDescription && form.hobbies.length > 0) suggestions.push("Complete your bio")
    if (!form.emergencyName) suggestions.push("Add emergency contact")

    const completenessColor = completeness >= 80 ? "text-sb-600" : completeness >= 50 ? "text-amber-600" : "text-text-muted"

    return (
      <div className="space-y-3">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-text">Profile completeness</h3>
              <p className="text-[10px] text-text-secondary">How your profile looks to hosts</p>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-bold ${completenessColor}`}>{completeness}%</span>
              {completeness >= 80 && <p className="text-[10px] font-medium text-sb-600">Looks great!</p>}
            </div>
          </div>
          <Progress value={completeness} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-xl border border-border p-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 ring-1 ring-sb-100">
                <AvatarImage src={user?.avatar || undefined} />
                <AvatarFallback className="bg-sb-100 text-sb-700 text-[10px]">{(form.fullName || user?.name || "?").charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text truncate">{form.fullName || user?.name}</p>
                <p className="text-[10px] text-text-muted truncate">India</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-3 space-y-1">
            <p className="text-[10px] text-text-muted">Languages</p>
            <div className="flex flex-wrap gap-1">
              {form.languages.length > 0 ? form.languages.slice(0, 3).map(l => (
                <Badge key={l} variant="primary" size="sm">{l}</Badge>
              )) : <span className="text-[10px] text-text-muted italic">Not set</span>}
              {form.languages.length > 3 && <Badge variant="outline" size="sm">+{form.languages.length - 3}</Badge>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {form.skills.length > 0 && (
            <div className="bg-white rounded-xl border border-border p-3 space-y-1.5">
              <p className="text-[10px] font-semibold text-text flex items-center gap-1"><span>💪</span> Skills</p>
              <div className="flex flex-wrap gap-1">
                {form.skills.slice(0, 4).map(s => <Badge key={s} variant="primary" size="sm">{s}</Badge>)}
                {form.skills.length > 4 && <Badge variant="outline" size="sm">+{form.skills.length - 4}</Badge>}
              </div>
            </div>
          )}

          {form.hobbies.length > 0 && (
            <div className="bg-white rounded-xl border border-border p-3 space-y-1.5">
              <p className="text-[10px] font-semibold text-text flex items-center gap-1"><span>🎨</span> Hobbies</p>
              <div className="flex flex-wrap gap-1">
                {form.hobbies.slice(0, 4).map(h => <Badge key={h} variant="purple" size="sm">{h}</Badge>)}
                {form.hobbies.length > 4 && <Badge variant="outline" size="sm">+{form.hobbies.length - 4}</Badge>}
              </div>
            </div>
          )}
        </div>

        {(form.preferredDestinations.length > 0 || form.travelType) && (
          <div className="bg-white rounded-xl border border-border p-3 space-y-1.5">
            <p className="text-[10px] font-semibold text-text flex items-center gap-1"><span>🗺️</span> Travel</p>
            <div className="flex flex-wrap gap-1">
              {form.preferredDestinations.slice(0, 4).map(d => <Badge key={d} variant="info" size="sm">{d}</Badge>)}
              {form.preferredDestinations.length > 4 && <Badge variant="outline" size="sm">+{form.preferredDestinations.length - 4}</Badge>}
              {form.travelType && <Badge variant="secondary" size="sm">{travelTypeOptions.find(t => t.value === form.travelType)?.label || form.travelType}</Badge>}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="bg-white border border-border rounded-xl p-3">
            <p className="text-[10px] font-semibold text-text flex items-center gap-1"><span>💡</span> Tips</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {suggestions.map(s => (
                <span key={s} className="text-[10px] text-text-secondary bg-gray-100 px-1.5 py-0.5 rounded-full border border-border">{s}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center pt-1">
          <Button onClick={handleSubmit} loading={loading} size="lg" className="w-full sm:w-auto bg-sb-500 text-white rounded-full">
            Complete Profile
          </Button>
        </div>
      </div>
    )
  }

  const stepLabels = [
    "Basic Details", "Interests", "Profile Intro", "Photos",
  ]

  const getContinueLabel = () => {
    if (step === TOTAL_STEPS - 1) return "Complete Profile"
    return "Continue"
  }

  const getContinueDisabled = () => {
    if (step === 0) return !form.fullName || !form.email
    if (step === 1) return form.interests.length === 0
    if (step === 3) return form.photos.filter(Boolean).length < 2
    return false
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

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
        onContinue={handleContinue}
        continueLabel={getContinueLabel()}
        continueDisabled={getContinueDisabled()}
        loading={loading}
        hideBack={step === 0}
        dashboard
        bare={[0, 2, 3].includes(step)}
      >
        {renderStep()}
      </StepLayout>
    </Providers>
  )
}
