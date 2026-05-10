"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { ListingCard } from "@/components/opportunities/ListingCard"
import { ListingFilters } from "@/components/opportunities/ListingFilters"
import { db } from "@/lib/store"

export default function OpportunitiesPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: "", state: "", category: "", skills: "",
    womenFriendly: "", creativeTasks: "", ecoProject: "",
  })

  const allListings = db.listings.list().filter(l => l.visibility === "published")
  const hostUsers = db.users.list().filter(u => u.role === "host")

  const getHostName = (hostId: string) => {
    const host = hostUsers.find(h => h.id === hostId)
    const profile = db.hostProfiles.find(hostId)
    return profile?.businessName || host?.name
  }

  const filtered = useMemo(() => {
    return allListings.filter(l => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!l.title.toLowerCase().includes(q) && !l.city.toLowerCase().includes(q) && !l.state.toLowerCase().includes(q) && !l.description.toLowerCase().includes(q)) return false
      }
      if (filters.state && l.state !== filters.state) return false
      if (filters.category && l.category !== filters.category) return false
      if (filters.skills) {
        const skills = filters.skills.toLowerCase().split(",").map(s => s.trim())
        if (!skills.some(s => l.skillsRequired.some(ls => ls.toLowerCase().includes(s)))) return false
      }
      if (filters.womenFriendly === "true" && !l.womenFriendly) return false
      if (filters.creativeTasks === "true" && !l.creativeTasks) return false
      if (filters.ecoProject === "true" && !l.ecoProject) return false
      return true
    })
  }, [filters, allListings])

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-screen">
        <Container className="py-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Volunteer Opportunities</h1>
            <p className="text-gray-500 mt-1">Find your next adventure across India</p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search destinations, activities..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </Button>
          </div>

          <div className="flex gap-8">
            <aside className="hidden md:block w-64 shrink-0">
              <div className="sticky top-24">
                <ListingFilters
                  filters={filters}
                  onChange={setFilters}
                  onReset={() => setFilters({ search: "", state: "", category: "", skills: "", womenFriendly: "", creativeTasks: "", ecoProject: "" })}
                />
              </div>
            </aside>

            <div className="flex-1">
              {showFilters && (
                <div className="md:hidden mb-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
                  <ListingFilters
                    filters={filters}
                    onChange={setFilters}
                    onReset={() => setFilters({ search: "", state: "", category: "", skills: "", womenFriendly: "", creativeTasks: "", ecoProject: "" })}
                  />
                </div>
              )}

              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"} found
                </p>
                <div className="flex items-center gap-2">
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white" defaultValue="latest">
                    <option value="latest">Latest</option>
                    <option value="popular">Popular</option>
                  </select>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No opportunities found</h3>
                  <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search for something different</p>
                  <Button variant="outline" onClick={() => setFilters({ search: "", state: "", category: "", skills: "", womenFriendly: "", creativeTasks: "", ecoProject: "" })}>
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map(listing => (
                    <ListingCard key={listing.id} listing={listing} hostName={getHostName(listing.hostId)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </AppShell>
  )
}
