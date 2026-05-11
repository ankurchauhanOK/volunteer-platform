"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { skillOptions, interestOptions, destinationOptions } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { AlertTriangle } from "lucide-react"

export default function VolunteerProfilePage() {
  const { user, refreshUser, deleteAccount } = useAuth()
  const router = useRouter()
  const existing = user ? db.volunteerProfiles.find(user.id) : null

  const [form, setForm] = useState({
    age: existing?.age?.toString() || "",
    gender: existing?.gender || "",
    city: existing?.city || "",
    country: existing?.country || "India",
    bio: existing?.bio || "",
    languages: existing?.languages?.join(", ") || "",
    skills: existing?.skills || [],
    interests: existing?.interests || [],
    preferredDestinations: existing?.preferredDestinations || [],
    travelStyle: existing?.travelStyle || "",
    travelExperience: existing?.travelExperience || "",
    emergencyName: existing?.emergencyContact?.name || "",
    emergencyPhone: existing?.emergencyContact?.phone || "",
    emergencyRelation: existing?.emergencyContact?.relation || "",
  })
  const [saved, setSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const toggleArray = (key: "skills" | "interests" | "preferredDestinations", value: string) => {
    setForm({
      ...form,
      [key]: form[key].includes(value) ? form[key].filter(v => v !== value) : [...form[key], value],
    })
  }

  const handleSave = () => {
    if (!user) return
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
      travelStyle: form.travelStyle,
      travelExperience: form.travelExperience,
      emergencyContact: form.emergencyName ? { name: form.emergencyName, phone: form.emergencyPhone, relation: form.emergencyRelation } : undefined,
      profileCompleteness: existing?.profileCompleteness || 50,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    setDeleting(true)
    await new Promise(r => setTimeout(r, 500))
    deleteAccount()
    router.push("/")
  }

  if (!user) return null

  return (
    <AuthGuard requiredRole="volunteer">
      <AppShell>
        <div className="bg-gray-50 min-h-screen py-8">
          <Container>
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                  <p className="text-sm text-gray-500">Update your volunteer profile</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                  <Button onClick={handleSave}>{saved ? "Saved!" : "Save Changes"}</Button>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Basic Information</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Age" type="number" id="age" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
                      <Select label="Gender" id="gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                        options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }, { value: "prefer-not", label: "Prefer not to say" }]}
                        placeholder="Select" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" id="city" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                      <Input label="Country" id="country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                    </div>
                    <Textarea label="Bio" id="bio" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
                    <Input label="Languages" id="languages" value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} placeholder="Hindi, English..." />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Skills & Interests</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {skillOptions.map(s => (
                          <button key={s} type="button" onClick={() => toggleArray("skills", s)}
                            className={`px-3 py-1.5 rounded-full text-sm border transition-all capitalize ${form.skills.includes(s) ? "bg-brand-100 border-brand-400 text-brand-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                      <div className="flex flex-wrap gap-2">
                        {interestOptions.map(i => (
                          <button key={i} type="button" onClick={() => toggleArray("interests", i)}
                            className={`px-3 py-1.5 rounded-full text-sm border transition-all capitalize ${form.interests.includes(i) ? "bg-ocean-100 border-ocean-400 text-ocean-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>{i}</button>
                        ))}
                      </div>
                    </div>
                    <Textarea label="Travel Experience" id="travelExp" value={form.travelExperience} onChange={e => setForm({ ...form, travelExperience: e.target.value })} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Travel Preferences</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Destinations</label>
                      <div className="flex flex-wrap gap-2">
                        {destinationOptions.map(d => (
                          <button key={d} type="button" onClick={() => toggleArray("preferredDestinations", d)}
                            className={`px-3 py-1.5 rounded-full text-sm border transition-all ${form.preferredDestinations.includes(d) ? "bg-brand-100 border-brand-400 text-brand-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>{d}</button>
                        ))}
                      </div>
                    </div>
                    <Select label="Travel Style" id="travelStyle" value={form.travelStyle} onChange={e => setForm({ ...form, travelStyle: e.target.value })}
                      options={[{ value: "solo", label: "Solo" }, { value: "with-partner", label: "With partner" }, { value: "with-friends", label: "With friends" }]}
                      placeholder="Select style" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Emergency Contact</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-gray-500">Only shared with hosts after acceptance</p>
                    <Input label="Contact Name" id="emName" value={form.emergencyName} onChange={e => setForm({ ...form, emergencyName: e.target.value })} />
                    <Input label="Contact Phone" id="emPhone" type="tel" value={form.emergencyPhone} onChange={e => setForm({ ...form, emergencyPhone: e.target.value })} />
                    <Input label="Relation" id="emRel" value={form.emergencyRelation} onChange={e => setForm({ ...form, emergencyRelation: e.target.value })} />
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader><h2 className="font-semibold text-red-800 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Danger Zone</h2></CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-red-700">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    {!showDeleteConfirm ? (
                      <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                        Delete Account
                      </Button>
                    ) : (
                      <div className="space-y-3 bg-white rounded-xl border border-red-200 p-4">
                        <p className="text-sm font-medium text-red-800">Are you absolutely sure?</p>
                        <p className="text-xs text-red-600">All your applications, messages, and profile data will be permanently removed.</p>
                        <div className="flex gap-2">
                          <Button variant="destructive" onClick={handleDeleteAccount} loading={deleting}>
                            {deleting ? "Deleting..." : "Yes, Delete My Account"}
                          </Button>
                          <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </div>
      </AppShell>
    </AuthGuard>
  )
}
