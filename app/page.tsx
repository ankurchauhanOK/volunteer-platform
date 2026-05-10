"use client"

import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { db } from "@/lib/store"
import { ListingCard } from "@/components/opportunities/ListingCard"
import type { OpportunityListing } from "@/lib/types"

export default function HomePage() {

  const listings = db.listings.list().filter(l => l.visibility === "published").slice(0, 6)
  const hostUsers = db.users.list().filter(u => u.role === "host")

  const getHostName = (hostId: string) => {
    const host = hostUsers.find(h => h.id === hostId)
    const profile = db.hostProfiles.find(hostId)
    return profile?.businessName || host?.name
  }

  return (
    <AppShell>
      {/* Cinematic Split-Screen Hero */}
      <section className="relative w-full overflow-hidden bg-gray-950 min-h-[90vh]">
        {/* Base ambient gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-gray-950/0 to-amber-950/40 z-0" />

        <div className="flex flex-col lg:flex-row h-full w-full relative z-10 min-h-[90vh]">
          {/* ========== LEFT PANEL — VOLUNTEERS ========== */}
          <div className="group relative w-full lg:w-1/2 h-[50vh] lg:h-auto overflow-hidden cursor-pointer">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80')" }}
            />
            {/* Dark blue-green gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-teal-950/80 to-cyan-950/70 z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-[1]" />

            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-[0.04] z-[1]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 18c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-24 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

            {/* Decorative travel path SVG */}
            <svg className="absolute bottom-16 left-8 w-28 h-28 text-white/10 z-[1]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
              <path d="M10 80 Q 30 20, 50 50 T 90 30" strokeDasharray="2 3" />
              <circle cx="10" cy="80" r="2.5" fill="currentColor" />
              <circle cx="50" cy="50" r="1.5" fill="currentColor" />
              <circle cx="90" cy="30" r="2.5" fill="currentColor" />
            </svg>

            {/* Floating glowing dots */}
            <div className="absolute top-1/4 right-12 z-[1]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-slow-pulse" />
              <div className="w-1 h-1 rounded-full bg-teal-300/40 animate-slow-pulse ml-5 mt-3" style={{ animationDelay: '1s' }} />
              <div className="w-0.5 h-0.5 rounded-full bg-cyan-200/30 ml-2 mt-2" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-[2] flex flex-col justify-center px-8 md:px-12 lg:px-16 xl:px-20">
              <div className="max-w-lg">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-sm mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">For Travelers</span>
                </div>

                {/* Headline */}
                <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] mb-4 tracking-tight">
                  Travel with<br />
                  <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Purpose.</span>
                </h1>

                {/* Subheading */}
                <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-6 max-w-md">
                  Exchange your skills for meaningful experiences, free stays, and lifelong connections across India.
                </p>

                {/* Feature bullets */}
                <div className="space-y-2.5 mb-8">
                  {[
                    { icon: <svg key="1" className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>, label: "Stay free in amazing places" },
                    { icon: <svg key="2" className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg>, label: "Learn new skills and cultures" },
                    { icon: <svg key="3" className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>, label: "Travel sustainably and creatively" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <Link href="/opportunities">
                    <button className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 active:scale-[0.98]">
                      Find Opportunities
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </button>
                  </Link>
                  <Link href="/how-it-works" className="group/link inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mt-3 sm:mt-1.5 sm:ml-1">
                    Learn how it works
                    <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ========== GLOWING DIVIDER ========== */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px z-20 -translate-x-1/2">
            <div className="h-full w-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-24 bg-gradient-to-b from-emerald-400 via-teal-300 to-amber-400 blur-[2px] animate-glow" />
          </div>

          {/* ========== RIGHT PANEL — HOSTS ========== */}
          <div className="group relative w-full lg:w-1/2 h-[50vh] lg:h-auto overflow-hidden cursor-pointer">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80')" }}
            />
            {/* Dark warm overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-950/95 via-orange-950/80 to-stone-950/70 z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent z-[1]" />

            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-[0.04] z-[1]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 18c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-24 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

            {/* Decorative SVG */}
            <svg className="absolute bottom-16 right-8 w-28 h-28 text-white/10 z-[1]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
              <circle cx="50" cy="50" r="30" strokeDasharray="2 3" />
              <circle cx="50" cy="50" r="15" strokeDasharray="2 3" />
              <circle cx="50" cy="50" r="3" fill="currentColor" />
            </svg>

            {/* Glowing dots */}
            <div className="absolute top-1/3 left-12 z-[1]">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-slow-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="w-1 h-1 rounded-full bg-orange-300/40 animate-slow-pulse ml-6 mt-3" style={{ animationDelay: '1.5s' }} />
              <div className="w-0.5 h-0.5 rounded-full bg-yellow-200/30 ml-3 mt-2" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-[2] flex flex-col justify-center px-8 md:px-12 lg:px-16 xl:px-20">
              <div className="max-w-lg ml-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-sm mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">For Hosts</span>
                </div>

                {/* Headline */}
                <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] mb-4 tracking-tight">
                  Host with<br />
                  <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">Heart.</span>
                </h1>

                {/* Subheading */}
                <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-6 max-w-md">
                  Find passionate travelers, get help with your space, and build meaningful cultural exchange experiences.
                </p>

                {/* Feature bullets */}
                <div className="space-y-2.5 mb-8">
                  {[
                    { icon: <svg key="1" className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.646 5.646a1.5 1.5 0 01-2.121 0l-.008-.007a1.5 1.5 0 010-2.121l5.646-5.646m5.295-5.294l5.646-5.646a1.5 1.5 0 012.121 0l.007.008a1.5 1.5 0 010 2.121l-5.646 5.646M9 21h6m-3-3v-6m3-9H6m3 3h6" /></svg>, label: "Get help with daily tasks" },
                    { icon: <svg key="2" className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>, label: "Meet creative travelers" },
                    { icon: <svg key="3" className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>, label: "Build a global community" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <Link href="/auth/signup?role=host">
                    <button className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-400/40 hover:from-amber-400 hover:to-orange-400 transition-all duration-300 active:scale-[0.98]">
                      List Your Opportunity
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </button>
                  </Link>
                  <Link href="/safety" className="group/link inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mt-3 sm:mt-1.5 sm:ml-1">
                    See host benefits
                    <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== TRUST BAR ========== */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-5 md:pb-7 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
              {[
                { icon: <svg key="s1" className="w-3.5 h-3.5 text-emerald-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>, label: "Verified Hosts" },
                { icon: <svg key="s2" className="w-3.5 h-3.5 text-emerald-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>, label: "Trusted Community" },
                { icon: <svg key="s3" className="w-3.5 h-3.5 text-emerald-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>, label: "24/7 Support" },
                { icon: <svg key="s4" className="w-3.5 h-3.5 text-emerald-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>, label: "Women Safety Focus" },
                { icon: <svg key="s5" className="w-3.5 h-3.5 text-emerald-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>, label: "Sustainable Travel" },
              ].map((item) => (
                <div key={item.label} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/[0.06] backdrop-blur-md border border-white/[0.07]">
                  {item.icon}
                  <span className="text-[11px] font-medium text-white/60 tracking-wide">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Three simple steps to start your volunteer-travel journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sign Up",
                desc: "Create your free profile as a volunteer or host. Tell us about your skills, interests, and where you want to go.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Browse or Post",
                desc: "Volunteers can browse opportunities across India. Hosts can list their openings with details about tasks and perks.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Connect & Travel",
                desc: "Apply, get accepted, and embark on your adventure. Stay with your host, contribute your skills, and make lifelong connections.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.591.286 1.357-.2 1.856l-.158.158c-.437.437-.624 1.077-.483 1.695.19.828.057 1.708-.38 2.422l-.307.502c-.468.765-.255 1.742.487 2.21l.543.34c.452.284.681.809.566 1.327l-.13.586c-.155.7.257 1.404.93 1.62 2.045.655 4.224.456 6.086-.647a8.25 8.25 0 003.113-3.162M12 3a9 9 0 00-9 9c0 1.976.634 3.806 1.71 5.28" />
                  </svg>
                ),
              },
            ].map((item) => (
              <Card key={item.step} className="text-center p-8">
                <CardContent>
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-5">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-brand-600 tracking-widest uppercase mb-2 block">{item.step}</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-16 bg-brand-50">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Active Volunteers" },
              { value: "50+", label: "Host Partners" },
              { value: "15+", label: "States Covered" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-brand-700">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Opportunities */}
      {listings.length > 0 && (
        <section className="py-20 bg-white">
          <Container>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Featured Opportunities</h2>
                <p className="text-gray-500">Discover incredible volunteer opportunities across India</p>
              </div>
              <Link href="/opportunities">
                <Button variant="ghost" className="hidden sm:flex">
                  View all &rarr;
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  hostName={getHostName(listing.hostId)}
                />
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/opportunities">
                <Button variant="outline">View all opportunities</Button>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* For Volunteers & Hosts */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 md:p-10 border-brand-100 bg-gradient-to-br from-white to-brand-50">
              <CardContent>
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">For Volunteers</h3>
                <p className="text-gray-500 text-sm mb-6">Travel on a budget, gain new skills, and make a real impact in communities across India.</p>
                <ul className="space-y-3 mb-6">
                  {["Free accommodation and meals", "Choose from 50+ hosts across India", "Learn new skills and gain experience", "Join a community of like-minded travelers", "Safety-verified hosts and support"].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup?role=volunteer">
                  <Button>Start Volunteering</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-8 md:p-10 border-ocean-100 bg-gradient-to-br from-white to-ocean-50">
              <CardContent>
                <div className="w-12 h-12 rounded-xl bg-ocean-100 text-ocean-600 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614f-16.5 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">For Hosts</h3>
                <p className="text-gray-500 text-sm mb-6">Get enthusiastic help for your business or project while providing a meaningful cultural exchange.</p>
                <ul className="space-y-3 mb-6">
                  {["List your opportunity for free", "Get vetted, motivated volunteers", "Reduce staffing costs during peak seasons", "Share your culture and build connections", "Flexible scheduling and easy management"].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-ocean-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup?role=host">
                  <Button variant="secondary">Become a Host</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Real stories from real volunteers and hosts</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", role: "Volunteer, Mumbai", text: "Voluntree completely changed how I travel. I spent 3 weeks in Manali helping at a hostel and made friends from around the world. Best decision ever!", rating: 5 },
              { name: "Arun K.", role: "Host, Himachal Pradesh", text: "Having volunteers has been incredible for our cafe. They bring fresh energy and ideas. The platform made it so easy to find the right people.", rating: 5 },
              { name: "Neha M.", role: "Volunteer, Delhi", text: "As a solo female traveler, safety was my biggest concern. Voluntree's verified hosts and support system gave me complete peace of mind.", rating: 5 },
            ].map((testimonial) => (
              <Card key={testimonial.name} className="p-6">
                <CardContent>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">Join thousands of travelers and hosts who are already part of the Voluntree community</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-gray-100 text-base px-10">
                Create Free Account
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-10">
                Browse Opportunities
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </AppShell>
  )
}
