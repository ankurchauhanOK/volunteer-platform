"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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
import { PhotoUpload } from "@/components/onboarding/PhotoUpload"
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

const TOTAL_STEPS = 8

interface OnboardingForm {
  step: number
  fullName: string
  profilePhoto: string
  age: string
  city: string
  country: string
  gender: string
  languages: string[]
  qualification: string
  skills: string[]
  talentAreas: string[]
  otherSkill: string
  hobbies: string[]
  hobbyRepresentation: string
  hobbyDescription: string
  hobbyProofUrl: string
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
  fullName: "", profilePhoto: "", age: "", city: "", country: "India",
  gender: "", languages: [], qualification: "",
  skills: [], talentAreas: [], otherSkill: "",
  hobbies: [], hobbyRepresentation: "", hobbyDescription: "", hobbyProofUrl: "",
  preferredDestinations: [], travelType: "", preferredEnvironment: [],
  preferredStayType: [], soloOrGroup: "",
  travelStyle: "", experienceLevel: "", remoteWork: false,
  emergencyName: "", emergencyPhone: "", emergencyRelation: "",
  emergencyNotes: "", medicalConsiderations: "", specialRequirements: "",
  communityGuidelinesAgreed: false, respectfulConductAgreed: false,
}

function calcCompleteness(form: OnboardingForm): number {
  const fields = [
    form.fullName, !!form.profilePhoto, form.age, form.city, form.gender,
    form.languages.length > 0, form.qualification,
    form.skills.length > 0, form.talentAreas.length > 0,
    form.hobbies.length > 0, form.preferredDestinations.length > 0,
    form.travelType, form.travelStyle,
    form.experienceLevel, form.emergencyName,
    form.emergencyPhone, form.communityGuidelinesAgreed,
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
      setForm(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        profilePhoto: prev.profilePhoto || user.avatar || "",
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
    if (step < TOTAL_STEPS - 1) setStep(step + 1)
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
      age: form.age ? parseInt(form.age) : undefined,
      gender: form.gender || undefined,
      city: form.city || undefined,
      country: form.country,
      bio: form.hobbyDescription || undefined,
      languages: form.languages,
      skills: form.skills,
      interests: form.hobbies,
      preferredDestinations: form.preferredDestinations,
      travelStyle: form.travelStyle || undefined,
      travelExperience: form.experienceLevel || undefined,
      emergencyContact: form.emergencyName
        ? { name: form.emergencyName, phone: form.emergencyPhone, relation: form.emergencyRelation }
        : undefined,
      profilePhoto: form.profilePhoto || undefined,
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
      ...(form.profilePhoto ? { avatar: form.profilePhoto } : {}),
    })
    localStorage.removeItem("vt_onboarding_volunteer")
    refreshUser()
    setLoading(false)
    router.push("/volunteer/dashboard")
  }

  const renderStep = () => {
    switch (step) {
      case 0: return renderWelcome()
      case 1: return renderBasicDetails()
      case 2: return renderSkills()
      case 3: return renderHobbies()
      case 4: return renderTravelPrefs()
      case 5: return renderAvailability()
      case 6: return renderSafety()
      case 7: return renderReview()
      default: return null
    }
  }

  const renderWelcome = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
        <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0 shadow-lg shadow-brand-200/50">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
          </svg>
        </div>
        <div>
          <h2 className="font-tanker heading-2xl text-text">Begin Your Journey</h2>
          <p className="text-xs text-text-secondary">Build your travel identity and find the perfect host match.</p>
        </div>
        {user && (user.name || user.email) && (
          <div className="ml-auto flex items-center gap-2 bg-brand-50 rounded-xl px-3 py-1.5 border border-brand-100">
            <Avatar className="w-6 h-6 ring-1 ring-brand-200">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-brand-100 text-brand-700 text-[10px]">{user.name?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <span className="text-[11px] font-medium text-brand-700 truncate max-w-[100px]">{user.name}</span>
          </div>
        )}
      </div>

      <div className="bg-brand-50 rounded-xl border border-brand-100 p-3">
        <p className="text-[10px] font-semibold text-brand-700 uppercase tracking-wider mb-2">We&apos;ll help you build</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            ["👤", "Profile"], ["💪", "Skills"], ["🎨", "Hobbies"],
            ["🗺️", "Travel"], ["📅", "Dates"], ["🛡️", "Safety"],
          ].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-text bg-white/70 rounded-lg px-2 py-1.5 border border-brand-100/50">
              <span>{icon}</span>
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-text-muted text-center">You can always update your profile later in settings.</p>
      </div>
    </div>
  )

  const renderBasicDetails = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
        <PhotoUpload
        value={form.profilePhoto}
        onChange={v => update("profilePhoto", v)}
        helperText="A friendly photo helps hosts recognize you."
      />

      <div className="grid grid-cols-2 gap-2.5">
        <Input label="Full name" id="fullName" value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Your name" />
        <Input label="Age" type="number" id="age" value={form.age} onChange={e => update("age", e.target.value)} placeholder="e.g. 24" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <SearchableSelect label="City" options={indianCityOptions.map(c => ({ value: c, label: c }))} value={form.city} onChange={v => update("city", v)} placeholder="Search city..." />
        <Input label="Country" id="country" value={form.country} onChange={e => update("country", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <SearchableSelect label="Gender (optional)" options={genderOptions} value={form.gender} onChange={v => update("gender", v)} placeholder="Select" />
        <SearchableSelect label="Qualification" options={qualificationOptions} value={form.qualification} onChange={v => update("qualification", v)} placeholder="Select" />
      </div>

      <ChipInput
        label="Languages you speak"
        options={languageOptions}
        selected={form.languages}
        onChange={v => update("languages", v)}
        searchPlaceholder="Search languages..."
        helperText="Used to match you with suitable hosts."
        dense
      />
      </div>
    </div>
  )

  const renderSkills = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
        <ChipInput
        label="What can you help with?"
        options={skillOptions}
        selected={form.skills}
        onChange={v => update("skills", v)}
        searchPlaceholder="Search skills..."
        popularTags={popularSkills}
        helperText="Popular among hosts."
        iconMap={skillIcons}
      />

      <ChipInput
        label="Your talent areas"
        options={talentAreaOptions}
        selected={form.talentAreas}
        onChange={v => update("talentAreas", v)}
        searchable={false}
        columns={2}
      />

      <Input
        label="Any other skill (optional)"
        id="otherSkill"
        value={form.otherSkill}
        onChange={e => update("otherSkill", e.target.value)}
        placeholder="e.g. sign language, permaculture, surfing..."
      />
      </div>
    </div>
  )

  const renderHobbies = () => {
    const showProofSection = !!form.hobbyRepresentation
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
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
                className={`flex flex-col items-center gap-0.5 rounded-lg border py-2 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  form.hobbyRepresentation === opt.value
                    ? "border-brand-200 bg-brand-50"
                    : "border-border hover:border-gray-200"
                }`}
              >
                <span className="text-base">{opt.icon}</span>
                <span className={`text-[10px] font-medium ${
                  form.hobbyRepresentation === opt.value ? "text-brand-700" : "text-text-secondary"
                }`}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {showProofSection && (
          <div className="bg-gradient-to-br from-brand-50/50 to-mint-50/50 rounded-lg p-3 space-y-2 border border-brand-100/50">
            <p className="text-[10px] font-semibold text-text uppercase tracking-wider flex items-center gap-1">
              <span className="text-brand-500">✦</span> Share your proof
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
            { question: "What is profile proof?", answer: "Any example of your work or hobby — a photo, video, recording, or portfolio link. Hosts love seeing real examples!" },
          ]}
        />
        </div>
      </div>
    )
  }

  const renderTravelPrefs = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
        <ChipInput
        label="Preferred destinations in India"
        options={destinationOptions}
        selected={form.preferredDestinations}
        onChange={v => update("preferredDestinations", v)}
        searchPlaceholder="Search destinations..."
        iconMap={destIcons}
      />

      <CardSelect label="Travel type" options={travelTypeOptions} selected={form.travelType} onChange={v => update("travelType", v as any)} />

      <div className="grid grid-cols-2 gap-2.5">
        <CardSelect label="Environment" options={environmentOptions.map(e => ({ value: e.toLowerCase(), label: e }))} selected={form.preferredEnvironment} onChange={v => update("preferredEnvironment", v as any)} multi columns={2} />
        <CardSelect label="Stay type" options={stayTypeOptions.map(s => ({ value: s.toLowerCase(), label: s }))} selected={form.preferredStayType} onChange={v => update("preferredStayType", v as any)} multi columns={2} />
      </div>

      <CardSelect label="Solo or group?" options={soloGroupOptions.map(s => ({ value: s.value, label: s.label }))} selected={form.soloOrGroup} onChange={v => update("soloOrGroup", v as any)} columns={2} />

      <SectionFAQ
        items={[
          { question: "Why ask for travel preferences?", answer: "The more specific you are, the better your matches. Hosts look for volunteers who genuinely want to visit their region." },
        ]}
      />
      </div>
    </div>
  )

  const renderAvailability = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
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
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                (opt === "Yes" ? form.remoteWork === true : form.remoteWork === false)
                  ? "bg-brand-50 text-brand-700 border border-brand-200"
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
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
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
        <summary className="text-[11px] font-medium text-text-secondary cursor-pointer hover:text-text transition-colors px-3 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
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
              className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-[11px] text-gray-600 group-hover:text-gray-900 transition-colors leading-relaxed">{label}</span>
          </label>
        ))}
      </div>

      <SectionFAQ
        items={[
          { question: "Why is emergency contact needed?", answer: "Standard safety practice. Only shared with hosts after application is confirmed." },
          { question: "How will hosts see my profile?", answer: "Skills, hobbies, and preferences are visible. Emergency contact is never on your public profile." },
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

    const completenessColor = completeness >= 80 ? "text-brand-600" : completeness >= 50 ? "text-amber-600" : "text-text-muted"

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
              {completeness >= 80 && <p className="text-[10px] font-medium text-brand-600">Looks great!</p>}
            </div>
          </div>
          <Progress value={completeness} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-lg border border-border p-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 ring-1 ring-brand-100">
                <AvatarImage src={form.profilePhoto || user?.avatar} />
                <AvatarFallback className="bg-brand-100 text-brand-700 text-[10px]">{(form.fullName || user?.name || "?").charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text truncate">{form.fullName || user?.name}</p>
                <p className="text-[10px] text-text-muted truncate">{form.city || form.country}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-border p-3 space-y-1">
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
            <div className="bg-white rounded-lg border border-border p-3 space-y-1.5">
              <p className="text-[10px] font-semibold text-text flex items-center gap-1"><span>💪</span> Skills</p>
              <div className="flex flex-wrap gap-1">
                {form.skills.slice(0, 4).map(s => <Badge key={s} variant="primary" size="sm">{s}</Badge>)}
                {form.skills.length > 4 && <Badge variant="outline" size="sm">+{form.skills.length - 4}</Badge>}
              </div>
            </div>
          )}

          {form.hobbies.length > 0 && (
            <div className="bg-white rounded-lg border border-border p-3 space-y-1.5">
              <p className="text-[10px] font-semibold text-text flex items-center gap-1"><span>🎨</span> Hobbies</p>
              <div className="flex flex-wrap gap-1">
                {form.hobbies.slice(0, 4).map(h => <Badge key={h} variant="purple" size="sm">{h}</Badge>)}
                {form.hobbies.length > 4 && <Badge variant="outline" size="sm">+{form.hobbies.length - 4}</Badge>}
              </div>
            </div>
          )}
        </div>

        {(form.preferredDestinations.length > 0 || form.travelType) && (
          <div className="bg-white rounded-lg border border-border p-3 space-y-1.5">
            <p className="text-[10px] font-semibold text-text flex items-center gap-1"><span>🗺️</span> Travel</p>
            <div className="flex flex-wrap gap-1">
              {form.preferredDestinations.slice(0, 4).map(d => <Badge key={d} variant="info" size="sm">{d}</Badge>)}
              {form.preferredDestinations.length > 4 && <Badge variant="outline" size="sm">+{form.preferredDestinations.length - 4}</Badge>}
              {form.travelType && <Badge variant="secondary" size="sm">{travelTypeOptions.find(t => t.value === form.travelType)?.label || form.travelType}</Badge>}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="bg-white border border-border rounded-lg p-3">
            <p className="text-[10px] font-semibold text-text flex items-center gap-1"><span>💡</span> Tips</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {suggestions.map(s => (
                <span key={s} className="text-[10px] text-text-secondary bg-gray-100 px-1.5 py-0.5 rounded-full border border-border">{s}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center pt-1">
          <Button onClick={handleSubmit} loading={loading} size="lg" className="w-full sm:w-auto">
            Complete Profile
          </Button>
        </div>
      </div>
    )
  }

  const stepLabels = [
    "Welcome", "Basic Details", "Skills & Talents", "Hobbies & Proof",
    "Travel Preferences", "Availability", "Safety", "Review",
  ]

  const getContinueLabel = () => {
    if (step === 0) return "Start Profile"
    if (step === TOTAL_STEPS - 1) return "Complete Profile"
    return "Continue"
  }

  const getContinueDisabled = () => {
    if (step === 0) return false
    if (step === 1) return !form.fullName
    if (step === 7) return completeness < 20
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
          step === 0 ? "Tell us about you so we can match you with the right opportunities."
          : step === 1 ? "Help hosts get to know the real you."
          : step === 2 ? "Share what you can bring to a volunteer experience."
          : step === 3 ? "Show hosts what makes you unique."
          : step === 4 ? "Help us find the right stay for your travel style."
          : step === 5 ? "Let hosts know when you're free to travel."
          : step === 6 ? "This information helps keep your journey safe."
          : step === 7 ? "Take one final look before you complete your profile."
          : undefined
        }
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        onBack={step > 0 ? () => setStep(step - 1) : undefined}
        onContinue={step === TOTAL_STEPS - 1 ? undefined : handleContinue}
        onSkip={step === 0 ? handleSkip : undefined}
        continueLabel={getContinueLabel()}
        continueDisabled={getContinueDisabled()}
        loading={loading}
        hideBack={step === 0}
        dashboard
      >
        {renderStep()}
      </StepLayout>
    </Providers>
  )
}
