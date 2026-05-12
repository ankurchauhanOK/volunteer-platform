"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Providers } from "@/components/Providers"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Badge } from "@/components/ui/Badge"
import { StepLayout } from "@/components/onboarding/StepLayout"
import { RichCardSelect } from "@/components/onboarding/RichCardSelect"
import { HostPhotoUpload } from "@/components/onboarding/HostPhotoUpload"
import { PropertyPhotoGrid } from "@/components/onboarding/PropertyPhotoGrid"
import { PropertyVibeSelector } from "@/components/onboarding/PropertyVibeSelector"
import { IntroVideoInput } from "@/components/onboarding/IntroVideoInput"
import { ExperiencePreviewBlock } from "@/components/onboarding/ExperiencePreviewBlock"
import { ProfileCompleteness } from "@/components/onboarding/ProfileCompleteness"
import { SectionFAQ } from "@/components/onboarding/SectionFAQ"
import { db } from "@/lib/store"

const TOTAL_STEPS = 6

const hostTypeCards = [
  { value: "hostel", label: "Hostel", description: "Social atmosphere with dorm and private rooms", icon: "🏨" },
  { value: "homestay", label: "Homestay", description: "Family-run space with personal touch", icon: "🏡" },
  { value: "eco-lodge", label: "Eco Lodge", description: "Sustainable accommodation in nature", icon: "🌿" },
  { value: "cafe", label: "Cafe", description: "Cozy cafe needing creative help", icon: "☕" },
  { value: "farm", label: "Farm", description: "Organic farming and rural life", icon: "🌾" },
  { value: "ngo", label: "NGO", description: "Non-profit with community impact", icon: "🤝" },
  { value: "school", label: "School", description: "Education and teaching focused", icon: "📚" },
  { value: "community-center", label: "Community Center", description: "Local gathering and development space", icon: "🏛️" },
  { value: "restaurant", label: "Restaurant", description: "Busy kitchen and dining experience", icon: "🍽️" },
  { value: "other", label: "Other", description: "Something unique and different", icon: "✨" },
]

const facilityOptions = [
  "wifi", "hot water", "kitchen access", "laundry", "parking",
  "common area", "garden", "rooftop", "cafe", "locker storage",
  "pickup service", "bicycle", "air conditioning", "heater",
]

interface HostForm {
  hostType: string
  businessName: string
  contactPerson: string
  description: string
  location: string
  city: string
  state: string
  website: string
  facilities: string[]
  languages: string
  houseRules: string
  emergencyName: string
  emergencyPhone: string
  hostPhoto: string
  propertyPhotos: string[]
  propertyVibe: string[]
  introVideo: string
  volunteerExperience: string[]
  volunteerExperienceDesc: string
}

const defaultForm: HostForm = {
  hostType: "", businessName: "", contactPerson: "", description: "",
  location: "", city: "", state: "", website: "",
  facilities: [], languages: "",
  houseRules: "", emergencyName: "", emergencyPhone: "",
  hostPhoto: "", propertyPhotos: [], propertyVibe: [],
  introVideo: "", volunteerExperience: [], volunteerExperienceDesc: "",
}

const stateOptions = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
]

export default function HostOnboardingPage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<HostForm>(() => {
    if (typeof window === "undefined") return defaultForm
    const saved = localStorage.getItem("vt_onboarding_host")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return { ...defaultForm, ...parsed }
      } catch {}
    }
    return defaultForm
  })

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        contactPerson: prev.contactPerson || user.name || "",
      }))
    }
  }, [user])

  const save = (updated: HostForm) => {
    localStorage.setItem("vt_onboarding_host", JSON.stringify(updated))
  }

  const update = (key: keyof HostForm, value: any) => {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      save(next)
      return next
    })
  }

  const toggleFacility = (facility: string) => {
    setForm(prev => {
      const next = {
        ...prev,
        facilities: prev.facilities.includes(facility)
          ? prev.facilities.filter(f => f !== facility)
          : [...prev.facilities, facility],
      }
      save(next)
      return next
    })
  }

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)
    db.hostProfiles.upsert({
      userId: user.id,
      hostType: form.hostType,
      businessName: form.businessName,
      contactPerson: form.contactPerson,
      description: form.description,
      location: form.location,
      city: form.city,
      state: form.state,
      facilities: form.facilities,
      photos: form.propertyPhotos,
      website: form.website,
      verificationStatus: "unverified",
      houseRules: form.houseRules.split("\n").filter(Boolean),
      languages: form.languages.split(",").map(l => l.trim()).filter(Boolean),
      emergencyContact: form.emergencyName ? { name: form.emergencyName, phone: form.emergencyPhone } : undefined,
      amenities: form.facilities,
      hostPhoto: form.hostPhoto || undefined,
      propertyVibe: form.propertyVibe,
      introVideo: form.introVideo || undefined,
      volunteerExperience: form.volunteerExperience,
      volunteerExperienceDesc: form.volunteerExperienceDesc || undefined,
    })
    db.users.update(user.id, { onboardingComplete: true })
    localStorage.removeItem("vt_onboarding_host")
    refreshUser()
    setLoading(false)
    router.push("/host/dashboard")
  }

  const renderStep = () => {
    switch (step) {
      case 0: return renderHostType()
      case 1: return renderBusinessDetails()
      case 2: return renderPhotos()
      case 3: return renderLocation()
      case 4: return renderRules()
      case 5: return renderReview()
      default: return null
    }
  }

  const renderHostType = () => (
    <div className="space-y-5">
      <RichCardSelect
        label="What type of host are you?"
        options={hostTypeCards}
        selected={form.hostType}
        onChange={v => update("hostType", v as string)}
      />
      <SectionFAQ
        items={[
          { question: "Can I change my host type later?", answer: "Yes! You can change your host type anytime from your profile settings. This is just to help volunteers understand the kind of experience you offer." },
        ]}
      />
    </div>
  )

  const renderBusinessDetails = () => (
    <div className="space-y-5">
      <Input label="Business / Organization Name" id="businessName" value={form.businessName} onChange={e => update("businessName", e.target.value)} placeholder="Your business name" />
      <Input label="Contact Person Name" id="contactPerson" value={form.contactPerson} onChange={e => update("contactPerson", e.target.value)} />
      <Textarea label="Description" id="description" value={form.description} onChange={e => update("description", e.target.value)} placeholder="Tell volunteers about your place, what makes it special..." />
      <Input label="Website (optional)" id="website" type="url" value={form.website} onChange={e => update("website", e.target.value)} placeholder="https://" />
      <SectionFAQ
        items={[
          { question: "Why do I need a description?", answer: "A good description helps volunteers understand what makes your space unique. Volunteers often choose hosts based on the warmth and detail of their description." },
        ]}
      />
    </div>
  )

  const renderPhotos = () => (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-brand-50 to-ocean-50 rounded-xl p-4 border border-brand-100">
        <p className="text-sm text-brand-700">Great photos help volunteers trust your place and understand the experience better.</p>
      </div>

      <HostPhotoUpload value={form.hostPhoto} onChange={v => update("hostPhoto", v)} />

      <div className="border-t border-gray-100 pt-6">
        <PropertyPhotoGrid photos={form.propertyPhotos} onChange={v => update("propertyPhotos", v)} />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <PropertyVibeSelector selected={form.propertyVibe} onChange={v => update("propertyVibe", v)} />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <IntroVideoInput value={form.introVideo} onChange={v => update("introVideo", v)} />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <ExperiencePreviewBlock
          selected={form.volunteerExperience}
          onChange={v => update("volunteerExperience", v)}
          description={form.volunteerExperienceDesc}
          onDescriptionChange={v => update("volunteerExperienceDesc", v)}
        />
      </div>
    </div>
  )

  const renderLocation = () => (
    <div className="space-y-5">
      <Input label="Address / Location" id="location" value={form.location} onChange={e => update("location", e.target.value)} placeholder="Street address or landmark" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="City" id="city" value={form.city} onChange={e => update("city", e.target.value)} placeholder="Your city" />
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-text uppercase tracking-wider">State</label>
          <select
            id="state"
            value={form.state}
            onChange={e => update("state", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 bg-white transition-all"
          >
            <option value="">Select state</option>
            {stateOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <Input label="Languages spoken (comma separated)" id="languages" value={form.languages} onChange={e => update("languages", e.target.value)} placeholder="Hindi, English" />
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-text uppercase tracking-wider">Facilities & Amenities</label>
        <div className="flex flex-wrap gap-2">
          {facilityOptions.map(f => (
            <button key={f} type="button" onClick={() => toggleFacility(f)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all capitalize ${
                form.facilities.includes(f)
                  ? "bg-brand-100 border-brand-400 text-brand-700 font-medium shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <SectionFAQ
        items={[
          { question: "How detailed should my address be?", answer: "Share your general area or landmark initially. Detailed address can be shared after a volunteer expresses interest." },
        ]}
      />
    </div>
  )

  const renderRules = () => (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
        <div className="flex items-start gap-2">
          <span className="text-lg">📋</span>
          <div className="text-xs text-amber-800 leading-relaxed">
            <p className="font-medium mb-0.5">Clear expectations lead to great experiences</p>
            Setting clear rules helps volunteers know what to expect and creates a positive environment for everyone.
          </div>
        </div>
      </div>

      <Textarea label="House Rules (one per line)" id="houseRules" value={form.houseRules} onChange={e => update("houseRules", e.target.value)}
        placeholder="No smoking indoors&#10;Quiet hours after 10pm&#10;Respect guest privacy" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Emergency Contact Name" id="emergencyName" value={form.emergencyName} onChange={e => update("emergencyName", e.target.value)} placeholder="Full name" />
        <Input label="Emergency Contact Phone" id="emergencyPhone" type="tel" value={form.emergencyPhone} onChange={e => update("emergencyPhone", e.target.value)} placeholder="Phone number" />
      </div>
      <SectionFAQ
        items={[
          { question: "Why do hosts need emergency contacts?", answer: "Emergency contacts are a standard safety measure. This information is only used in case of emergencies during a volunteer's stay." },
        ]}
      />
    </div>
  )

  const renderReview = () => {
    const hostTitle = hostTypeCards.find(c => c.value === form.hostType)
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileCompleteness
            hasHostPhoto={!!form.hostPhoto}
            propertyPhotoCount={form.propertyPhotos.length}
            hasVibes={form.propertyVibe.length > 0}
            hasIntroVideo={!!form.introVideo}
            hasExperience={form.volunteerExperience.length > 0}
            hasDescription={!!form.description}
            hasFacilities={form.facilities.length > 0}
            hasLocation={!!form.city}
          />
          <div className="bg-white rounded-xl border border-border shadow-sm p-4 space-y-3">
            <h4 className="text-sm font-semibold text-text">Host preview</h4>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0 border-2 border-gray-200">
                {form.hostPhoto ? (
                  <img src={form.hostPhoto} alt="Host" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text truncate">{form.contactPerson}</p>
                <p className="text-xs text-text-muted truncate">{form.businessName || hostTitle?.label || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>

        {form.propertyPhotos.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text mb-2">Property photos ({form.propertyPhotos.length})</h4>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {form.propertyPhotos.slice(0, 6).map((photo, idx) => (
                <div key={idx} className="w-20 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                  <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {form.propertyPhotos.length > 6 && (
                <div className="w-20 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-xs text-gray-500 font-medium">+{form.propertyPhotos.length - 6}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-border p-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-text">Profile summary</span>
            {hostTitle && <Badge variant="info" size="sm">{hostTitle.label}</Badge>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-text-muted">Business</span>
              <p className="text-text font-medium">{form.businessName || "Not set"}</p>
            </div>
            <div>
              <span className="text-text-muted">Location</span>
              <p className="text-text font-medium">{form.city || "Not set"}{form.state ? `, ${form.state}` : ""}</p>
            </div>
          </div>

          {form.description && (
            <div>
              <span className="text-xs text-text-muted">Description</span>
              <p className="text-text mt-0.5 leading-relaxed line-clamp-2">{form.description}</p>
            </div>
          )}

          {form.propertyVibe.length > 0 && (
            <div>
              <span className="text-xs text-text-muted">Vibe</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {form.propertyVibe.map(v => (
                  <Badge key={v} variant="purple" size="sm">{v}</Badge>
                ))}
              </div>
            </div>
          )}

          {form.volunteerExperience.length > 0 && (
            <div>
              <span className="text-xs text-text-muted">Experience</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {form.volunteerExperience.map(e => (
                  <Badge key={e} variant="success" size="sm">{e}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="text-xs text-text-muted">Facilities</span>
            <p className="text-text mt-0.5">{form.facilities.join(", ") || "None selected"}</p>
          </div>

          <div>
            <span className="text-xs text-text-muted">Languages</span>
            <p className="text-text mt-0.5">{form.languages || "Not set"}</p>
          </div>

          {form.introVideo && (
            <div>
              <span className="text-xs text-text-muted">Intro video</span>
              <p className="text-ocean-600 mt-0.5 truncate">{form.introVideo}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const stepLabels = ["Host Type", "Business Details", "Photos & Visual Identity", "Location & Facilities", "Rules & Expectations", "Review & Complete"]

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
            ? "Choose the type of host that best describes your space."
            : step === 1
            ? "Help volunteers understand what you offer and what makes your place special."
            : step === 2
            ? "Show off your space with great photos, vibe, and a personal intro."
            : step === 3
            ? "Where are you located and what facilities do you offer?"
            : step === 4
            ? "Set clear expectations for a smooth volunteer experience."
            : step === 5
            ? "Review everything before you go live."
            : undefined
        }
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        onBack={step > 0 ? () => { save(form); setStep(step - 1) } : undefined}
        onContinue={step === TOTAL_STEPS - 1 ? undefined : () => { save(form); setStep(step + 1) }}
        continueLabel={step === TOTAL_STEPS - 1 ? "Complete Profile" : "Continue"}
        continueDisabled={step === 1 ? !form.businessName : step === 0 ? !form.hostType : false}
        loading={loading}
        hideBack={step === 0}
      >
        {renderStep()}

        {step === TOTAL_STEPS - 1 && (
          <div className="flex justify-center mt-6">
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
