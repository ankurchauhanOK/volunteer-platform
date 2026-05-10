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
import type { OpportunityListing } from "@/lib/types"

export default function CreateListingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: "", category: "", location: "", city: "", state: "",
    description: "", tasks: "", skillsRequired: "", workingHours: "",
    stayDuration: "", startDate: "", endDate: "",
    accommodationDetails: "", safetyNotes: "",
    volunteerCapacity: "1", houseRules: "",
    applicationQuestions: "", tags: "",
    mealsIncluded: true, internetAvailable: true,
    visibility: "draft" as "draft" | "published",
    womenFriendly: false, creativeTasks: false, ecoProject: false,
  })

  const update = (key: string, value: string | boolean) => setForm({ ...form, [key]: value })

  const handleSubmit = (publish: boolean) => {
    if (!user) return
    setLoading(true)

    const listing = db.listings.create({
      hostId: user.id,
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
      photos: [],
      volunteerCapacity: parseInt(form.volunteerCapacity) || 1,
      houseRules: form.houseRules.split("\n").filter(Boolean),
      applicationQuestions: form.applicationQuestions.split("\n").filter(Boolean),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      visibility: publish ? "published" : "draft",
      womenFriendly: form.womenFriendly,
      creativeTasks: form.creativeTasks,
      ecoProject: form.ecoProject,
    })

    setLoading(false)
    router.push("/host/listings")
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
                  <h1 className="text-2xl font-bold text-gray-900">Create Opportunity</h1>
                  <p className="text-sm text-gray-500">List a new volunteer opportunity</p>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Basic Information</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <Input label="Title" id="title" value={form.title} onChange={e => update("title", e.target.value)} placeholder="e.g. Help run our mountain hostel" required />
                    <Select label="Category" id="category" value={form.category} onChange={e => update("category", e.target.value)}
                      options={categoryOptions.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))} placeholder="Select category" required />
                    <Textarea label="Description" id="description" value={form.description} onChange={e => update("description", e.target.value)} placeholder="Describe the opportunity, your place, and what makes it special..." required />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Location</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <Input label="Full Address / Location" id="location" value={form.location} onChange={e => update("location", e.target.value)} placeholder="Street address, landmark" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" id="city" value={form.city} onChange={e => update("city", e.target.value)} required />
                      <Select label="State" id="state" value={form.state} onChange={e => update("state", e.target.value)}
                        options={stateOptions.map(s => ({ value: s, label: s }))} placeholder="Select state" required />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Tasks & Requirements</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea label="Tasks (one per line)" id="tasks" value={form.tasks} onChange={e => update("tasks", e.target.value)} placeholder="Reception duties&#10;Social media posts&#10;Guest activities" />
                    <Input label="Skills Required (comma separated)" id="skillsRequired" value={form.skillsRequired} onChange={e => update("skillsRequired", e.target.value)} placeholder="english, hospitality, social media" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Working Hours" id="workingHours" value={form.workingHours} onChange={e => update("workingHours", e.target.value)} placeholder="4-5 hours per day" />
                      <Input label="Stay Duration" id="stayDuration" value={form.stayDuration} onChange={e => update("stayDuration", e.target.value)} placeholder="2-4 weeks" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Start Date (optional)" type="date" id="startDate" value={form.startDate} onChange={e => update("startDate", e.target.value)} />
                      <Input label="End Date (optional)" type="date" id="endDate" value={form.endDate} onChange={e => update("endDate", e.target.value)} />
                    </div>
                    <Input label="Volunteer Capacity" type="number" id="capacity" value={form.volunteerCapacity} onChange={e => update("volunteerCapacity", e.target.value)} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">What Volunteers Receive</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea label="Accommodation Details" id="accommodation" value={form.accommodationDetails} onChange={e => update("accommodationDetails", e.target.value)} placeholder="Shared dorm, private room, etc." />
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" checked={form.mealsIncluded} onChange={e => update("mealsIncluded", e.target.checked)} />
                        <span className="text-sm text-gray-700">Meals included</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" checked={form.internetAvailable} onChange={e => update("internetAvailable", e.target.checked)} />
                        <span className="text-sm text-gray-700">Internet available</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><h2 className="font-semibold text-gray-900">Additional Details</h2></CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea label="House Rules (one per line)" id="houseRules" value={form.houseRules} onChange={e => update("houseRules", e.target.value)} />
                    <Textarea label="Safety Notes" id="safetyNotes" value={form.safetyNotes} onChange={e => update("safetyNotes", e.target.value)} />
                    <Textarea label="Application Questions (one per line)" id="appQuestions" value={form.applicationQuestions} onChange={e => update("applicationQuestions", e.target.value)} placeholder="Why do you want to volunteer here?&#10;What skills can you bring?" />
                    <Input label="Tags (comma separated)" id="tags" value={form.tags} onChange={e => update("tags", e.target.value)} placeholder="mountain, hostel, social, hospitality" />
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" checked={form.womenFriendly} onChange={e => update("womenFriendly", e.target.checked)} />
                        <span className="text-sm text-gray-700">Women-friendly</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" checked={form.creativeTasks} onChange={e => update("creativeTasks", e.target.checked)} />
                        <span className="text-sm text-gray-700">Creative tasks</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" checked={form.ecoProject} onChange={e => update("ecoProject", e.target.checked)} />
                        <span className="text-sm text-gray-700">Eco project</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                  <Button variant="outline" onClick={() => handleSubmit(false)} loading={loading}>Save as Draft</Button>
                  <Button onClick={() => handleSubmit(true)} loading={loading}>Publish</Button>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </AppShell>
    </AuthGuard>
  )
}
