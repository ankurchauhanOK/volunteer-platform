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
import { skillOptions, interestOptions, destinationOptions } from "@/lib/utils"

const steps = ["Basic Details", "Skills & Interests", "Travel Preferences", "Emergency Contact", "Review"]

export default function VolunteerOnboardingPage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    age: "", gender: "", city: "", country: "India", bio: "",
    languages: "", skills: [] as string[], interests: [] as string[],
    preferredDestinations: [] as string[], availabilityStart: "", availabilityEnd: "",
    travelStyle: "", travelExperience: "",
    emergencyName: "", emergencyPhone: "", emergencyRelation: "",
  })

  const update = (key: string, value: string) => setForm({ ...form, [key]: value })
  const toggleArray = (key: "skills" | "interests" | "preferredDestinations", value: string) => {
    setForm({
      ...form,
      [key]: form[key].includes(value) ? form[key].filter(v => v !== value) : [...form[key], value],
    })
  }

  const calcCompleteness = () => {
    let filled = 0
    const fields = [form.age, form.gender, form.city, form.bio, form.languages, form.skills.length > 0, form.interests.length > 0, form.preferredDestinations.length > 0, form.travelStyle, form.emergencyName, form.emergencyPhone]
    fields.forEach(f => { if (f) filled++ })
    return Math.round((filled / fields.length) * 100)
  }

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)
    db.volunteerProfiles.upsert({
      userId: user.id,
      age: form.age ? parseInt(form.age) : undefined,
      gender: form.gender,
      city: form.city,
      country: form.country,
      bio: form.bio,
      languages: form.languages.split(",").map(l => l.trim()).filter(Boolean),
      skills: form.skills,
      interests: form.interests,
      preferredDestinations: form.preferredDestinations,
      availabilityStart: form.availabilityStart,
      availabilityEnd: form.availabilityEnd,
      travelStyle: form.travelStyle,
      travelExperience: form.travelExperience,
      emergencyContact: form.emergencyName ? { name: form.emergencyName, phone: form.emergencyPhone, relation: form.emergencyRelation } : undefined,
      profileCompleteness: calcCompleteness(),
    })
    db.users.update(user.id, { onboardingComplete: true })
    refreshUser()
    setLoading(false)
    router.push("/volunteer/dashboard")
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Age" type="number" id="age" value={form.age} onChange={e => update("age", e.target.value)} />
              <Select label="Gender" id="gender" value={form.gender} onChange={e => update("gender", e.target.value)}
                options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }, { value: "prefer-not", label: "Prefer not to say" }]}
                placeholder="Select gender" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" id="city" value={form.city} onChange={e => update("city", e.target.value)} />
              <Input label="Country" id="country" value={form.country} onChange={e => update("country", e.target.value)} />
            </div>
            <Textarea label="About you" id="bio" value={form.bio} onChange={e => update("bio", e.target.value)} placeholder="Tell hosts a bit about yourself..." />
            <Input label="Languages spoken (comma separated)" id="languages" value={form.languages} onChange={e => update("languages", e.target.value)} placeholder="Hindi, English, Marathi" />
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map(skill => (
                  <button key={skill} type="button" onClick={() => toggleArray("skills", skill)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${form.skills.includes(skill) ? "bg-brand-100 border-brand-400 text-brand-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Interests</label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => (
                  <button key={interest} type="button" onClick={() => toggleArray("interests", interest)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${form.interests.includes(interest) ? "bg-ocean-100 border-ocean-400 text-ocean-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <Textarea label="Travel Experience" id="travelExperience" value={form.travelExperience} onChange={e => update("travelExperience", e.target.value)} placeholder="Have you traveled before? Where? Solo or group?" />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Destinations</label>
              <div className="flex flex-wrap gap-2">
                {destinationOptions.map(dest => (
                  <button key={dest} type="button" onClick={() => toggleArray("preferredDestinations", dest)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${form.preferredDestinations.includes(dest) ? "bg-brand-100 border-brand-400 text-brand-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {dest}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Available from" type="date" id="availStart" value={form.availabilityStart} onChange={e => update("availabilityStart", e.target.value)} />
              <Input label="Available until" type="date" id="availEnd" value={form.availabilityEnd} onChange={e => update("availabilityEnd", e.target.value)} />
            </div>
            <Select label="Travel Style" id="travelStyle" value={form.travelStyle} onChange={e => update("travelStyle", e.target.value)}
              options={[{ value: "solo", label: "Solo" }, { value: "with-partner", label: "With partner" }, { value: "with-friends", label: "With friends" }, { value: "group", label: "Group" }]}
              placeholder="How do you usually travel?" />
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-800">
              This information is only shared with hosts after your application is accepted. It helps ensure your safety.
            </div>
            <Input label="Emergency Contact Name" id="emergencyName" value={form.emergencyName} onChange={e => update("emergencyName", e.target.value)} />
            <Input label="Emergency Contact Phone" id="emergencyPhone" type="tel" value={form.emergencyPhone} onChange={e => update("emergencyPhone", e.target.value)} />
            <Input label="Relation" id="emergencyRelation" value={form.emergencyRelation} onChange={e => update("emergencyRelation", e.target.value)} placeholder="e.g. Parent, Sibling, Friend" />
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Review your profile</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <p><span className="font-medium">Age:</span> {form.age || "Not set"}</p>
              <p><span className="font-medium">Gender:</span> {form.gender || "Not set"}</p>
              <p><span className="font-medium">Location:</span> {form.city || "Not set"}, {form.country}</p>
              <p><span className="font-medium">Bio:</span> {form.bio || "Not set"}</p>
              <p><span className="font-medium">Languages:</span> {form.languages || "Not set"}</p>
              <p><span className="font-medium">Skills:</span> {form.skills.join(", ") || "None selected"}</p>
              <p><span className="font-medium">Interests:</span> {form.interests.join(", ") || "None selected"}</p>
              <p><span className="font-medium">Preferred destinations:</span> {form.preferredDestinations.join(", ") || "None selected"}</p>
              <p><span className="font-medium">Travel style:</span> {form.travelStyle || "Not set"}</p>
            </div>
            <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-brand-700">Profile Completeness</span>
                <span className="text-sm font-bold text-brand-700">{calcCompleteness()}%</span>
              </div>
              <div className="w-full bg-brand-200 rounded-full h-2">
                <div className="bg-brand-600 h-2 rounded-full transition-all" style={{ width: `${calcCompleteness()}%` }} />
              </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Complete your volunteer profile</h1>
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
