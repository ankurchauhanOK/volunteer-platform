"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { categoryOptions, stateOptions } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const existing = db.listings.find(id)

  const [form, setForm] = useState({
    title: existing?.title || "",
    category: existing?.category || "",
    location: existing?.location || "",
    city: existing?.city || "",
    state: existing?.state || "",
    description: existing?.description || "",
    tasks: existing?.tasks?.join("\n") || "",
    skillsRequired: existing?.skillsRequired?.join(", ") || "",
    workingHours: existing?.workingHours || "",
    stayDuration: existing?.stayDuration || "",
    startDate: existing?.startDate || "",
    endDate: existing?.endDate || "",
    accommodationDetails: existing?.accommodationDetails || "",
    safetyNotes: existing?.safetyNotes || "",
    volunteerCapacity: existing?.volunteerCapacity?.toString() || "1",
    houseRules: existing?.houseRules?.join("\n") || "",
    applicationQuestions: existing?.applicationQuestions?.join("\n") || "",
    tags: existing?.tags?.join(", ") || "",
    mealsIncluded: existing?.mealsIncluded ?? true,
    internetAvailable: existing?.internetAvailable ?? true,
    womenFriendly: existing?.womenFriendly || false,
    creativeTasks: existing?.creativeTasks || false,
    ecoProject: existing?.ecoProject || false,
  })
  const [loading, setLoading] = useState(false)

  const update = (key: string, value: string | boolean) => setForm({ ...form, [key]: value })

  const handleSave = (publish?: boolean) => {
    if (!user || !existing) return
    setLoading(true)

    db.listings.update(id, {
      title: form.title,
      category: form.category,
      location: form.location,
      city: form.city,
      state: form.state,
      description: form.description,
      tasks: form.tasks.split("\n").filter(Boolean),
      skillsRequired: form.skillsRequired.split(",").map(s => s.trim()).filter(Boolean),
      workingHours: form.workingHours,
      stayDuration: form.stayDuration,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      accommodationDetails: form.accommodationDetails,
      mealsIncluded: form.mealsIncluded,
      internetAvailable: form.internetAvailable,
      safetyNotes: form.safetyNotes,
      volunteerCapacity: parseInt(form.volunteerCapacity) || 1,
      houseRules: form.houseRules.split("\n").filter(Boolean),
      applicationQuestions: form.applicationQuestions.split("\n").filter(Boolean),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      visibility: publish ? "published" : existing.visibility,
      womenFriendly: form.womenFriendly,
      creativeTasks: form.creativeTasks,
      ecoProject: form.ecoProject,
    })

    setLoading(false)
    router.push("/host/listings")
  }

  if (!user || !existing) return null

  return (
    <AuthGuard requiredRole="host">
      <AppShell>
        <div className="bg-gray-50 min-h-screen py-8">
          <Container>
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
                    <Badge variant={existing.visibility === "published" ? "success" : "default"}>{existing.visibility}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{existing.title}</p>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Basic Information</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <Input label="Title" id="title" value={form.title} onChange={e => update("title", e.target.value)} />
                    <Select label="Category" id="category" value={form.category} onChange={e => update("category", e.target.value)}
                      options={categoryOptions.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))} placeholder="Select" />
                    <Textarea label="Description" id="description" value={form.description} onChange={e => update("description", e.target.value)} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Location</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <Input label="Address" id="location" value={form.location} onChange={e => update("location", e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" id="city" value={form.city} onChange={e => update("city", e.target.value)} />
                      <Select label="State" id="state" value={form.state} onChange={e => update("state", e.target.value)}
                        options={stateOptions.map(s => ({ value: s, label: s }))} placeholder="Select" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Tasks & Details</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea label="Tasks (one per line)" id="tasks" value={form.tasks} onChange={e => update("tasks", e.target.value)} />
                    <Input label="Skills Required (comma separated)" id="skillsRequired" value={form.skillsRequired} onChange={e => update("skillsRequired", e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Working Hours" id="workingHours" value={form.workingHours} onChange={e => update("workingHours", e.target.value)} />
                      <Input label="Stay Duration" id="stayDuration" value={form.stayDuration} onChange={e => update("stayDuration", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Start Date" type="date" id="startDate" value={form.startDate} onChange={e => update("startDate", e.target.value)} />
                      <Input label="End Date" type="date" id="endDate" value={form.endDate} onChange={e => update("endDate", e.target.value)} />
                    </div>
                    <Input label="Capacity" type="number" id="capacity" value={form.volunteerCapacity} onChange={e => update("volunteerCapacity", e.target.value)} />
                    <Textarea label="Accommodation" id="accommodation" value={form.accommodationDetails} onChange={e => update("accommodationDetails", e.target.value)} />
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" checked={form.mealsIncluded} onChange={e => update("mealsIncluded", e.target.checked)} />
                        <span className="text-sm text-gray-700">Meals included</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" checked={form.internetAvailable} onChange={e => update("internetAvailable", e.target.checked)} />
                        <span className="text-sm text-gray-700">Internet</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Additional</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea label="House Rules" id="houseRules" value={form.houseRules} onChange={e => update("houseRules", e.target.value)} />
                    <Textarea label="Safety Notes" id="safetyNotes" value={form.safetyNotes} onChange={e => update("safetyNotes", e.target.value)} />
                    <Textarea label="Application Questions" id="appQuestions" value={form.applicationQuestions} onChange={e => update("appQuestions", e.target.value)} />
                    <Input label="Tags" id="tags" value={form.tags} onChange={e => update("tags", e.target.value)} />
                    <div className="flex items-center gap-6">
                      {[
                        { key: "womenFriendly" as const, label: "Women-friendly" },
                        { key: "creativeTasks" as const, label: "Creative tasks" },
                        { key: "ecoProject" as const, label: "Eco project" },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" checked={form[key]} onChange={e => update(key, e.target.checked)} />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="danger" onClick={() => { if (confirm("Delete this listing?")) { db.listings.delete(id); router.push("/host/listings") } }}>
                    Delete
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => router.push("/host/listings")}>Cancel</Button>
                    <Button variant="outline" onClick={() => handleSave(false)} loading={loading}>Save Changes</Button>
                    {existing.visibility === "draft" && <Button onClick={() => handleSave(true)} loading={loading}>Publish</Button>}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </AppShell>
    </AuthGuard>
  )
}
