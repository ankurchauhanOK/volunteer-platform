"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Providers } from "@/components/Providers"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { HostPhotoUpload } from "@/components/onboarding/HostPhotoUpload"
import { PropertyPhotoGrid } from "@/components/onboarding/PropertyPhotoGrid"
import { PropertyVibeSelector } from "@/components/onboarding/PropertyVibeSelector"
import { IntroVideoInput } from "@/components/onboarding/IntroVideoInput"
import { ExperiencePreviewBlock } from "@/components/onboarding/ExperiencePreviewBlock"
import { ProfileCompleteness } from "@/components/onboarding/ProfileCompleteness"
import { db } from "@/lib/store"
import { categoryOptions, stateOptions, vibeOptions, experienceOptions } from "@/lib/utils"

const steps = ["Host Type", "Business Details", "Photos & Visual Identity", "Location & Facilities", "Rules & Expectations", "Review & Complete"]

export default function HostOnboardingPage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    hostType: "", businessName: "", contactPerson: user?.name || "", description: "",
    location: "", city: "", state: "", website: "",
    facilities: [] as string[], languages: "",
    houseRules: "", emergencyName: "", emergencyPhone: "",
    hostPhoto: "", propertyPhotos: [] as string[], propertyVibe: [] as string[],
    introVideo: "", volunteerExperience: [] as string[], volunteerExperienceDesc: "",
  })

  const update = (key: string, value: string) => setForm({ ...form, [key]: value })
  const toggleFacility = (facility: string) => {
    setForm({
      ...form,
      facilities: form.facilities.includes(facility)
        ? form.facilities.filter(f => f !== facility)
        : [...form.facilities, facility],
    })
  }

  const facilityOptions = [
    "wifi", "hot water", "kitchen access", "laundry", "parking",
    "common area", "garden", "rooftop", "cafe", "locker storage",
    "pickup service", "bicycle", "air conditioning", "heater",
  ]

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
    refreshUser()
    setLoading(false)
    router.push("/host/dashboard")
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 animate-fade-in">
            <Select label="What type of host are you?" id="hostType" value={form.hostType} onChange={e => update("hostType", e.target.value)}
              options={categoryOptions.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
              placeholder="Select your host type" />
            <p className="text-xs text-gray-500">Don&apos;t worry, you can change this later.</p>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <Input label="Business / Organization Name" id="businessName" value={form.businessName} onChange={e => update("businessName", e.target.value)} placeholder="Your business name" />
            <Input label="Contact Person Name" id="contactPerson" value={form.contactPerson} onChange={e => update("contactPerson", e.target.value)} />
            <Textarea label="Description" id="description" value={form.description} onChange={e => update("description", e.target.value)} placeholder="Tell volunteers about your place, what makes it special..." />
            <Input label="Website (optional)" id="website" type="url" value={form.website} onChange={e => update("website", e.target.value)} placeholder="https://" />
          </div>
        )
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-brand-50 to-ocean-50 rounded-xl p-4 border border-brand-100">
              <p className="text-sm text-brand-700">Great photos help volunteers trust your place and understand the experience better.</p>
            </div>

            <HostPhotoUpload value={form.hostPhoto} onChange={v => update("hostPhoto", v)} />

            <div className="border-t border-gray-100 pt-6">
              <PropertyPhotoGrid photos={form.propertyPhotos} onChange={v => setForm({ ...form, propertyPhotos: v })} />
            </div>

            <div className="border-t border-gray-100 pt-6">
              <PropertyVibeSelector selected={form.propertyVibe} onChange={v => setForm({ ...form, propertyVibe: v })} />
            </div>

            <div className="border-t border-gray-100 pt-6">
              <IntroVideoInput value={form.introVideo} onChange={v => update("introVideo", v)} />
            </div>

            <div className="border-t border-gray-100 pt-6">
              <ExperiencePreviewBlock
                selected={form.volunteerExperience}
                onChange={v => setForm({ ...form, volunteerExperience: v })}
                description={form.volunteerExperienceDesc}
                onDescriptionChange={v => update("volunteerExperienceDesc", v)}
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4 animate-fade-in">
            <Input label="Address / Location" id="location" value={form.location} onChange={e => update("location", e.target.value)} placeholder="Street address or landmark" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" id="city" value={form.city} onChange={e => update("city", e.target.value)} />
              <Select label="State" id="state" value={form.state} onChange={e => update("state", e.target.value)}
                options={stateOptions.map(s => ({ value: s, label: s }))} placeholder="Select state" />
            </div>
            <Input label="Languages spoken (comma separated)" id="languages" value={form.languages} onChange={e => update("languages", e.target.value)} placeholder="Hindi, English" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facilities & Amenities</label>
              <div className="flex flex-wrap gap-2">
                {facilityOptions.map(f => (
                  <button key={f} type="button" onClick={() => toggleFacility(f)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all capitalize ${form.facilities.includes(f) ? "bg-brand-100 border-brand-400 text-brand-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4 animate-fade-in">
            <Textarea label="House Rules (one per line)" id="houseRules" value={form.houseRules} onChange={e => update("houseRules", e.target.value)} placeholder="No smoking indoors&#10;Quiet hours after 10pm&#10;Respect guest privacy" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Emergency Contact Name" id="emergencyName" value={form.emergencyName} onChange={e => update("emergencyName", e.target.value)} />
              <Input label="Emergency Contact Phone" id="emergencyPhone" type="tel" value={form.emergencyPhone} onChange={e => update("emergencyPhone", e.target.value)} />
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-5 animate-fade-in">
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
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Host preview</h4>
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
                    <p className="text-sm font-medium text-gray-900 truncate">{form.contactPerson}</p>
                    <p className="text-xs text-gray-500 truncate">{form.businessName || form.hostType}</p>
                  </div>
                </div>
              </div>
            </div>

            {form.propertyPhotos.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Property photos ({form.propertyPhotos.length})</h4>
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

            <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Profile summary</span>
                <Badge variant="info" size="sm">{form.hostType ? form.hostType.charAt(0).toUpperCase() + form.hostType.slice(1) : "Not set"}</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Business</span>
                  <p className="text-gray-700 font-medium">{form.businessName || "Not set"}</p>
                </div>
                <div>
                  <span className="text-gray-400">Location</span>
                  <p className="text-gray-700 font-medium">{form.city}{form.state ? `, ${form.state}` : "Not set"}</p>
                </div>
              </div>

              {form.description && (
                <div>
                  <span className="text-xs text-gray-400">Description</span>
                  <p className="text-gray-700 mt-0.5 leading-relaxed line-clamp-2">{form.description}</p>
                </div>
              )}

              {form.propertyVibe.length > 0 && (
                <div>
                  <span className="text-xs text-gray-400">Vibe</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {form.propertyVibe.map(v => (
                      <Badge key={v} variant="purple" size="sm">{v}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {form.volunteerExperience.length > 0 && (
                <div>
                  <span className="text-xs text-gray-400">Experience</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {form.volunteerExperience.map(e => (
                      <Badge key={e} variant="success" size="sm">{e}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs text-gray-400">Facilities</span>
                <p className="text-gray-700 mt-0.5">{form.facilities.join(", ") || "None selected"}</p>
              </div>

              <div>
                <span className="text-xs text-gray-400">Languages</span>
                <p className="text-gray-700 mt-0.5">{form.languages || "Not set"}</p>
              </div>

              {form.introVideo && (
                <div>
                  <span className="text-xs text-gray-400">Intro video</span>
                  <p className="text-ocean-600 mt-0.5 truncate">{form.introVideo}</p>
                </div>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-b from-brand-50/30 via-white to-white py-6 sm:py-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
              </svg>
            </div>
            <span className="text-base font-bold text-gray-900">Voluntree</span>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-brand-600">
              Step {step + 1} of {steps.length}
            </span>
            <span className="text-xs text-gray-400">{steps[step]}</span>
          </div>

          <div className="flex gap-1 mb-6">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-brand-500" : "bg-gray-200"}`} />
            ))}
          </div>

          <Card>
            <CardContent className="p-5 sm:p-7">
              {renderStep()}
              <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                  Back
                </Button>
                {step === steps.length - 1 ? (
                  <Button onClick={handleSubmit} loading={loading}>
                    Complete Profile
                  </Button>
                ) : (
                  <Button onClick={() => setStep(step + 1)}>
                    Continue
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-gray-400 mt-4">
            Your progress is saved automatically
          </p>
        </div>
      </div>
    </Providers>
  )
}
