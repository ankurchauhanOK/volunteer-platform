"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { timeAgo } from "@/lib/utils"

export default function AdminReportsPage() {
  const [filter, setFilter] = useState<string>("all")
  const reports = db.reports.list().filter(r => filter === "all" || r.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <AuthGuard requiredRole="admin">
      <AppShell>
        <div className="bg-gray-50 min-h-screen py-8">
          <Container>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                <p className="text-sm text-gray-500">{reports.length} reports</p>
              </div>
              <div className="flex gap-2">
                {["all", "open", "investigating", "resolved", "dismissed"].map(f => (
                  <Button key={f} variant={filter === f ? "primary" : "ghost"} size="sm" onClick={() => setFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {reports.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-sm text-gray-500">No reports found</p>
                  </CardContent>
                </Card>
              ) : (
                reports.map(report => {
                  const reporter = db.users.find(report.reporterId)
                  return (
                    <Card key={report.id}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">Report by {reporter?.name || "Unknown"}</p>
                              <Badge variant={
                                report.status === "open" ? "error" :
                                report.status === "investigating" ? "warning" :
                                report.status === "resolved" ? "success" : "default"
                              }>{report.status}</Badge>
                            </div>
                            {report.reportedListingId && (
                              <p className="text-xs text-gray-500 mb-1">
                                Reported listing: {db.listings.find(report.reportedListingId)?.title || "Unknown"}
                              </p>
                            )}
                            {report.reportedUserId && (
                              <p className="text-xs text-gray-500 mb-1">
                                Reported user: {db.users.find(report.reportedUserId)?.name || "Unknown"}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-2">{report.description}</p>
                            <p className="text-xs text-gray-400 mt-2">{timeAgo(report.createdAt)}</p>
                          </div>
                          <div className="flex gap-2 ml-4 shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => {
                              db.reports.update(report.id, { status: "investigating" as any })
                              window.location.reload()
                            }}>Investigate</Button>
                            <Button variant="danger" size="sm" onClick={() => {
                              db.reports.update(report.id, { status: "resolved" as any })
                              window.location.reload()
                            }}>Resolve</Button>
                            <Button variant="ghost" size="sm" onClick={() => {
                              db.reports.update(report.id, { status: "dismissed" as any })
                              window.location.reload()
                            }}>Dismiss</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </Container>
        </div>
      </AppShell>
    </AuthGuard>
  )
}
