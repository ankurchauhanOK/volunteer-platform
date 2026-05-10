"use client"

import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { ListingCard } from "@/components/opportunities/ListingCard"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { useAuth } from "@/context/AuthContext"

export default function SavedPage() {
  const { user } = useAuth()
  if (!user) return null

  const saved = db.savedListings.findByUser(user.id)
  const listings = saved.map(s => db.listings.find(s.listingId)).filter(Boolean)
  const hostUsers = db.users.list().filter(u => u.role === "host")

  const getHostName = (hostId: string) => {
    const host = hostUsers.find(h => h.id === hostId)
    const profile = db.hostProfiles.find(hostId)
    return profile?.businessName || host?.name
  }

  return (
    <AuthGuard requiredRole="volunteer">
      <AppShell>
        <div className="bg-gray-50 min-h-screen py-8">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Saved Opportunities</h1>
                  <p className="text-sm text-gray-500">{listings.length} saved opportunities</p>
                </div>
                <Link href="/opportunities"><Button size="sm">Browse More</Button></Link>
              </div>

              {listings.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved opportunities</h3>
                    <p className="text-sm text-gray-500 mb-4">Save opportunities you&apos;re interested in to find them later.</p>
                    <Link href="/opportunities"><Button>Browse Opportunities</Button></Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {listings.map(listing => listing && (
                    <ListingCard key={listing.id} listing={listing} hostName={getHostName(listing.hostId)} />
                  ))}
                </div>
              )}
            </div>
          </Container>
        </div>
      </AppShell>
    </AuthGuard>
  )
}
