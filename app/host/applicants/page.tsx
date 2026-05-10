"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/Textarea"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { applicationStatusLabels, formatDate, timeAgo } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

export default function HostApplicantsPage() {
  const { user } = useAuth()
  if (!user) return null

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

  const applications = db.applications.findByHost(user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const selectedApp = selectedAppId ? db.applications.find(selectedAppId) : null
  const selectedVolunteer = selectedApp ? db.users.find(selectedApp.volunteerId) : null
  const selectedProfile = selectedApp ? db.volunteerProfiles.find(selectedApp.volunteerId) : null
  const selectedListing = selectedApp ? db.listings.find(selectedApp.listingId) : null

  const handleStatus = (appId: string, status: string) => {
    db.applications.update(appId, { status } as any)

    const app = db.applications.find(appId)
    if (app) {
      db.notifications.create({
        userId: app.volunteerId,
        type: "application_status",
        title: `Application ${status}`,
        message: `Your application for "${db.listings.find(app.listingId)?.title}" has been ${status}`,
        link: "/volunteer/applications",
        read: false,
      })

      if (status === "accepted") {
        db.threads.create({
          participants: [user.id, app.volunteerId],
          listingId: app.listingId,
          applicationId: appId,
          subject: `Application for ${db.listings.find(app.listingId)?.title}`,
          lastMessageAt: new Date().toISOString(),
        })
      }
    }

    window.location.reload()
  }

  if (!user) return null

  return (
    <AuthGuard requiredRole="host">
      <AppShell>
        <div className="bg-gray-50 min-h-screen py-8">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Applicants</h1>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Application List */}
                <div className="space-y-3 max-h-[80vh] overflow-y-auto">
                  {applications.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-sm text-gray-500">No applications received yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    applications.map(app => {
                      const volunteer = db.users.find(app.volunteerId)
                      const listing = db.listings.find(app.listingId)
                      const statusInfo = applicationStatusLabels[app.status]
                      return (
                        <Card key={app.id} hover className={selectedAppId === app.id ? "ring-2 ring-brand-500" : ""} onClick={() => setSelectedAppId(app.id)}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700">
                                  {volunteer?.name?.charAt(0) || "?"}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{volunteer?.name || "Unknown"}</p>
                                  <p className="text-xs text-gray-500">{listing?.title}</p>
                                  <p className="text-xs text-gray-400">{timeAgo(app.createdAt)}</p>
                                </div>
                              </div>
                              <Badge variant={
                                app.status === "submitted" ? "info" :
                                app.status === "accepted" || app.status === "confirmed" ? "success" :
                                app.status === "rejected" ? "error" : "default"
                              }>
                                {statusInfo?.label || app.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>

                {/* Application Detail */}
                <div>
                  {selectedApp ? (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-lg font-semibold text-brand-700">
                            {selectedVolunteer?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{selectedVolunteer?.name}</p>
                            <p className="text-xs text-gray-500">
                              {selectedProfile?.city}{selectedProfile?.country ? `, ${selectedProfile.country}` : ""}
                              {selectedProfile?.age ? ` · ${selectedProfile.age} years` : ""}
                            </p>
                          </div>
                        </div>

                        {selectedProfile?.bio && (
                          <p className="text-sm text-gray-600 mb-4">{selectedProfile.bio}</p>
                        )}

                        {selectedProfile?.skills && selectedProfile.skills.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase">Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedProfile.skills.map(s => (
                                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 capitalize">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-3 mb-6">
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs font-medium text-gray-500 mb-1">Why they want to join</p>
                            <p className="text-sm text-gray-700">{selectedApp.whyJoin}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs font-medium text-gray-500 mb-1">Relevant Skills</p>
                            <p className="text-sm text-gray-700">{selectedApp.relevantSkills}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs font-medium text-gray-500 mb-1">Available Dates</p>
                            <p className="text-sm text-gray-700">{selectedApp.availableDates}</p>
                          </div>
                          {selectedApp.previousExperience && (
                            <div className="p-3 bg-gray-50 rounded-xl">
                              <p className="text-xs font-medium text-gray-500 mb-1">Previous Experience</p>
                              <p className="text-sm text-gray-700">{selectedApp.previousExperience}</p>
                            </div>
                          )}
                          {selectedApp.message && (
                            <div className="p-3 bg-gray-50 rounded-xl">
                              <p className="text-xs font-medium text-gray-500 mb-1">Message to Host</p>
                              <p className="text-sm text-gray-700">{selectedApp.message}</p>
                            </div>
                          )}
                        </div>

                        {selectedApp.status === "submitted" || selectedApp.status === "viewed" ? (
                          <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => handleStatus(selectedApp.id, "waitlisted")}>Waitlist</Button>
                            <Button variant="danger" className="flex-1" onClick={() => handleStatus(selectedApp.id, "rejected")}>Decline</Button>
                            <Button className="flex-1" onClick={() => handleStatus(selectedApp.id, "accepted")}>Accept</Button>
                          </div>
                        ) : selectedApp.status === "accepted" ? (
                          <Button className="w-full" onClick={() => handleStatus(selectedApp.id, "confirmed")}>
                            Confirm Booking
                          </Button>
                        ) : (
                          <p className="text-sm text-gray-500 text-center">
                            Application {applicationStatusLabels[selectedApp.status]?.label || selectedApp.status}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-16 text-center">
                        <p className="text-sm text-gray-500">Select an application to review</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </AppShell>
    </AuthGuard>
  )
}
