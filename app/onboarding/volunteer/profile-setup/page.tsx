"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Progress } from "@/components/ui/Progress"
import { PhotoGridUpload } from "@/components/onboarding/PhotoGridUpload"
import { cn } from "@/lib/utils"

// Map gender options to display labels for pills
const genderPills = [
  { value: "male", label: "Man" },
  { value: "female", label: "Woman" },
  { value: "more", label: "More >" },
]

const travelExperienceOptions = [
  { value: "0-1", label: "0-1 year" },
  { value: "1-3", label: "1-3 year" },
  { value: "3+", label: "3 year +" },
]

const travelStyleOptions = [
  { value: "solo", label: "solo" },
  { value: "with-friends", label: "with friends" },
  { value: "travel-group", label: "with a travel group" },
  { value: "open", label: "I'm open to anything" },
]

interface ProfileSetupForm {
  firstName: string
  email: string
  birthdayDay: string
  birthdayMonth: string
  birthdayYear: string
  gender: string
  showGenderOnProfile: boolean
  travelExperience: string
  travelStyle: string
  photos: string[]
}

const defaultForm: ProfileSetupForm = {
  firstName: "",
  email: "",
  birthdayDay: "",
  birthdayMonth: "",
  birthdayYear: "",
  gender: "",
  showGenderOnProfile: true,
  travelExperience: "",
  travelStyle: "",
  photos: [],
}

function calcCompleteness(form: ProfileSetupForm): number {
  const fields = [
    form.firstName,
    form.email,
    form.birthdayDay && form.birthdayMonth && form.birthdayYear,
    form.gender,
    form.travelExperience,
    form.travelStyle,
    form.photos.length >= 2,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

export default function VolunteerProfileSetupPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ProfileSetupForm>(() => {
    if (typeof window === "undefined") return defaultForm
    const saved = localStorage.getItem("vt_profile_setup")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return { ...defaultForm, ...parsed }
      } catch {}
    }
    return defaultForm
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const completeness = useMemo(() => calcCompleteness(form), [form])

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        firstName: prev.firstName || user.name?.split(" ")[0] || "",
        email: prev.email || user.email || "",
      }))
    }
  }, [user])

  const save = useCallback((updated: ProfileSetupForm) => {
    localStorage.setItem("vt_profile_setup", JSON.stringify(updated))
  }, [])

  const update = <K extends keyof ProfileSetupForm>(key: K, value: ProfileSetupForm[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      save(next)
      return next
    })
    // Clear error for this field
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key as string]
      return next
    })
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.firstName.trim()) newErrors.firstName = "First name is required"
    if (!form.email.trim()) newErrors.email = "Email is required"
    if (!form.birthdayDay || !form.birthdayMonth || !form.birthdayYear) {
      newErrors.birthday = "Complete birthday is required"
    }
    if (!form.gender) newErrors.gender = "Gender is required"
    if (!form.travelExperience) newErrors.travelExperience = "Travel experience is required"
    if (!form.travelStyle) newErrors.travelStyle = "Travel style is required"
    if (form.photos.length < 2) newErrors.photos = "Upload at least 2 photos"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (!validate()) return
    setLoading(true)
    save(form)
    // Small delay for UX feel
      setTimeout(() => {
        setLoading(false)
        router.push("/onboarding/volunteer/interests")
      }, 400)
  }

  const handleSaveLater = () => {
    save(form)
    router.push("/onboarding/volunteer/interests")
  }

  const handleBirthdayChange = (part: "day" | "month" | "year", value: string) => {
    // Only allow numbers
    const num = value.replace(/\D/g, "")
    setForm((prev) => {
      const next = {
        ...prev,
        birthdayDay: part === "day" ? num : prev.birthdayDay,
        birthdayMonth: part === "month" ? num : prev.birthdayMonth,
        birthdayYear: part === "year" ? num : prev.birthdayYear,
      }
      save(next)
      return next
    })
    setErrors((prev) => {
      const next = { ...prev }
      delete next.birthday
      return next
    })
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
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-text tracking-tight">
            Create your travel identity
          </h1>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto leading-relaxed">
            Profiles with authentic photos and details get better host matches.
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[32px] border border-border/60 shadow-[0_0_0.5px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* LEFT SIDE — Form Fields */}
            <div className="lg:col-span-7 px-6 sm:px-10 py-10 sm:py-12">
              <div className="space-y-10">
                {/* Section: Identity */}
                <div className="space-y-5">
                  <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
                    Your identity
                  </h2>

                  <div className="space-y-4">
                    <Input
                      label="First name"
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      placeholder="First name"
                      error={errors.firstName}
                      required
                    />

                    <Input
                      label="Email"
                      type="email"
                      id="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      error={errors.email}
                      required
                    />
                  </div>
                </div>

                {/* Section: Birthday */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-text uppercase tracking-wider">
                      Birthday <span className="text-error-text">*</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { key: "day" as const, placeholder: "DD", maxLen: 2, maxVal: 31 },
                      { key: "month" as const, placeholder: "MM", maxLen: 2, maxVal: 12 },
                      { key: "year" as const, placeholder: "YYYY", maxLen: 4, maxVal: 9999 },
                    ].map((field) => (
                      <div key={field.key} className="space-y-1">
                        <label className="text-[10px] text-text-muted uppercase tracking-wider font-medium">
                          {field.key}
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={field.maxLen}
                          value={
                            field.key === "day"
                              ? form.birthdayDay
                              : field.key === "month"
                                ? form.birthdayMonth
                                : form.birthdayYear
                          }
                          onChange={(e) => handleBirthdayChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className={cn(
                            "flex h-10 w-full rounded-xl border bg-white px-3 py-2 text-sm text-text placeholder:text-text-muted text-center",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500 focus-visible:ring-offset-0",
                            errors.birthday ? "border-error-text" : "border-border focus-visible:border-sb-500",
                          )}
                        />
                      </div>
                    ))}
                  </div>
                  {errors.birthday && (
                    <p className="text-xs text-error-text">{errors.birthday}</p>
                  )}
                </div>

                {/* Section: Gender */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-text uppercase tracking-wider">
                    Gender <span className="text-error-text">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genderPills.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => {
                          if (g.value === "more") {
                            update("gender", "prefer-not")
                          } else {
                            update("gender", g.value)
                          }
                        }}
                        className={cn(
                          "h-10 px-5 rounded-full border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500",
                          form.gender === g.value || (g.value === "more" && form.gender === "prefer-not")
                            ? "bg-sb-50 border-sb-500 text-sb-700 ring-1 ring-sb-500/20"
                            : "bg-white border-border text-text hover:border-gray-300 hover:bg-ceramic/30",
                          "active:scale-95",
                        )}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="text-xs text-error-text">{errors.gender}</p>
                  )}

                  {/* Show gender checkbox */}
                  <label className="flex items-center gap-2.5 cursor-pointer group mt-2">
                    <input
                      type="checkbox"
                      checked={form.showGenderOnProfile}
                      onChange={(e) => update("showGenderOnProfile", e.target.checked)}
                      className="w-4 h-4 rounded border-border text-sb-600 focus:ring-sb-500"
                    />
                    <span className="text-sm text-text-secondary group-hover:text-text transition-colors">
                      Show my gender on my profile
                    </span>
                  </label>
                </div>

                {/* Section: Travel Experience */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-text uppercase tracking-wider">
                    I have been travelling for <span className="text-error-text">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {travelExperienceOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update("travelExperience", opt.value)}
                        className={cn(
                          "h-10 px-5 rounded-full border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500",
                          form.travelExperience === opt.value
                            ? "bg-sb-50 border-sb-500 text-sb-700 ring-1 ring-sb-500/20"
                            : "bg-white border-border text-text hover:border-gray-300 hover:bg-ceramic/30",
                          "active:scale-95",
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.travelExperience && (
                    <p className="text-xs text-error-text">{errors.travelExperience}</p>
                  )}
                </div>

                {/* Section: Travel Style */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-text uppercase tracking-wider">
                    I usually travel: <span className="text-error-text">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {travelStyleOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update("travelStyle", opt.value)}
                        className={cn(
                          "h-10 px-5 rounded-full border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500",
                          form.travelStyle === opt.value
                            ? "bg-sb-50 border-sb-500 text-sb-700 ring-1 ring-sb-500/20"
                            : "bg-white border-border text-text hover:border-gray-300 hover:bg-ceramic/30",
                          "active:scale-95",
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.travelStyle && (
                    <p className="text-xs text-error-text">{errors.travelStyle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE — Photo Upload */}
            <div className="lg:col-span-5 bg-ceramic/20 border-t lg:border-t-0 lg:border-l border-border/50 px-6 sm:px-8 py-10 sm:py-12 lg:sticky lg:top-0 lg:self-start">
              <div className="lg:sticky lg:top-8">
                <PhotoGridUpload
                  photos={form.photos}
                  onChange={(v) => update("photos", v)}
                  label="Profile photos"
                  helperText="Upload 2 photos to start. Add 4 or more to make your profile stand out."
                />
                {errors.photos && (
                  <p className="text-xs text-error-text mt-2 text-center">{errors.photos}</p>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="border-t border-border/50 px-6 sm:px-10 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Progress */}
              <div className="w-full sm:w-auto flex-1 max-w-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-text uppercase tracking-wider">
                    Profile strength
                  </span>
                  <span className={cn(
                    "text-xs font-bold",
                    completeness >= 80 ? "text-sb-600" : completeness >= 50 ? "text-amber-600" : "text-text-muted"
                  )}>
                    {completeness}%
                  </span>
                </div>
                <Progress value={completeness} className="h-1.5" />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveLater}
                  className="h-10 px-5 rounded-full text-sm font-medium text-text-secondary hover:text-text hover:bg-ceramic transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500"
                >
                  Save & continue later
                </button>
                <Button
                  onClick={handleContinue}
                  loading={loading}
                  size="lg"
                  className="bg-sb-500 text-white rounded-full h-12 px-10 hover:bg-sb-600"
                >
                  Continue
                </Button>
              </div>
            </div>

            {/* Trust text */}
            <p className="text-[11px] text-text-muted text-center mt-6">
              Your information is secure and only shared with hosts after your application is accepted. By continuing, you agree to our{" "}
              <a href="#" className="text-sb-600 hover:text-sb-700 font-medium">Community Guidelines</a>{" "}
              and{" "}
              <a href="#" className="text-sb-600 hover:text-sb-700 font-medium">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
