"use client"

import { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/Textarea"
import { db } from "@/lib/store"
import { hostTypeLabels, formatDate } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const listing = db.listings.find(id)
  const [showApply, setShowApply] = useState(false)
  const [applyForm, setApplyForm] = useState({ message: "", whyJoin: "", relevantSkills: "", availableDates: "", previousExperience: "" })
  const [applied, setApplied] = useState(false)
  const [reportModal, setReportModal] = useState(false)
  const [reportReason, setReportReason] = useState("")

  if (!listing) {
    return (
      <AppShell>
        <Container className="py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Opportunity not found</h1>
          <p className="text-gray-500 mb-6">This listing may have been removed or is no longer available.</p>
          <Link href="/opportunities"><Button>Browse opportunities</Button></Link>
        </Container>
      </AppShell>
    )
  }

  const host = db.users.find(listing.hostId)
  const hostProfile = db.hostProfiles.find(listing.hostId)
  const reviews = db.reviews.findByListing(listing.id)
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.overall, 0) / reviews.length).toFixed(1)
    : null

  const isSaved = user ? db.savedListings.isSaved(user.id, listing.id) : false

  const handleApply = () => {
    if (!user) { router.push("/auth/login?redirect=" + encodeURIComponent(`/opportunities/${id}`)); return }
    if (user.role !== "volunteer") return
    const existing = db.applications.findByVolunteer(user.id).find(a => a.listingId === listing.id)
    if (existing) return

    db.applications.create({
      listingId: listing.id,
      volunteerId: user.id,
      hostId: listing.hostId,
      message: applyForm.message,
      whyJoin: applyForm.whyJoin,
      relevantSkills: applyForm.relevantSkills,
      availableDates: applyForm.availableDates,
      previousExperience: applyForm.previousExperience,
      status: "submitted",
    })

    db.notifications.create({
      userId: listing.hostId,
      type: "application",
      title: "New Application",
      message: `${user.name} applied to "${listing.title}"`,
      link: "/host/applicants",
      read: false,
    })

    setApplied(true)
    setShowApply(false)
  }

  const handleSave = () => {
    if (!user) { router.push("/auth/login"); return }
    db.savedListings.toggle(user.id, listing.id)
  }

  const handleReport = () => {
    if (!user) { router.push("/auth/login"); return }
    db.reports.create({
      reporterId: user.id,
      reportedListingId: listing.id,
      reason: reportReason,
      description: reportReason,
      status: "open",
    })
    setReportModal(false)
    setReportReason("")
  }

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-screen">
        <Container className="py-8">
          <Link href="/opportunities" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to opportunities
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-[2/1] rounded-2xl bg-gradient-to-br from-brand-100 via-ocean-50 to-brand-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="info">{hostTypeLabels[listing.category] || listing.category}</Badge>
                  {listing.womenFriendly && <Badge variant="purple">Women-friendly</Badge>}
                  {listing.creativeTasks && <Badge variant="success">Creative tasks</Badge>}
                  {listing.ecoProject && <Badge variant="success">Eco project</Badge>}
                </div>
                {hostProfile?.verificationStatus === "verified" && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="success">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Verified Host
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <h1 className="font-tanker text-2xl md:text-3xl text-text mb-2">{listing.title}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {listing.city}, {listing.state}
                  </span>
                  <span>{listing.stayDuration}</span>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-gray-900 mb-3">About this opportunity</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-gray-900 mb-3">Tasks & Expectations</h2>
                  <ul className="space-y-2">
                    {listing.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {task}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Working Hours</h3>
                    <p className="text-sm font-semibold text-gray-900">{listing.workingHours}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Duration</h3>
                    <p className="text-sm font-semibold text-gray-900">{listing.stayDuration}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Meals</h3>
                    <p className="text-sm font-semibold text-gray-900">{listing.mealsIncluded ? "Included" : "Not included"}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Internet</h3>
                    <p className="text-sm font-semibold text-gray-900">{listing.internetAvailable ? "Available" : "Not available"}</p>
                  </CardContent>
                </Card>
              </div>

              {listing.houseRules.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-gray-900 mb-3">House Rules</h2>
                    <ul className="space-y-1">
                      {listing.houseRules.map((rule, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-gray-400">·</span> {rule}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {listing.safetyNotes && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-gray-900 mb-3">Safety Notes</h2>
                    <p className="text-sm text-gray-600">{listing.safetyNotes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              {reviews.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">
                      Reviews ({reviews.length})
                      {avgRating && <span className="ml-2 text-sm font-normal text-gray-500">★ {avgRating} average</span>}
                    </h2>
                    <div className="space-y-4">
                      {reviews.map(review => {
                        const reviewer = db.users.find(review.fromUserId)
                        return (
                          <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
                                {reviewer?.name?.charAt(0) || "?"}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{reviewer?.name || "Anonymous"}</span>
                              <div className="flex gap-0.5 ml-auto">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{review.content}</p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  {applied ? (
                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                      <svg className="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm font-medium text-green-800">Application submitted!</p>
                      <p className="text-xs text-green-600 mt-1">The host will review your application.</p>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => {
                        if (!user) { router.push("/auth/login?redirect=" + encodeURIComponent(`/opportunities/${id}`)); return }
                        if (user.role !== "volunteer") return
                        setShowApply(true)
                      }}
                    >
                      Apply Now
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSave}
                  >
                    {isSaved ? (
                      <><svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg> Saved</>
                    ) : (
                      <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> Save</>
                    )}
                  </Button>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Host Information</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-ocean-100 flex items-center justify-center text-sm font-semibold text-ocean-700">
                        {host?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{hostProfile?.businessName || host?.name}</p>
                        <p className="text-xs text-gray-500">{listing.city}, {listing.state}</p>
                      </div>
                    </div>
                    {hostProfile?.verificationStatus === "verified" && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Verified Host
                      </p>
                    )}
                  </div>

                  <button onClick={() => setReportModal(true)} className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors text-center">
                    Report this listing
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>

      {/* Apply Modal */}
      {showApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowApply(false)}>
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Apply to {listing.title}</h2>
                <button onClick={() => setShowApply(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <Textarea label="Why do you want to join?" id="whyJoin" value={applyForm.whyJoin} onChange={e => setApplyForm({ ...applyForm, whyJoin: e.target.value })} placeholder="What excites you about this opportunity?" required />
                <Textarea label="Relevant Skills" id="skills" value={applyForm.relevantSkills} onChange={e => setApplyForm({ ...applyForm, relevantSkills: e.target.value })} placeholder="What skills can you bring?" required />
                <Textarea label="Available Dates" id="dates" value={applyForm.availableDates} onChange={e => setApplyForm({ ...applyForm, availableDates: e.target.value })} placeholder="When can you start and how long can you stay?" required />
                <Textarea label="Previous Experience (optional)" id="experience" value={applyForm.previousExperience} onChange={e => setApplyForm({ ...applyForm, previousExperience: e.target.value })} placeholder="Any relevant experience" />
                <Textarea label="Message to Host (optional)" id="message" value={applyForm.message} onChange={e => setApplyForm({ ...applyForm, message: e.target.value })} placeholder="Anything specific you'd like to tell the host?" />
                <Button className="w-full" onClick={handleApply} disabled={!applyForm.whyJoin || !applyForm.relevantSkills || !applyForm.availableDates}>
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setReportModal(false)}>
          <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Listing</h2>
              <Textarea label="Reason for reporting" id="report" value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="Tell us what's wrong with this listing" />
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="ghost" onClick={() => setReportModal(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleReport} disabled={!reportReason}>Submit Report</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  )
}
