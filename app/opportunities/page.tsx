"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Separator } from "@/components/ui/Separator"
import { ListingCard } from "@/components/opportunities/ListingCard"
import { ListingFilters } from "@/components/opportunities/ListingFilters"
import { db } from "@/lib/store"
import { SlidersHorizontal, Search, MapPin, X } from "lucide-react"

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

  const activeFilterCount = [filters.state, filters.category, filters.skills, filters.womenFriendly, filters.creativeTasks, filters.ecoProject].filter(Boolean).length

  return (
    <AppShell>
      <div className="bg-beige min-h-screen">
        {/* Hero header */}
        <div className="bg-white border-b border-border">
          <Container className="py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-tanker text-3xl sm:text-4xl text-text">Volunteer Opportunities</h1>
                <p className="text-sm text-text-secondary mt-2 max-w-xl">
                  Discover meaningful travel experiences across India. Browse opportunities from verified hosts.
                </p>
              </div>
              <Button
                variant="outline"
                className="md:hidden shrink-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-1.5" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="primary" size="sm" className="ml-1">{activeFilterCount}</Badge>
                )}
              </Button>
            </div>

            {/* Search bar */}
            <div className="mt-6 flex items-center gap-3">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={e => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search destinations, activities, skills..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-border bg-white text-sm text-text placeholder:text-text-muted outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-brand-50 text-brand-700" : ""}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-1.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="primary" size="sm" className="ml-1">{activeFilterCount}</Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick category filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["hostel", "homestay", "eco-lodge", "cafe", "farm", "ngo", "school"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilters({
                    ...filters,
                    category: filters.category === cat ? "" : cat,
                  })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    filters.category === cat
                      ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                      : "bg-white text-text-secondary border-border hover:border-brand-200 hover:text-text"
                  }`}
                >
                  {cat === "eco-lodge" ? "Eco Lodge" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </Container>
        </div>

        <Container className="py-6 sm:py-8">
          <div className="flex gap-8">
            {/* Sidebar filters */}
            {showFilters && (
              <aside className="hidden md:block w-72 shrink-0">
                <div className="sticky top-24">
                  <div className="bg-white rounded-2xl border border-border p-5 space-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-tanker text-xl text-text">Filters</h3>
                      <button
                        onClick={() => setFilters({ search: "", state: "", category: "", skills: "", womenFriendly: "", creativeTasks: "", ecoProject: "" })}
                        className="text-xs text-text-muted hover:text-text transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Reset
                      </button>
                    </div>
                    <ListingFilters
                      filters={filters}
                      onChange={setFilters}
                      onReset={() => {}}
                    />
                  </div>
                </div>
              </aside>
            )}

            <div className="flex-1 min-w-0">
              {/* Mobile filters */}
              {showFilters && (
                <div className="md:hidden mb-6 bg-white rounded-2xl border border-border p-5 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-tanker text-xl text-text">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-text-muted hover:text-text"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <ListingFilters
                    filters={filters}
                    onChange={setFilters}
                    onReset={() => {}}
                  />
                </div>
              )}

              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">
                    <span className="font-semibold text-text">{filtered.length}</span> {filtered.length === 1 ? "opportunity" : "opportunities"} found
                  </span>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => setFilters({ search: "", state: "", category: "", skills: "", womenFriendly: "", creativeTasks: "", ecoProject: "" })}
                      className="text-xs text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1 ml-2"
                    >
                      <X className="w-3 h-3" />
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Listings grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-brand-400" />
                  </div>
                  <h3 className="font-tanker text-2xl text-text mb-2">No opportunities found</h3>
                  <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
                    Try adjusting your filters or search for something different. There are plenty of volunteer experiences waiting for you.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ search: "", state: "", category: "", skills: "", womenFriendly: "", creativeTasks: "", ecoProject: "" })}
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
