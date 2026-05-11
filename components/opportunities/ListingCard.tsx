"use client"

import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { hostTypeLabels } from "@/lib/utils"
import type { OpportunityListing } from "@/lib/types"

interface ListingCardProps {
  listing: OpportunityListing
  hostName?: string
}

const categoryGradients: Record<string, string> = {
  hostel: "from-emerald-500 to-teal-700",
  homestay: "from-amber-500 to-orange-700",
  "eco-lodge": "from-green-600 to-emerald-900",
  cafe: "from-rose-500 to-red-700",
  farm: "from-lime-500 to-green-800",
  ngo: "from-blue-500 to-indigo-700",
  school: "from-violet-500 to-purple-700",
  "community-center": "from-cyan-500 to-blue-700",
  restaurant: "from-orange-500 to-red-700",
  other: "from-brand-400 to-brand-700",
}

export function ListingCard({ listing, hostName }: ListingCardProps) {
  const gradient = categoryGradients[listing.category] || "from-brand-400 to-brand-700"

  return (
    <Link href={`/opportunities/${listing.id}`} className="block group">
      <Card className="overflow-hidden border-border bg-surface transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image area */}
        <div className={`aspect-[4/3] bg-gradient-to-br ${gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <Badge variant="info" size="md" className="shadow-sm">
              {hostTypeLabels[listing.category] || listing.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3 flex gap-1.5 flex-wrap justify-end">
            {listing.womenFriendly && (
              <Badge variant="purple" size="sm" className="shadow-sm">Women-friendly</Badge>
            )}
            {listing.creativeTasks && (
              <Badge size="sm" className="bg-sunset-500 text-white border-none shadow-sm">Creative</Badge>
            )}
            {listing.ecoProject && (
              <Badge variant="success" size="sm" className="shadow-sm">Eco</Badge>
            )}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-white/90 text-xs">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {listing.city}, {listing.state}
              </div>
              {hostName && (
                <span className="text-white/80 text-xs font-medium truncate max-w-[140px]">{hostName}</span>
              )}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-5 space-y-3">
          <h3 className="font-tanker text-xl text-text leading-tight group-hover:text-brand-600 transition-colors line-clamp-1">
            {listing.title}
          </h3>

          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {listing.description}
          </p>

          {/* Key specs */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-muted">
            {listing.stayDuration && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
                {listing.stayDuration}
              </span>
            )}
            {listing.workingHours && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {listing.workingHours}/day
              </span>
            )}
            {listing.mealsIncluded && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-3 3-3-3m-6 0l-3 3-3-3" />
                </svg>
                Meals
              </span>
            )}
            {listing.accommodationDetails && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Stay
              </span>
            )}
          </div>

          {/* Skills tags */}
          {listing.skillsRequired.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {listing.skillsRequired.slice(0, 4).map(skill => (
                <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100 capitalize font-medium">
                  {skill}
                </span>
              ))}
              {listing.skillsRequired.length > 4 && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-text-muted border border-border font-medium">
                  +{listing.skillsRequired.length - 4}
                </span>
              )}
            </div>
          )}

          <div className="pt-2">
            <Button size="sm" variant="default" className="w-full">
              View Details
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
