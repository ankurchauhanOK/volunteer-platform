"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { hostTypeLabels } from "@/lib/utils"
import type { OpportunityListing } from "@/lib/types"

interface ListingCardProps {
  listing: OpportunityListing
  hostName?: string
}

export function ListingCard({ listing, hostName }: ListingCardProps) {
  return (
    <Card hover className="overflow-hidden group">
      <div className="aspect-[16/9] bg-gradient-to-br from-brand-100 to-ocean-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge variant="info" size="sm">{hostTypeLabels[listing.category] || listing.category}</Badge>
          {listing.womenFriendly && <Badge variant="purple" size="sm">Women-friendly</Badge>}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5 text-white text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {listing.city}, {listing.state}
          </div>
        </div>
      </div>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
              {listing.title}
            </h3>
            {hostName && <p className="text-xs text-gray-500 mt-0.5">{hostName}</p>}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {listing.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {listing.workingHours}
              </span>
              <span>{listing.stayDuration}</span>
            </div>
            <Link href={`/opportunities/${listing.id}`}>
              <Button size="sm">View</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
