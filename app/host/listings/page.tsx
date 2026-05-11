"use client"

import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { listingVisibilityLabels, hostTypeLabels } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

export default function HostListingsPage() {
  const { user } = useAuth()
  if (!user) return null

  const listings = db.listings.findByHost(user.id)

  return (
    <AuthGuard requiredRole="host">
      <AppShell>
        <div className="bg-gray-50 min-h-screen py-8">
          <Container>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-tanker text-2xl text-text">Your Listings</h1>
                <p className="text-sm text-gray-500">{listings.length} total listings</p>
              </div>
              <Link href="/host/listings/new"><Button>Create New Listing</Button></Link>
            </div>

            {listings.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614f-16.5 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Create your first opportunity listing to start receiving applications from volunteers.</p>
                  <Link href="/host/listings/new"><Button>Create Your First Listing</Button></Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {listings.map(listing => {
                  const visInfo = listingVisibilityLabels[listing.visibility]
                  const apps = db.applications.findByListing(listing.id)
                  const newApps = apps.filter(a => a.status === "submitted").length
                  return (
                    <Card key={listing.id}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                              <Badge variant={listing.visibility === "published" ? "success" : listing.visibility === "draft" ? "default" : "warning"}>
                                {visInfo?.label || listing.visibility}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">{listing.city}, {listing.state} &middot; {hostTypeLabels[listing.category] || listing.category}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                          <span>{apps.length} applications</span>
                          {newApps > 0 && <Badge variant="info" size="sm">{newApps} new</Badge>}
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/host/listings/${listing.id}/edit`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">Edit</Button>
                          </Link>
                          <Link href={`/opportunities/${listing.id}`} className="flex-1">
                            <Button variant="ghost" size="sm" className="w-full">View</Button>
                          </Link>
                          {listing.visibility === "draft" && (
                            <Button size="sm" className="flex-1" onClick={() => {
                              db.listings.update(listing.id, { visibility: "published" })
                              window.location.reload()
                            }}>Publish</Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </Container>
        </div>
      </AppShell>
    </AuthGuard>
  )
}
