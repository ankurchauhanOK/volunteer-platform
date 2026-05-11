"use client"

import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"

export default function SafetyPage() {
  return (
    <AppShell>
      <div className="bg-gray-50 min-h-screen py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <h1 className="font-tanker text-3xl text-text">Trust & Safety</h1>
              <p className="text-gray-500 mt-2">Your safety is our top priority. Learn about the measures we take to protect our community.</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-tanker text-lg text-text mb-2">Host Verification</h2>
                      <p className="text-sm text-gray-600 leading-relaxed">All hosts undergo identity verification before listing opportunities. We review business documentation, verify contact information, and check community reviews. Verified hosts receive a special badge that helps volunteers make informed decisions.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-ocean-100 text-ocean-600 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-tanker text-lg text-text mb-2">Community Reviews</h2>
                      <p className="text-sm text-gray-600 leading-relaxed">After each stay, both volunteers and hosts can leave honest reviews. Our review system includes ratings for communication, safety, cleanliness, and overall experience. This creates a self-regulating community where quality is rewarded.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-tanker text-lg text-text mb-2">Reporting System</h2>
                      <p className="text-sm text-gray-600 leading-relaxed">If something doesn&apos;t feel right, you can report a listing or user directly from any page. Our moderation team reviews all reports within 24 hours. We take issues like misrepresentation, harassment, and safety concerns very seriously.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-tanker text-lg text-text mb-2">Emergency Support</h2>
                      <p className="text-sm text-gray-600 leading-relaxed">We provide emergency contact information for all verified hosts. Volunteers can access this information once their application is accepted. Our support team is available 24/7 to help with urgent situations.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-tanker text-lg text-text mb-2">Code of Conduct</h2>
                      <p className="text-sm text-gray-600 leading-relaxed">All members must agree to our community guidelines and code of conduct. Hosts sign a responsibility agreement ensuring they provide safe conditions and fair treatment. Volunteers agree to respect host property and contribute meaningfully.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-brand-50 rounded-2xl border border-brand-100 text-center">
              <h2 className="font-tanker text-lg text-text mb-2">Have a safety concern?</h2>
              <p className="text-sm text-brand-700 mb-4">Our team is here to help. Don&apos;t hesitate to reach out.</p>
              <Link href="/contact">
                <Button>Contact Support</Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </AppShell>
  )
}
