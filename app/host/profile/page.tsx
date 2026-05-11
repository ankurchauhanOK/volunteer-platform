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
import { categoryOptions, stateOptions } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { AlertTriangle, Loader2 } from "lucide-react"

export default function HostProfilePage() {
  const { user, deleteAccount } = useAuth()
  const router = useRouter()
  const existing = user ? db.hostProfiles.find(user.id) : null

  const [form, setForm] = useState({
    hostType: existing?.hostType || "",
    businessName: existing?.businessName || "",
    contactPerson: existing?.contactPerson || user?.name || "",
    description: existing?.description || "",
    location: existing?.location || "",
    city: existing?.city || "",
    state: existing?.state || "",
    website: existing?.website || "",
    languages: existing?.languages?.join(", ") || "",
    houseRules: existing?.houseRules?.join("\n") || "",
    emergencyName: existing?.emergencyContact?.name || "",
    emergencyPhone: existing?.emergencyContact?.phone || "",
  })
  const [saved, setSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSave = () => {
    if (!user) return
    db.hostProfiles.upsert({
      userId: user.id,
      hostType: form.hostType,
      businessName: form.businessName,
      contactPerson: form.contactPerson,
      description: form.description,
      location: form.location,
      city: form.city,
      state: form.state,
      facilities: existing?.facilities || [],
      photos: existing?.photos || [],
      website: form.website,
      verificationStatus: existing?.verificationStatus || "unverified",
      houseRules: form.houseRules.split("\n").filter(Boolean),
      languages: form.languages.split(",").map(l => l.trim()).filter(Boolean),
      emergencyContact: form.emergencyName ? { name: form.emergencyName, phone: form.emergencyPhone } : undefined,
      amenities: existing?.amenities || [],
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
    <AuthGuard requiredRole="host">
      <AppShell>
        <div className="bg-gray-50 min-h-screen py-8">
          <Container>
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-tanker text-2xl text-text">Edit Host Profile</h1>
                  <p className="text-sm text-gray-500">Manage your host information</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                  <Button onClick={handleSave}>{saved ? "Saved!" : "Save Changes"}</Button>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Business Information</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <Select label="Host Type" id="hostType" value={form.hostType} onChange={e => setForm({ ...form, hostType: e.target.value })}
                      options={categoryOptions.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))} placeholder="Select type" />
                    <Input label="Business / Organization Name" id="businessName" value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} />
                    <Input label="Contact Person" id="contactPerson" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} />
                    <Textarea label="Description" id="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    <Input label="Website" id="website" type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Location & Contact</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <Input label="Address" id="location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" id="city" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                      <Select label="State" id="state" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
                        options={stateOptions.map(s => ({ value: s, label: s }))} placeholder="Select" />
                    </div>
                    <Input label="Languages" id="languages" value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Rules & Emergency</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea label="House Rules (one per line)" id="houseRules" value={form.houseRules} onChange={e => setForm({ ...form, houseRules: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Emergency Contact Name" id="emName" value={form.emergencyName} onChange={e => setForm({ ...form, emergencyName: e.target.value })} />
                      <Input label="Emergency Phone" id="emPhone" type="tel" value={form.emergencyPhone} onChange={e => setForm({ ...form, emergencyPhone: e.target.value })} />
                    </div>
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
                        <p className="text-xs text-red-600">All your listings, applications, messages, and profile data will be permanently removed.</p>
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
