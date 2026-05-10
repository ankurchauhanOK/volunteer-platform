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
import { db } from "@/lib/store"
import { categoryOptions, stateOptions } from "@/lib/utils"

const steps = ["Host Type", "Business Details", "Location & Facilities", "Rules & Expectations", "Review"]

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
      photos: [],
      website: form.website,
      verificationStatus: "unverified",
      houseRules: form.houseRules.split("\n").filter(Boolean),
      languages: form.languages.split(",").map(l => l.trim()).filter(Boolean),
      emergencyContact: form.emergencyName ? { name: form.emergencyName, phone: form.emergencyPhone } : undefined,
      amenities: form.facilities,
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
          <div className="space-y-4">
            <Select label="What type of host are you?" id="hostType" value={form.hostType} onChange={e => update("hostType", e.target.value)}
              options={categoryOptions.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
              placeholder="Select your host type" />
            <p className="text-xs text-gray-500">Don&apos;t worry, you can change this later.</p>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <Input label="Business / Organization Name" id="businessName" value={form.businessName} onChange={e => update("businessName", e.target.value)} placeholder="Your business name" />
            <Input label="Contact Person Name" id="contactPerson" value={form.contactPerson} onChange={e => update("contactPerson", e.target.value)} />
            <Textarea label="Description" id="description" value={form.description} onChange={e => update("description", e.target.value)} placeholder="Tell volunteers about your place, what makes it special..." />
            <Input label="Website (optional)" id="website" type="url" value={form.website} onChange={e => update("website", e.target.value)} placeholder="https://" />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
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
      case 3:
        return (
          <div className="space-y-4">
            <Textarea label="House Rules (one per line)" id="houseRules" value={form.houseRules} onChange={e => update("houseRules", e.target.value)} placeholder="No smoking indoors&#10;Quiet hours after 10pm&#10;Respect guest privacy" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Emergency Contact Name" id="emergencyName" value={form.emergencyName} onChange={e => update("emergencyName", e.target.value)} />
              <Input label="Emergency Contact Phone" id="emergencyPhone" type="tel" value={form.emergencyPhone} onChange={e => update("emergencyPhone", e.target.value)} />
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Review your host profile</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <p><span className="font-medium">Type:</span> {form.hostType ? form.hostType.charAt(0).toUpperCase() + form.hostType.slice(1) : "Not set"}</p>
              <p><span className="font-medium">Business:</span> {form.businessName || "Not set"}</p>
              <p><span className="font-medium">Contact:</span> {form.contactPerson}</p>
              <p><span className="font-medium">Location:</span> {form.city}{form.state ? `, ${form.state}` : ""}</p>
              <p><span className="font-medium">Facilities:</span> {form.facilities.join(", ") || "None selected"}</p>
              <p><span className="font-medium">Languages:</span> {form.languages || "Not set"}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">Voluntree</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Set up your host profile</h1>
            <p className="text-sm text-gray-500 mt-1">Step {step + 1} of {steps.length}: {steps[step]}</p>
            <div className="flex gap-1 mt-4">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-500" : "bg-gray-200"}`} />
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
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
        </div>
      </div>
    </Providers>
  )
}
