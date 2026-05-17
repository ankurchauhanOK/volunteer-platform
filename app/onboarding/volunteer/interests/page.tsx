"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { SegmentedProgress } from "@/components/onboarding/SegmentedProgress"
import { InterestChip } from "@/components/onboarding/InterestChip"

const interestOptions = [
  "Photography",
  "Filmmaking",
  "Content creation",
  "Social media",
  "Blogging",
  "Writing",
  "Digital marketing",
  "Graphic design",
  "Website designing",
  "Video editing",
  "Video making",
  "Music",
  "Dance",
  "Painting & drawing",
  "Art",
  "Reading",
  "Podcasts",
  "Fashion & style",
  "Cooking",
  "Baking",
  "Cooking classes",
  "Yoga",
  "Meditation",
  "Wellness",
  "Sports",
  "Hiking",
  "Cycling",
  "Trekking",
  "Camping",
  "Adventure activities",
  "Travel",
  "Solo travel",
  "Cultural exchange",
  "Nature",
  "Environmentalism",
  "Eco projects",
  "Gardening",
  "Farming",
  "Agricultural skills",
  "Animal care",
  "Teaching",
  "Language learning",
  "Community management",
  "Hospitality",
  "Front desk management",
  "Trip leading",
  "Surfing",
  "Swimming",
  "Rafting",
  "Bird watching",
  "Crafts",
  "DIY projects",
  "Pottery",
  "Calligraphy",
  "Journaling",
  "Technology",
  "Movies",
  "Theater",
  "History",
  "Festivals",
  "Volunteering",
  "Internet culture",
  "Gaming",
  "Video games",
  "Comedy",
  "Storytelling",
  "Travel storytelling",
  "Creative arts",
  "Content strategy",
  "Public speaking",
  "Event management",
  "Science & research",
  "Health & fitness",
  "Mindfulness",
  "Remote work",
  "Startup culture",
  "Sustainability",
  "Eco tourism",
  "Spirituality",
  "Culture",
  "Street photography",
  "Documentary making",
  "Illustration",
  "Animation",
  "Interior styling",
  "Coffee culture",
  "Cafe hopping",
  "Minimalism",
  "Backpacking",
  "Homestay living",
  "Farm stay life",
  "Wildlife",
  "Ocean life",
  "Mountain life",
  "Urban exploration",
  "Slow travel",
  "Creative travel",
]

export default function VolunteerInterestsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>(() => {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem("vt_profile_setup")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return parsed.interests || []
      } catch {}
    }
    return []
  })
  const [loading, setLoading] = useState(false)

  const save = useCallback((interests: string[]) => {
    if (typeof window === "undefined") return
    const existing = localStorage.getItem("vt_profile_setup")
    let data = {}
    if (existing) {
      try {
        data = JSON.parse(existing)
      } catch {}
    }
    localStorage.setItem("vt_profile_setup", JSON.stringify({ ...data, interests }))
  }, [])

  const handleToggle = (interest: string) => {
    setSelected((prev) => {
      const next = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
      save(next)
      return next
    })
  }

  const handleContinue = () => {
    setLoading(true)
    save(selected)
    // Small delay for UX
    setTimeout(() => {
      setLoading(false)
      router.push("/onboarding/volunteer")
    }, 300)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-pulse text-text-muted">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-lg bg-sb-500 flex items-center justify-center shadow-sm">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
            </svg>
          </div>
          <span className="font-sans text-lg text-text tracking-normal">Voluntree</span>
        </div>

        {/* Segmented Progress */}
        <div className="mb-10">
          <SegmentedProgress currentStep={1} totalSteps={3} />
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-text tracking-tight leading-tight">
            What are you into?
          </h1>
          <p className="text-sm text-text-secondary mt-3 leading-relaxed">
            Select the things that genuinely interest you.
          </p>
          {selected.length > 0 && (
            <p className="text-xs text-text-muted mt-2 font-medium">
              {selected.length} selected
            </p>
          )}
        </div>

        {/* Chip Cloud */}
        <div className="flex flex-wrap justify-center gap-2.5 pb-24">
          {interestOptions.map((interest) => (
            <InterestChip
              key={interest}
              label={interest}
              selected={selected.includes(interest)}
              onClick={() => handleToggle(interest)}
            />
          ))}
        </div>
      </div>

      {/* Floating FAB */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={loading}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-sb-500 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:bg-sb-600 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        )}
      </button>
    </div>
  )
}
