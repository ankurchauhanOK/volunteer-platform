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
import { RichCardSelect } from "@/components/onboarding/RichCardSelect"
import { PhotoUpload } from "@/components/onboarding/PhotoUpload"
import { SearchableSelect } from "@/components/onboarding/SearchableSelect"
import { SectionFAQ } from "@/components/onboarding/SectionFAQ"
import {
  skillOptions, popularSkills, talentAreaOptions, hobbyOptions,
  hobbyRepresentationOptions, destinationOptions, travelTypeOptions,
  environmentOptions, stayTypeOptions, tripDurationOptions,
  soloGroupOptions, travelStyleOptions, experienceLevelOptions,
  comfortLevelOptions, relationshipOptions, genderOptions,
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
  tripDuration: string
  soloOrGroup: string
  availabilityStart: string
  availabilityEnd: string
  travelStyle: string
  experienceLevel: string
  remoteWork: boolean
  comfortLevel: string
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
  preferredStayType: [], tripDuration: "", soloOrGroup: "",
  availabilityStart: "", availabilityEnd: "", travelStyle: "",
  experienceLevel: "", remoteWork: false, comfortLevel: "",
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
    form.travelType, form.tripDuration, form.availabilityStart,
    form.travelStyle, form.experienceLevel, form.emergencyName,
    form.emergencyPhone, form.communityGuidelinesAgreed,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
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
      availabilityStart: form.availabilityStart || undefined,
      availabilityEnd: form.availabilityEnd || undefined,
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
      tripDuration: form.tripDuration || undefined,
      soloOrGroup: form.soloOrGroup || undefined,
      experienceLevel: form.experienceLevel || undefined,
      remoteWork: form.remoteWork || undefined,
      comfortLevel: form.comfortLevel || undefined,
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

  // SCREEN 1: WELCOME
  const renderWelcome = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-200">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
          </svg>
        </div>
        <h2 className="font-tanker heading-2xl text-text">Welcome to Voluntree!</h2>
        <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto leading-relaxed">
          Your profile helps hosts get to know you and find the perfect match for your volunteer journey.
        </p>
      </div>

      <div className="bg-gradient-to-br from-brand-50 to-mint-50 rounded-2xl border border-brand-100 p-5 space-y-3">
        <p className="label-sm text-brand-700 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          We&apos;ll help you build
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: "📋", label: "Basic details" },
            { icon: "💪", label: "Skills & talents" },
            { icon: "🎨", label: "Hobbies & proof" },
            { icon: "🗺️", label: "Travel preferences" },
            { icon: "📅", label: "Availability" },
            { icon: "🛡️", label: "Safety info" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-sm text-text bg-white/70 rounded-xl px-3 py-2.5 border border-brand-100/50">
              <span className="text-lg">{icon}</span>
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {user && (user.name || user.email || user.avatar) && (
        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 card-hover">
          <Avatar className="w-12 h-12 ring-2 ring-brand-100">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-brand-100 text-brand-700 text-base">{user.name?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text truncate">{user.name}</p>
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>
          <Badge variant="primary" size="sm">Connected</Badge>
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-text-muted">You can always update your profile later in settings.</p>
      </div>
    </div>
  )

  // SCREEN 2: BASIC DETAILS
  const renderBasicDetails = () => (
    <div className="space-y-5">
      <PhotoUpload
        value={form.profilePhoto}
        onChange={v => update("profilePhoto", v)}
        helperText="A friendly photo helps hosts recognize and trust you faster."
      />

      <Separator />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="👤 Full name"
          id="fullName"
          value={form.fullName}
          onChange={e => update("fullName", e.target.value)}
          placeholder="Your name"
        />
        <Input
          label="🎂 Age"
          type="number"
          id="age"
          value={form.age}
          onChange={e => update("age", e.target.value)}
          placeholder="e.g. 24"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SearchableSelect
          label="📍 City"
          options={indianCityOptions.map(c => ({ value: c, label: c }))}
          value={form.city}
          onChange={v => update("city", v)}
          placeholder="Search city..."
        />
        <Input
          label="🌍 Country"
          id="country"
          value={form.country}
          onChange={e => update("country", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SearchableSelect
          label="⚧️ Gender (optional)"
          options={genderOptions}
          value={form.gender}
          onChange={v => update("gender", v)}
          placeholder="Select"
        />
        <SearchableSelect
          label="🎓 Qualification"
          options={qualificationOptions}
          value={form.qualification}
          onChange={v => update("qualification", v)}
          placeholder="Select"
        />
      </div>

      <ChipInput
        label="🗣️ Languages you speak"
        options={languageOptions}
        selected={form.languages}
        onChange={v => update("languages", v)}
        searchPlaceholder="Search languages..."
        helperText="We only use this to match you with suitable hosts."
      />
    </div>
  )

  // SCREEN 3: SKILLS AND TALENTS
  const renderSkills = () => (
    <div className="space-y-5">
      <ChipInput
        label="What can you help with?"
        options={skillOptions}
        selected={form.skills}
        onChange={v => update("skills", v)}
        searchPlaceholder="Search skills..."
        popularTags={popularSkills}
        helperText="Popular among hosts — select the ones you're confident using on a trip."
      />

      <ChipInput
        label="Your talent areas"
        options={talentAreaOptions}
        selected={form.talentAreas}
        onChange={v => update("talentAreas", v)}
        searchable={false}
        columns={3}
      />

      <Input
        label="Add any other skill (optional)"
        id="otherSkill"
        value={form.otherSkill}
        onChange={e => update("otherSkill", e.target.value)}
        placeholder="e.g. sign language, permaculture, surfing..."
      />
    </div>
  )

  // SCREEN 4: HOBBIES AND CREATIVE PROOF
  const renderHobbies = () => {
    const showProofSection = !!form.hobbyRepresentation

    return (
      <div className="space-y-5">
        <ChipInput
          label="What do you love doing?"
          options={hobbyOptions}
          selected={form.hobbies}
          onChange={v => update("hobbies", v)}
          searchPlaceholder="Search hobbies..."
          helperText="Select the hobbies that make you, you."
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            How would you like to show your hobby?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {hobbyRepresentationOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("hobbyRepresentation", opt.value)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all ${
                  form.hobbyRepresentation === opt.value
                    ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <span className={`text-xs font-medium ${
                  form.hobbyRepresentation === opt.value ? "text-brand-700" : "text-text-secondary"
                }`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {showProofSection && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Share your proof</p>
            {["text", "mixed"].includes(form.hobbyRepresentation) && (
              <Textarea
                label="Short description"
                id="hobbyDesc"
                value={form.hobbyDescription}
                onChange={e => update("hobbyDescription", e.target.value)}
                placeholder="Tell hosts what you enjoy and how you express it..."
                rows={3}
              />
            )}
            {["photo", "mixed"].includes(form.hobbyRepresentation) && (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400">📸 Upload a photo</p>
                <p className="text-xs text-gray-300 mt-1">Coming soon</p>
              </div>
            )}
            {["video", "mixed"].includes(form.hobbyRepresentation) && (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400">🎥 Upload a video</p>
                <p className="text-xs text-gray-300 mt-1">Coming soon</p>
              </div>
            )}
            {["audio", "mixed"].includes(form.hobbyRepresentation) && (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400">🎙️ Record audio</p>
                <p className="text-xs text-gray-300 mt-1">Coming soon</p>
              </div>
            )}
            {["portfolio", "mixed"].includes(form.hobbyRepresentation) && (
              <Input
                label="Portfolio link"
                id="portfolio"
                value={form.hobbyProofUrl}
                onChange={e => update("hobbyProofUrl", e.target.value)}
                placeholder="https://..."
              />
            )}
          </div>
        )}

        <SectionFAQ
          items={[
            { question: "What is profile proof?", answer: "Profile proof is any example of your work or hobby — a photo you took, a video you made, a song you recorded, or a link to your portfolio. Hosts love seeing real examples!" },
          ]}
        />
      </div>
    )
  }

  // SCREEN 5: TRAVEL PREFERENCES
  const renderTravelPrefs = () => (
    <div className="space-y-5">
      <ChipInput
        label="Preferred destinations in India"
        options={destinationOptions}
        selected={form.preferredDestinations}
        onChange={v => update("preferredDestinations", v)}
        searchPlaceholder="Search destinations..."
      />

      <CardSelect
        label="Travel type"
        options={travelTypeOptions}
        selected={form.travelType}
        onChange={v => update("travelType", v as any)}
      />

      <CardSelect
        label="Preferred environment"
        options={environmentOptions.map(e => ({ value: e.toLowerCase(), label: e }))}
        selected={form.preferredEnvironment}
        onChange={v => update("preferredEnvironment", v as any)}
        multi
        columns={3}
      />

      <CardSelect
        label="Preferred stay type"
        options={stayTypeOptions.map(s => ({ value: s.toLowerCase(), label: s }))}
        selected={form.preferredStayType}
        onChange={v => update("preferredStayType", v as any)}
        multi
        columns={3}
      />

      <div className="grid grid-cols-2 gap-3">
        <CardSelect
          label="Trip duration"
          options={tripDurationOptions}
          selected={form.tripDuration}
          onChange={v => update("tripDuration", v as any)}
          columns={2}
        />
        <CardSelect
          label="Solo or group?"
          options={soloGroupOptions.map(s => ({ value: s.value, label: s.label }))}
          selected={form.soloOrGroup}
          onChange={v => update("soloOrGroup", v as any)}
          columns={2}
        />
      </div>

      <SectionFAQ
        items={[
          { question: "Why do we ask for travel preferences?", answer: "The more specific you are here, the better your matches will be. Hosts look for volunteers who genuinely want to visit their region." },
        ]}
      />
    </div>
  )

  // SCREEN 6: AVAILABILITY AND TRAVEL STYLE
  const renderAvailability = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Available from"
          type="date"
          id="availStart"
          value={form.availabilityStart}
          onChange={e => update("availabilityStart", e.target.value)}
        />
        <Input
          label="Available until"
          type="date"
          id="availEnd"
          value={form.availabilityEnd}
          onChange={e => update("availabilityEnd", e.target.value)}
        />
      </div>

      <SearchableSelect
        label="Travel style"
        options={travelStyleOptions}
        value={form.travelStyle}
        onChange={v => update("travelStyle", v)}
        placeholder="How do you like to travel?"
      />

      <CardSelect
        label="Experience level"
        options={experienceLevelOptions}
        selected={form.experienceLevel}
        onChange={v => update("experienceLevel", v as any)}
      />

      <div className="flex items-center justify-between rounded-xl border-2 border-gray-100 p-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Remote work while traveling?</p>
          <p className="text-xs text-gray-500">Do you work remotely while you volunteer?</p>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => update("remoteWork", true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              form.remoteWork === true
                ? "bg-brand-100 text-brand-700 border border-brand-300"
                : "bg-gray-50 text-gray-500 border border-gray-200"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => update("remoteWork", false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              form.remoteWork === false
                ? "bg-brand-100 text-brand-700 border border-brand-300"
                : "bg-gray-50 text-gray-500 border border-gray-200"
            }`}
          >
            No
          </button>
        </div>
      </div>

      <CardSelect
        label="Comfort level with new places"
        options={comfortLevelOptions}
        selected={form.comfortLevel}
        onChange={v => update("comfortLevel", v as any)}
      />

      <SectionFAQ
        items={[
          { question: "Why do we ask for travel dates?", answer: "Hosts need to know when you're available to plan their schedules. Flexible dates give you more matches." },
        ]}
      />
    </div>
  )

  // SCREEN 7: SAFETY AND EMERGENCY CONTACT
  const renderSafety = () => (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
        <div className="flex items-start gap-2">
          <span className="text-lg">🛡️</span>
          <div className="text-xs text-amber-800 leading-relaxed">
            <p className="font-medium mb-0.5">Your safety matters</p>
            Emergency contact details are only used for safety and shared with hosts only after your application is accepted.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Emergency contact name"
          id="emergencyName"
          value={form.emergencyName}
          onChange={e => update("emergencyName", e.target.value)}
          placeholder="Full name"
        />
        <Input
          label="Emergency contact phone"
          id="emergencyPhone"
          type="tel"
          value={form.emergencyPhone}
          onChange={e => update("emergencyPhone", e.target.value)}
          placeholder="+91-XXXXXXXXXX"
        />
      </div>

      <SearchableSelect
        label="Relationship"
        options={relationshipOptions}
        value={form.emergencyRelation}
        onChange={v => update("emergencyRelation", v)}
        placeholder="Select relationship"
      />

      <details className="group">
        <summary className="text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
          Optional emergency details
        </summary>
        <div className="mt-3 space-y-3">
          <Textarea
            label="Emergency notes"
            id="emergencyNotes"
            value={form.emergencyNotes}
            onChange={e => update("emergencyNotes", e.target.value)}
            placeholder="Any special instructions for emergencies?"
            rows={2}
          />
          <Textarea
            label="Medical considerations"
            id="medical"
            value={form.medicalConsiderations}
            onChange={e => update("medicalConsiderations", e.target.value)}
            placeholder="Allergies, conditions, medications..."
            rows={2}
          />
          <Input
            label="Special requirements"
            id="special"
            value={form.specialRequirements}
            onChange={e => update("specialRequirements", e.target.value)}
            placeholder="Dietary, accessibility, etc."
          />
        </div>
      </details>

      <div className="space-y-3 pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.communityGuidelinesAgreed}
            onChange={e => update("communityGuidelinesAgreed", e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm text-gray-600">
            I agree to follow Voluntree's community guidelines and treat all hosts and volunteers with respect.
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.respectfulConductAgreed}
            onChange={e => update("respectfulConductAgreed", e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm text-gray-600">
            I commit to respectful, responsible conduct during my volunteer stays.
          </span>
        </label>
      </div>

      <SectionFAQ
        items={[
          { question: "Why is emergency contact needed?", answer: "We only share this with hosts after your application is confirmed. It's a standard safety practice for all volunteer platforms." },
          { question: "How will hosts see my profile?", answer: "Hosts will see your skills, hobbies, and preferences. Emergency contact is never shown on your public profile." },
        ]}
      />
    </div>
  )

  // SCREEN 8: REVIEW AND COMPLETE
  const renderReview = () => {
    const suggestions: string[] = []
    if (!form.skills.length) suggestions.push("Add more skills")
    if (!form.hobbies.length) suggestions.push("Add hobbies")
    if (!form.hobbyRepresentation) suggestions.push("Upload proof of your hobby")
    if (!form.availabilityStart) suggestions.push("Set your travel dates")
    if (!form.hobbyDescription && form.hobbies.length > 0) suggestions.push("Complete your bio")
    if (!form.emergencyName) suggestions.push("Add emergency contact")

    const completenessColor = completeness >= 80 ? "text-green-600" : completeness >= 50 ? "text-amber-600" : "text-text-muted"

    return (
      <div className="space-y-5">
        <div className="bg-gradient-to-br from-brand-50 to-mint-50 rounded-2xl border border-brand-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-text">Profile completeness</h3>
              <p className="text-xs text-text-secondary">Here&apos;s how your profile looks to hosts</p>
            </div>
            <div className="text-right">
              <span className={`text-3xl font-bold ${completenessColor}`}>{completeness}%</span>
              {completeness >= 80 && <p className="text-xs font-medium text-green-600">🌟 Looks great!</p>}
            </div>
          </div>
          <Progress value={completeness} className="h-2.5" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10 ring-2 ring-brand-100">
                <AvatarImage src={form.profilePhoto || user?.avatar} />
                <AvatarFallback className="bg-brand-100 text-brand-700 text-sm">{(form.fullName || user?.name || "?").charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text truncate">{form.fullName || user?.name}</p>
                <p className="text-xs text-text-muted truncate">{form.city || form.country}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4 space-y-1">
            <p className="text-xs text-text-muted">Languages</p>
            <div className="flex flex-wrap gap-1">
              {form.languages.length > 0 ? form.languages.slice(0, 3).map(l => (
                <Badge key={l} variant="primary" size="sm">{l}</Badge>
              )) : <span className="text-xs text-text-muted italic">Not set</span>}
              {form.languages.length > 3 && (
                <Badge variant="outline" size="sm">+{form.languages.length - 3}</Badge>
              )}
            </div>
          </div>
        </div>

        {form.skills.length > 0 && (
          <div className="bg-white rounded-xl border border-border p-4 space-y-2">
            <p className="text-xs font-semibold text-text flex items-center gap-1.5">
              <span>💪</span> Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {form.skills.map(s => (
                <Badge key={s} variant="primary" size="sm">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        {(form.preferredDestinations.length > 0 || form.travelType) && (
          <div className="bg-white rounded-xl border border-border p-4 space-y-2">
            <p className="text-xs font-semibold text-text flex items-center gap-1.5">
              <span>🗺️</span> Travel preferences
            </p>
            <div className="flex flex-wrap gap-1.5">
              {form.preferredDestinations.slice(0, 4).map(d => (
                <Badge key={d} variant="info" size="sm">{d}</Badge>
              ))}
              {form.preferredDestinations.length > 4 && (
                <Badge variant="outline" size="sm">+{form.preferredDestinations.length - 4}</Badge>
              )}
              {form.travelType && (
                <Badge variant="secondary" size="sm">
                  {travelTypeOptions.find(t => t.value === form.travelType)?.label || form.travelType}
                </Badge>
              )}
            </div>
          </div>
        )}

        {form.hobbies.length > 0 && (
          <div className="bg-white rounded-xl border border-border p-4 space-y-2">
            <p className="text-xs font-semibold text-text flex items-center gap-1.5">
              <span>🎨</span> Hobbies
            </p>
            <div className="flex flex-wrap gap-1.5">
              {form.hobbies.map(h => (
                <Badge key={h} variant="purple" size="sm">{h}</Badge>
              ))}
            </div>
            {form.hobbyRepresentation && (
              <p className="text-xs text-text-muted mt-1">
                Proof: {hobbyRepresentationOptions.find(o => o.value === form.hobbyRepresentation)?.label || form.hobbyRepresentation}
              </p>
            )}
          </div>
        )}

        {form.availabilityStart && (
          <div className="bg-white rounded-xl border border-border p-4 space-y-1">
            <p className="text-xs font-semibold text-text flex items-center gap-1.5">
              <span>📅</span> Availability
            </p>
            <p className="text-sm text-text">
              {form.availabilityStart}{form.availabilityEnd ? ` → ${form.availabilityEnd}` : ""}
            </p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <span>💡</span> Tips to improve
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map(s => (
                <span key={s} className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const stepLabels = [
    "Welcome",
    "Basic Details",
    "Skills & Talents",
    "Hobbies & Proof",
    "Travel Preferences",
    "Availability",
    "Safety",
    "Review",
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
          step === 0
            ? "Tell us a little about you so we can match you with the right opportunities."
            : step === 4
            ? "Help us find the right kind of stay for your travel style."
            : step === 6
            ? "This information helps keep your journey safe."
            : step === 7
            ? "Take one final look before you complete your profile."
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
      >
        {renderStep()}

        {step === TOTAL_STEPS - 1 && (
          <div className="flex justify-center mt-2">
            <Button
              onClick={handleSubmit}
              loading={loading}
              size="lg"
              className="w-full sm:w-auto"
            >
              Complete Profile
            </Button>
          </div>
        )}
      </StepLayout>
    </Providers>
  )
}
