"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { SegmentedProgress } from "@/components/onboarding/SegmentedProgress"
import { InterestChip } from "@/components/onboarding/InterestChip"
import { cn } from "@/lib/utils"

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

interface SavedProfileSetup {
  interests?: string[]
  customInterests?: string[]
}

export default function VolunteerInterestsPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [selected, setSelected] = useState<string[]>([])
  const [customInterests, setCustomInterests] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem("vt_profile_setup")
    if (saved) {
      try {
        const parsed: SavedProfileSetup = JSON.parse(saved)
        setSelected(parsed.interests || [])
        setCustomInterests(parsed.customInterests || [])
      } catch {}
    }
  }, [])

  const save = useCallback((interests: string[], customs: string[]) => {
    if (typeof window === "undefined") return
    const existing = localStorage.getItem("vt_profile_setup")
    let data = {}
    if (existing) {
      try {
        data = JSON.parse(existing)
      } catch {}
    }
    localStorage.setItem(
      "vt_profile_setup",
      JSON.stringify({ ...data, interests: interests, customInterests: customs })
    )
  }, [])

  const handleToggle = (interest: string) => {
    setSelected((prev) => {
      const next = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
      save(next, customInterests)
      return next
    })
  }

  const handleRemove = (interest: string) => {
    setSelected((prev) => {
      const next = prev.filter((i) => i !== interest)
      save(next, customInterests)
      return next
    })
  }

  const handleAddCustom = () => {
    const trimmed = search.trim()
    if (!trimmed) return
    if (selected.includes(trimmed)) {
      setSearch("")
      return
    }
    const newSelected = [...selected, trimmed]
    const newCustoms = interestOptions.includes(trimmed)
      ? customInterests
      : [...customInterests, trimmed]
    setSelected(newSelected)
    setCustomInterests(newCustoms)
    save(newSelected, newCustoms)
    setSearch("")
  }

  const handleContinue = () => {
    setLoading(true)
    save(selected, customInterests)
    setTimeout(() => {
      setLoading(false)
      router.push("/onboarding/volunteer")
    }, 300)
  }

  const searchLower = search.trim().toLowerCase()

  const filteredOptions = useMemo(() => {
    if (!searchLower) return interestOptions.filter((o) => !selected.includes(o))
    return interestOptions.filter(
      (o) => !selected.includes(o) && o.toLowerCase().includes(searchLower)
    )
  }, [searchLower, selected])

  const showAddOption = useMemo(() => {
    if (!searchLower) return false
    const exactMatch = interestOptions.some(
      (o) => o.toLowerCase() === searchLower
    )
    const alreadySelected = selected.some(
      (s) => s.toLowerCase() === searchLower
    )
    return !exactMatch && !alreadySelected
  }, [searchLower, selected])

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
        <div className="text-center mb-8">
          <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-text tracking-tight leading-tight">
            What are you into?
          </h1>
          <p className="text-sm text-text-secondary mt-3 leading-relaxed">
            Select the things that genuinely interest you.
          </p>
        </div>

        {/* Selected Pills Row */}
        {selected.length > 0 && (
          <div className="mb-6">
            <div className="bg-ceramic/30 rounded-xl border border-border/60 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Your picks
                </span>
                <span className="text-xs font-medium text-sb-600">
                  {selected.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.map((interest) => (
                  <div
                    key={interest}
                    className={cn(
                      "inline-flex items-center gap-1.5",
                      "px-4 py-2",
                      "rounded-full",
                      "text-sm font-medium tracking-tight",
                      "bg-sb-50 border border-sb-500 text-sb-700",
                      "ring-1 ring-sb-500/20",
                    )}
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(interest)}
                      className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-sb-100 transition-colors active:scale-90"
                      aria-label={`Remove ${interest}`}
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

        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search interests..."
              className={cn(
                "w-full h-11 rounded-full border bg-white pl-10 pr-10",
                "text-sm text-text placeholder:text-text-muted",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500 focus-visible:border-sb-500",
                "transition-all duration-200",
                "border-border",
              )}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-ceramic/50 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Chip Cloud */}
        <div className="space-y-4 pb-24">
          {/* Add custom option */}
          {showAddOption && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAddCustom}
                className={cn(
                  "inline-flex items-center gap-2",
                  "px-5 py-2.5",
                  "rounded-full",
                  "text-sm font-medium tracking-tight",
                  "border border-dashed border-sb-400",
                  "text-sb-600 bg-sb-50/50",
                  "hover:bg-sb-50 hover:border-sb-500",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500",
                  "active:scale-95 transition-all duration-200",
                )}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add &quot;{search.trim()}&quot;
              </button>
            </div>
          )}

          {/* Existing filtered chips */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {filteredOptions.map((interest) => (
              <InterestChip
                key={interest}
                label={interest}
                selected={selected.includes(interest)}
                onClick={() => handleToggle(interest)}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredOptions.length === 0 && !showAddOption && (
            <p className="text-center text-sm text-text-muted py-8">
              No interests found. Try a different search.
            </p>
          )}
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
