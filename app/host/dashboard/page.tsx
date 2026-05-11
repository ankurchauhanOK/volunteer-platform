"use client"

import { useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { listingVisibilityLabels, formatDate, timeAgo } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

export default function HostDashboardPage() {
  const { user } = useAuth()
  if (!user) return null

  const listings = db.listings.findByHost(user.id)
  const published = listings.filter(l => l.visibility === "published")
  const drafts = listings.filter(l => l.visibility === "draft")
  const applications = db.applications.findByHost(user.id)
  const newApps = applications.filter(a => a.status === "submitted")
  const profile = db.hostProfiles.find(user.id)
  const notifications = db.notifications.findByUser(user.id).slice(0, 5)
  const bookings = db.bookings.findByHost(user.id)
  const activeBookings = bookings.filter(b => b.status === "upcoming" || b.status === "active")

  return (
    <AuthGuard requiredRole="host">
      <AppShell>
        <div className="bg-gray-50 min-h-screen">
          <Container className="py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-tanker text-2xl text-text">
                  Welcome back, {profile?.businessName || user.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {profile?.verificationStatus === "verified" ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Verified Host
                    </span>
                  ) : (
                    "Complete your profile to get verified"
                  )}
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/host/profile">
                  <Button variant="outline" size="sm">Edit Profile</Button>
                </Link>
                <Link href="/host/listings/new">
                  <Button size="sm">Create Listing</Button>
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard label="Active Listings" value={published.length}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614f-16.5 0z" /></svg>} />
              <StatsCard label="New Applications" value={newApps.length}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                trend={newApps.length > 0 ? { value: `${newApps.length} awaiting review`, positive: true } : undefined} />
              <StatsCard label="Drafts" value={drafts.length}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>} />
              <StatsCard label="Active Volunteers" value={activeBookings.length}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>} />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Active Listings */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-gray-900">Your Listings</h2>
                      <Link href="/host/listings">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </Link>
                    </div>
                    {listings.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500 mb-3">You haven&apos;t created any listings yet</p>
                        <Link href="/host/listings/new"><Button size="sm">Create Your First Listing</Button></Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {listings.slice(0, 5).map(listing => {
                          const apps = db.applications.findByListing(listing.id)
                          const newAppCount = apps.filter(a => a.status === "submitted").length
                          const visInfo = listingVisibilityLabels[listing.visibility]
                          return (
                            <div key={listing.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                                  {listing.visibility === "published" && newAppCount > 0 && (
                                    <Badge variant="info" size="sm">{newAppCount} new</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{listing.city}, {listing.state}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-3">
                                <Badge variant={listing.visibility === "published" ? "success" : listing.visibility === "draft" ? "default" : "warning"}>
                                  {visInfo?.label || listing.visibility}
                                </Badge>
                                <Link href={`/host/listings/${listing.id}/edit`}>
                                  <Button variant="ghost" size="sm">Edit</Button>
                                </Link>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Applications */}
                {newApps.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900">New Applications</h2>
                        <Link href="/host/applicants"><Button variant="ghost" size="sm">View all</Button></Link>
                      </div>
                      <div className="space-y-3">
                        {newApps.slice(0, 5).map(app => {
                          const volunteer = db.users.find(app.volunteerId)
                          const profile = volunteer ? db.volunteerProfiles.find(volunteer.id) : null
                          const listing = db.listings.find(app.listingId)
                          return (
                            <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
                                  {volunteer?.name?.charAt(0) || "?"}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{volunteer?.name}</p>
                                  <p className="text-xs text-gray-500">
                                    Applied to {listing?.title || "Unknown"} &middot; {timeAgo(app.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <Link href="/host/applicants">
                                <Button size="sm">Review</Button>
                              </Link>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notifications */}
                {notifications.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
                      <div className="space-y-3">
                        {notifications.map(notif => (
                          <div key={notif.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${notif.read ? "bg-gray-300" : "bg-brand-500"}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                              <p className="text-xs text-gray-500">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notif.createdAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Link href="/host/listings/new" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50">
                        <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Create New Listing
                      </Link>
                      <Link href="/host/applicants" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50">
                        <svg className="w-4 h-4 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        Review Applicants
                      </Link>
                      <Link href="/host/messages" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50">
                        <svg className="w-4 h-4 text-sunset-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                        Messages
                      </Link>
                      <Link href="/safety" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                        Safety Guidelines
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {profile?.verificationStatus !== "verified" && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Get Verified</p>
                          <p className="text-xs text-gray-500 mt-1">Complete verification to build trust with volunteers and increase applications.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </Container>
        </div>
      </AppShell>
    </AuthGuard>
  )
}
