"use client"

import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { formatDate, timeAgo } from "@/lib/utils"

export default function AdminDashboardPage() {
  const users = db.users.list()
  const listings = db.listings.list()
  const applications = db.applications.list()
  const reviews = db.reviews.list()
  const reports = db.reports.list()
  const openReports = reports.filter(r => r.status === "open")

  return (
    <AuthGuard requiredRole="admin">
      <AppShell>
        <div className="bg-gray-50 min-h-screen">
          <Container className="py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard label="Total Users" value={users.length}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>} />
              <StatsCard label="Total Listings" value={listings.length}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614f-16.5 0z" /></svg>} />
              <StatsCard label="Applications" value={applications.length}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>} />
              <StatsCard label="Open Reports" value={openReports.length}
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
                trend={openReports.length > 0 ? { value: `${openReports.length} need attention`, positive: false } : undefined} />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Recent Users</h2>
                    <div className="space-y-2">
                      {users.slice(0, 10).map(u => (
                        <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{u.name}</p>
                              <p className="text-xs text-gray-500">{u.email} &middot; {u.role}</p>
                            </div>
                          </div>
                          <Badge variant={u.role === "admin" ? "error" : u.role === "host" ? "info" : "success"}>
                            {u.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Link href="/admin/users"><Button variant="ghost" size="sm">View All Users</Button></Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Open Reports</h2>
                    {openReports.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No open reports</p>
                    ) : (
                      <div className="space-y-3">
                        {openReports.slice(0, 5).map(report => {
                          const reporter = db.users.find(report.reporterId)
                          return (
                            <div key={report.id} className="p-3 bg-red-50 rounded-xl border border-red-100">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Report by {reporter?.name || "Unknown"}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{report.reason}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(report.createdAt)}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" onClick={() => db.reports.update(report.id, { status: "dismissed" as any })}>Dismiss</Button>
                                  <Button size="sm" variant="danger" onClick={() => db.reports.update(report.id, { status: "resolved" as any })}>Resolve</Button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    <div className="mt-4 text-center">
                      <Link href="/admin/reports"><Button variant="ghost" size="sm">View All Reports</Button></Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
                    <div className="space-y-2">
                      <Link href="/admin/users" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                        User Management
                      </Link>
                      <Link href="/admin/listings" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614f-16.5 0z" /></svg>
                        Listing Moderation
                      </Link>
                      <Link href="/admin/reports" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        Reports ({openReports.length})
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Platform Stats</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Volunteers</span><span className="font-medium">{users.filter(u => u.role === "volunteer").length}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Hosts</span><span className="font-medium">{users.filter(u => u.role === "host").length}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Published Listings</span><span className="font-medium">{listings.filter(l => l.visibility === "published").length}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Reviews</span><span className="font-medium">{reviews.length}</span></div>
                    </div>
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
