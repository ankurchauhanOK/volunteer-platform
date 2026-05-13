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
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
        <div className="space-y-3">
          <RichCardSelect
            label="What type of host are you?"
            options={hostTypeCards}
            selected={form.hostType}
            onChange={v => update("hostType", v as string)}
          />
          <SectionFAQ
            items={[
              { question: "Can I change my host type later?", answer: "Yes! Change anytime from profile settings. This just helps volunteers understand your experience." },
            ]}
          />
        </div>
      </div>
    </div>
  )

  const renderBusinessDetails = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        <Input label="Business / Organization Name" id="businessName" value={form.businessName} onChange={e => update("businessName", e.target.value)} placeholder="Your business name" />
        <Input label="Contact Person" id="contactPerson" value={form.contactPerson} onChange={e => update("contactPerson", e.target.value)} />
      </div>
      <Textarea label="Description" id="description" value={form.description} onChange={e => update("description", e.target.value)} placeholder="Tell volunteers about your place, what makes it special..." />
      <Input label="Website (optional)" id="website" type="url" value={form.website} onChange={e => update("website", e.target.value)} placeholder="https://" />
      <SectionFAQ
        items={[
          { question: "Why do I need a description?", answer: "A warm description helps volunteers choose your space. Detail what makes your place unique." },
        ]}
      />
    </div>
  )

  const renderPhotos = () => (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-brand-50 to-ocean-50 rounded-lg p-3 border border-brand-100">
        <p className="text-xs text-brand-700">Great photos help volunteers trust your place.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-text uppercase tracking-wider">Host photo</p>
          <HostPhotoUpload value={form.hostPhoto} onChange={v => update("hostPhoto", v)} />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-text uppercase tracking-wider">Intro video</p>
          <IntroVideoInput value={form.introVideo} onChange={v => update("introVideo", v)} />
        </div>
      </div>

      <PropertyPhotoGrid photos={form.propertyPhotos} onChange={v => update("propertyPhotos", v)} />
      <PropertyVibeSelector selected={form.propertyVibe} onChange={v => update("propertyVibe", v)} />
      <ExperiencePreviewBlock
        selected={form.volunteerExperience}
        onChange={v => update("volunteerExperience", v)}
        description={form.volunteerExperienceDesc}
        onDescriptionChange={v => update("volunteerExperienceDesc", v)}
      />
    </div>
  )

  const renderLocation = () => (
    <div className="space-y-3">
      <Input label="Address / Location" id="location" value={form.location} onChange={e => update("location", e.target.value)} placeholder="Street address or landmark" />
      <div className="grid grid-cols-2 gap-2.5">
        <Input label="City" id="city" value={form.city} onChange={e => update("city", e.target.value)} placeholder="Your city" />
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-text uppercase tracking-wider">State</label>
          <select
            id="state"
            value={form.state}
            onChange={e => update("state", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-100 bg-white transition-all"
          >
            <option value="">Select state</option>
            {stateOptions.map(s => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
      </div>
      <Input label="Languages spoken (comma separated)" id="languages" value={form.languages} onChange={e => update("languages", e.target.value)} placeholder="Hindi, English" />
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-text uppercase tracking-wider">Facilities & Amenities</label>
        <div className="flex flex-wrap gap-1.5">
          {facilityOptions.map(f => (
            <button key={f} type="button" onClick={() => toggleFacility(f)}
              className={`px-2.5 py-1 rounded-full text-[11px] border transition-all capitalize ${
                form.facilities.includes(f)
                  ? "bg-brand-100 border-brand-300 text-brand-700 font-medium"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <SectionFAQ
        items={[
          { question: "How detailed should my address be?", answer: "Share your general area initially. Detailed address can be shared after a volunteer expresses interest." },
        ]}
      />
    </div>
  )

  const renderRules = () => (
    <div className="space-y-3">
      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
        <span className="text-base">📋</span>
        <div className="text-[11px] text-amber-800 leading-relaxed">
          <p className="font-medium">Clear expectations lead to great experiences</p>
          Setting clear rules creates a positive environment for everyone.
        </div>
      </div>

      <Textarea label="House Rules (one per line)" id="houseRules" value={form.houseRules} onChange={e => update("houseRules", e.target.value)}
        placeholder="No smoking indoors&#10;Quiet hours after 10pm&#10;Respect guest privacy" />
      <div className="grid grid-cols-2 gap-2.5">
        <Input label="Emergency Contact Name" id="emergencyName" value={form.emergencyName} onChange={e => update("emergencyName", e.target.value)} placeholder="Full name" />
        <Input label="Emergency Contact Phone" id="emergencyPhone" type="tel" value={form.emergencyPhone} onChange={e => update("emergencyPhone", e.target.value)} placeholder="Phone number" />
      </div>
      <SectionFAQ
        items={[
          { question: "Why do hosts need emergency contacts?", answer: "Standard safety measure. Only used in case of emergencies during a volunteer's stay." },
        ]}
      />
    </div>
  )

  const renderReview = () => {
    const hostTitle = hostTypeCards.find(c => c.value === form.hostType)
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <div className="bg-white rounded-lg border border-border p-3 space-y-2">
            <h4 className="text-xs font-semibold text-text">Host preview</h4>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                {form.hostPhoto ? (
                  <img src={form.hostPhoto} alt="Host" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-text truncate">{form.contactPerson}</p>
                <p className="text-[10px] text-text-muted truncate">{form.businessName || hostTitle?.label || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>

        {form.propertyPhotos.length > 0 && (
          <div>
            <h4 className="text-[10px] font-semibold text-text mb-1">Property photos ({form.propertyPhotos.length})</h4>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {form.propertyPhotos.slice(0, 6).map((photo, idx) => (
                <div key={idx} className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                  <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {form.propertyPhotos.length > 6 && (
                <div className="w-16 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-gray-500 font-medium">+{form.propertyPhotos.length - 6}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-border p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-text">Profile summary</span>
            {hostTitle && <Badge variant="info" size="sm">{hostTitle.label}</Badge>}
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div><span className="text-text-muted">Business</span><p className="text-text font-medium">{form.businessName || "Not set"}</p></div>
            <div><span className="text-text-muted">Location</span><p className="text-text font-medium">{form.city || "Not set"}{form.state ? `, ${form.state}` : ""}</p></div>
          </div>

          {form.description && <div><span className="text-[10px] text-text-muted">Description</span><p className="text-text mt-0.5 leading-relaxed line-clamp-2">{form.description}</p></div>}

          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {form.propertyVibe.length > 0 && (
              <div><span className="text-[10px] text-text-muted">Vibe</span><div className="flex flex-wrap gap-1 mt-0.5">{form.propertyVibe.map(v => <Badge key={v} variant="purple" size="sm">{v}</Badge>)}</div></div>
            )}
            {form.volunteerExperience.length > 0 && (
              <div><span className="text-[10px] text-text-muted">Experience</span><div className="flex flex-wrap gap-1 mt-0.5">{form.volunteerExperience.map(e => <Badge key={e} variant="success" size="sm">{e}</Badge>)}</div></div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div><span className="text-text-muted">Facilities</span><p className="text-text mt-0.5">{form.facilities.join(", ") || "None selected"}</p></div>
            <div><span className="text-text-muted">Languages</span><p className="text-text mt-0.5">{form.languages || "Not set"}</p></div>
          </div>

          {form.introVideo && <div><span className="text-[10px] text-text-muted">Intro video</span><p className="text-ocean-600 mt-0.5 truncate">{form.introVideo}</p></div>}
        </div>

        <div className="flex justify-center pt-1">
          <Button onClick={handleSubmit} loading={loading} size="lg" className="w-full sm:w-auto">
            Complete Profile
          </Button>
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
          step === 0 ? "Choose the type of host that best describes your space."
          : step === 1 ? "Help volunteers understand what you offer."
          : step === 2 ? "Show off your space with great photos and a personal intro."
          : step === 3 ? "Where are you located and what facilities do you offer?"
          : step === 4 ? "Set clear expectations for a smooth volunteer experience."
          : step === 5 ? "Review everything before you go live."
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
        dashboard={step === 0}
      >
        {renderStep()}
      </StepLayout>
    </Providers>
  )
}
