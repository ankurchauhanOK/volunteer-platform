"use client"

import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { applicationStatusLabels, formatDate, timeAgo } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

export default function VolunteerDashboardPage() {
  const { user } = useAuth()
  if (!user) return null

  const profile = db.volunteerProfiles.find(user.id)
  const applications = db.applications.findByVolunteer(user.id)
  const saved = db.savedListings.findByUser(user.id)
  const notifications = db.notifications.findByUser(user.id).slice(0, 5)
  const badges = db.badges.findByUser(user.id)
  const bookings = db.bookings.findByVolunteer(user.id)
  const activeBookings = bookings.filter(b => b.status === "upcoming" || b.status === "active")

  return (
    <AuthGuard requiredRole="volunteer">
      <AppShell>
        <div className="bg-gray-50 min-h-screen">
          <Container className="py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user.name.split(" ")[0]}!
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {profile?.profileCompleteness ? `Profile ${profile.profileCompleteness}% complete` : "Complete your profile to start applying"}
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/volunteer/profile">
                  <Button variant="outline" size="sm">Edit Profile</Button>
                </Link>
                <Link href="/opportunities">
                  <Button size="sm">Browse Opportunities</Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard label="Applications" value={applications.length}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>} />
              <StatsCard label="Saved" value={saved.length}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>} />
              <StatsCard label="Active Stays" value={activeBookings.length}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.591.286 1.357-.2 1.856l-.158.158c-.437.437-.624 1.077-.483 1.695.19.828.057 1.708-.38 2.422l-.307.502c-.468.765-.255 1.742.487 2.21l.543.34c.452.284.681.809.566 1.327l-.13.586c-.155.7.257 1.404.93 1.62 2.045.655 4.224.456 6.086-.647a8.25 8.25 0 003.113-3.162" /></svg>} />
              <StatsCard label="Badges" value={badges.length}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>} />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Upcoming Stays */}
                {activeBookings.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="font-semibold text-gray-900 mb-4">Upcoming Stays</h2>
                      <div className="space-y-3">
                        {activeBookings.map(booking => {
                          const listing = db.listings.find(booking.listingId)
                          return (
                            <div key={booking.id} className="flex items-center justify-between p-3 bg-brand-50 rounded-xl">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{listing?.title || "Unknown"}</p>
                                <p className="text-xs text-gray-500">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                              </div>
                              <Badge variant="success">{booking.status}</Badge>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Applications */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-gray-900">My Applications</h2>
                      <Link href="/volunteer/applications">
                        <Button variant="ghost" size="sm">View all</Button>
                      </Link>
                    </div>
                    {applications.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500 mb-3">You haven&apos;t applied to any opportunities yet</p>
                        <Link href="/opportunities"><Button size="sm">Browse opportunities</Button></Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {applications.slice(0, 5).map(app => {
                          const listing = db.listings.find(app.listingId)
                          const statusInfo = applicationStatusLabels[app.status]
                          return (
                            <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{listing?.title || "Unknown"}</p>
                                <p className="text-xs text-gray-500">{formatDate(app.createdAt)}</p>
                              </div>
                              <Badge variant="destructive">
                                {statusInfo?.label || app.status}
                              </Badge>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

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
                {/* Profile Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-lg font-semibold text-brand-700">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{profile?.city || "Location not set"}{profile?.country ? `, ${profile.country}` : ""}</p>
                      </div>
                    </div>
                    {profile?.bio && <p className="text-sm text-gray-600 mb-3">{profile.bio}</p>}
                    {profile?.skills && profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {profile.skills.map(skill => (
                          <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 capitalize">{skill}</span>
                        ))}
                      </div>
                    )}
                    <Link href="/volunteer/profile">
                      <Button variant="outline" size="sm" className="w-full">Edit Profile</Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
                    <div className="space-y-2">
                      {[
                        { href: "/volunteer/applications", label: "My Applications", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
                        { href: "/volunteer/messages", label: "Messages", icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" },
                        { href: "/volunteer/saved", label: "Saved Opportunities", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
                        { href: "/safety", label: "Safety Resources", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
                      ].map(link => (
                        <Link key={link.label} href={link.href} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-50">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                          </svg>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Badges */}
                {badges.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Badges</h3>
                      <div className="flex flex-wrap gap-2">
                        {badges.map(badge => (
                          <Badge key={badge.id} variant="purple">{badge.name}</Badge>
                        ))}
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
