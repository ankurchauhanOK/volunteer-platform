"use client"

import { useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { listingVisibilityLabels, formatDate } from "@/lib/utils"

export default function AdminListingsPage() {
  const [search, setSearch] = useState("")
  const listings = db.listings.list().filter(l => {
    if (!search) return true
    const q = search.toLowerCase()
    return l.title.toLowerCase().includes(q) || l.city.toLowerCase().includes(q)
  })

  return (
    <AuthGuard requiredRole="admin">
      <AppShell>
        <div className="bg-gray-50 min-h-screen py-8">
          <Container>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Listing Moderation</h1>
                <p className="text-sm text-gray-500">{listings.length} total listings</p>
              </div>
              <Input placeholder="Search listings..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left p-4 font-medium text-gray-500">Title</th>
                        <th className="text-left p-4 font-medium text-gray-500">Host</th>
                        <th className="text-left p-4 font-medium text-gray-500">Location</th>
                        <th className="text-left p-4 font-medium text-gray-500">Status</th>
                        <th className="text-left p-4 font-medium text-gray-500">Created</th>
                        <th className="text-left p-4 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map(l => {
                        const host = db.users.find(l.hostId)
                        const visInfo = listingVisibilityLabels[l.visibility]
                        return (
                          <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900">{l.title}</td>
                            <td className="p-4 text-gray-500">{host?.name || "Unknown"}</td>
                            <td className="p-4 text-gray-500">{l.city}, {l.state}</td>
                            <td className="p-4"><Badge variant={l.visibility === "published" ? "success" : l.visibility === "draft" ? "default" : "warning"}>{visInfo?.label || l.visibility}</Badge></td>
                            <td className="p-4 text-gray-500">{formatDate(l.createdAt)}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Link href={`/opportunities/${l.id}`}><Button variant="ghost" size="sm">View</Button></Link>
                                <Button variant="destructive" size="sm" onClick={() => { db.listings.update(l.id, { visibility: "archived" }); window.location.reload() }}>Archive</Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </Container>
        </div>
      </AppShell>
    </AuthGuard>
  )
}
