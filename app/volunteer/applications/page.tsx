"use client"

import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { applicationStatusLabels, formatDate } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

export default function ApplicationsPage() {
  const { user } = useAuth()
  if (!user) return null

  const applications = db.applications.findByVolunteer(user.id)
  const grouped = {
    confirmed: applications.filter(a => a.status === "confirmed"),
    accepted: applications.filter(a => a.status === "accepted"),
    submitted: applications.filter(a => a.status === "submitted" || a.status === "viewed"),
    waitlisted: applications.filter(a => a.status === "waitlisted"),
    rejected: applications.filter(a => a.status === "rejected"),
    drafted: applications.filter(a => a.status === "drafted"),
    withdrawn: applications.filter(a => a.status === "withdrawn"),
  }

  return (
    <AuthGuard requiredRole="volunteer">
      <AppShell>
        <div className="bg-gray-50 min-h-screen py-8">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-tanker text-2xl text-text">My Applications</h1>
                  <p className="text-sm text-gray-500">{applications.length} total applications</p>
                </div>
                <Link href="/opportunities"><Button size="sm">Browse More</Button></Link>
              </div>

              {applications.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-sm text-gray-500 mb-4">Start by browsing opportunities and applying to ones that match your skills.</p>
                    <Link href="/opportunities"><Button>Find Opportunities</Button></Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                  {Object.entries(grouped).map(([key, apps]) => {
                    if (apps.length === 0) return null
                    const statusKey = key === "submitted" ? "submitted" : key
                    return (
                      <div key={key}>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          {key.charAt(0).toUpperCase() + key.slice(1)} ({apps.length})
                        </h2>
                        <div className="space-y-3">
                          {apps.map(app => {
                            const listing = db.listings.find(app.listingId)
                            const host = listing ? db.users.find(listing.hostId) : null
                            const hostProfile = listing ? db.hostProfiles.find(listing.hostId) : null
                            return (
                              <Card key={app.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Link href={`/opportunities/${app.listingId}`} className="font-medium text-gray-900 hover:text-brand-600 truncate">
                                          {listing?.title || "Unknown"}
                                        </Link>
                                        <Badge variant={
                                          app.status === "confirmed" || app.status === "accepted" ? "success" :
                                          app.status === "rejected" ? "destructive" :
                                          app.status === "submitted" || app.status === "viewed" ? "info" :
                                          app.status === "waitlisted" ? "purple" : "default"
                                        } size="sm">
                                          {applicationStatusLabels[app.status]?.label || app.status}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        {hostProfile?.businessName || host?.name} &middot; {listing?.city}, {listing?.state}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-0.5">Applied {formatDate(app.createdAt)}</p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                      {listing && (
                                        <Link href={`/opportunities/${listing.id}`}>
                                          <Button variant="ghost" size="sm">View</Button>
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Container>
        </div>
      </AppShell>
    </AuthGuard>
  )
}
