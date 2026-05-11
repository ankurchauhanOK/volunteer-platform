"use client"

import Link from "next/link"
import { ArrowRight, Check, Star, Shield, Users, Globe, Heart, Sparkles, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Separator } from "@/components/ui/Separator"

const stats = [
  { value: "500+", label: "Listings" },
  { value: "2,000+", label: "Volunteers" },
  { value: "50+", label: "Cities" },
  { value: "95%", label: "Positive Reviews" },
]

const features = [
  {
    icon: Shield,
    title: "Trust & Safety",
    desc: "Verified hosts, community reviews, and secure messaging keep you safe.",
  },
  {
    icon: Globe,
    title: "Cultural Exchange",
    desc: "Immerse yourself in local communities and make meaningful connections.",
  },
  {
    icon: Heart,
    title: "Meaningful Impact",
    desc: "Your skills create real value — from teaching to farming to hospitality.",
  },
  {
    icon: Sparkles,
    title: "No-Cost Travel",
    desc: "Work a few hours daily in exchange for free stays and meals.",
  },
]

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Volunteer",
    avatar: "PS",
    content: "I spent two weeks at a mountain hostel in Manali. The work was fair, the people were amazing, and I made friends from around the world.",
  },
  {
    name: "Rajesh Kumar",
    role: "Host",
    avatar: "RK",
    content: "Hosting volunteers has transformed our small business. Their energy and ideas bring so much life to our space.",
  },
  {
    name: "Ananya Patel",
    role: "Volunteer",
    avatar: "AP",
    content: "Voluntree made it so easy to find a placement that matched my skills. I taught English at a school in Rajasthan — unforgettable.",
  },
]

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
              </svg>
            </div>
            <span className="font-tanker text-lg text-text tracking-normal">Voluntree</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/opportunities" className="text-sm text-text-secondary hover:text-text transition-colors">Opportunities</Link>
            <Link href="/how-it-works" className="text-sm text-text-secondary hover:text-text transition-colors">How It Works</Link>
            <Link href="/resources" className="text-sm text-text-secondary hover:text-text transition-colors">Resources</Link>
            <Link href="/pricing" className="text-sm text-text-secondary hover:text-text transition-colors">Pricing</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/auth/select-role">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-white p-4 md:hidden animate-fade-in">
            <nav className="flex flex-col gap-3">
              <Link href="/opportunities" className="text-sm text-text-secondary py-1">Opportunities</Link>
              <Link href="/how-it-works" className="text-sm text-text-secondary py-1">How It Works</Link>
              <Link href="/resources" className="text-sm text-text-secondary py-1">Resources</Link>
              <Link href="/pricing" className="text-sm text-text-secondary py-1">Pricing</Link>
              <Separator />
              <Link href="/auth/login"><Button variant="outline" className="w-full">Sign in</Button></Link>
              <Link href="/auth/select-role"><Button className="w-full">Get Started</Button></Link>
            </nav>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-cream pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="primary" size="lg" className="mb-6">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> India&apos;s Volunteer Travel Community
            </Badge>
            <h1 className="font-tanker text-4xl sm:text-5xl lg:text-6xl text-text text-balance tracking-normal">
              Travel with purpose.<br />
              <span className="gradient-text">Stay free. Make an impact.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              Connect with amazing hosts across India. Offer your skills, get free accommodation and meals, and experience travel that truly matters.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/select-role">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  Start Your Journey <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/opportunities">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                  Browse Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-brand-500">{s.value}</p>
                <p className="text-sm text-text-secondary mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-tanker text-3xl sm:text-4xl text-text">Why Voluntree?</h2>
            <p className="mt-3 text-base text-text-secondary max-w-2xl mx-auto">
              We make volunteer travel simple, safe, and rewarding for everyone.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <Card key={f.title} hover className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-text mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-tanker text-3xl sm:text-4xl text-text">How It Works</h2>
            <p className="mt-3 text-base text-text-secondary max-w-2xl mx-auto">Three simple steps to start your volunteer travel journey.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Your Profile", desc: "Tell hosts about your skills, interests, and travel preferences." },
              { step: "02", title: "Find Your Match", desc: "Browse opportunities that fit what you're looking for." },
              { step: "03", title: "Travel & Volunteer", desc: "Confirm your stay, show up, and make a difference." },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-text text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 sm:p-10 bg-gradient-to-br from-brand-50 to-white border-brand-100">
              <CardContent className="p-0 space-y-5">
                <Badge variant="primary" size="lg">For Volunteers</Badge>
                <h3 className="font-tanker text-2xl sm:text-3xl text-text">Travel & volunteer across India</h3>
                <p className="text-text-secondary leading-relaxed">Find meaningful placements that match your skills. Get free accommodation, meals, and a genuine cultural experience.</p>
                <ul className="space-y-3">
                  {["Work a few hours daily", "Free stay & meals included", "Connect with local communities", "Build real skills & friendships"].map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-text">
                      <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/select-role">
                  <Button className="mt-2">Find Opportunities <ArrowRight className="h-4 w-4 ml-1" /></Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-8 sm:p-10 bg-gradient-to-br from-ocean-50 to-white border-ocean-100">
              <CardContent className="p-0 space-y-5">
                <Badge variant="secondary" size="lg">For Hosts</Badge>
                <h3 className="font-tanker text-2xl sm:text-3xl text-text">Share your space & mission</h3>
                <p className="text-text-secondary leading-relaxed">Get support from passionate travelers. Showcase your project and host volunteers who bring fresh energy and ideas.</p>
                <ul className="space-y-3">
                  {["List your space for free", "Get help from skilled travelers", "Share your culture & mission", "Build your community"].map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-text">
                      <Check className="h-4 w-4 text-ocean-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/select-role">
                  <Button variant="secondary" className="mt-2">Start Hosting <ArrowRight className="h-4 w-4 ml-1" /></Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-tanker text-3xl sm:text-4xl text-text">What People Say</h2>
            <p className="mt-3 text-base text-text-secondary">Real stories from our community.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <Card key={t.name} className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warm-200 text-warm-200" />
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar>
                      <AvatarFallback>{t.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-text">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-brand-500 to-brand-700">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-tanker text-3xl sm:text-4xl text-white">Ready to start your journey?</h2>
          <p className="mt-4 text-base text-brand-100 leading-relaxed max-w-xl mx-auto">
            Join thousands of travelers and hosts who are already making volunteer travel a reality across India.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/select-role">
              <Button size="lg" variant="warm" className="px-8">
                Get Started Free <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
                  </svg>
                </div>
                <span className="font-bold text-text">Voluntree</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">India&apos;s volunteer travel community. Travel with purpose.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-text mb-3">Platform</h4>
              <div className="flex flex-col gap-2 text-sm text-text-secondary">
                <Link href="/opportunities" className="hover:text-text transition-colors">Browse Opportunities</Link>
                <Link href="/how-it-works" className="hover:text-text transition-colors">How It Works</Link>
                <Link href="/pricing" className="hover:text-text transition-colors">Pricing</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-text mb-3">Community</h4>
              <div className="flex flex-col gap-2 text-sm text-text-secondary">
                <Link href="/resources" className="hover:text-text transition-colors">Resources</Link>
                <Link href="/safety" className="hover:text-text transition-colors">Trust & Safety</Link>
                <Link href="/faq" className="hover:text-text transition-colors">FAQ</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-text mb-3">Company</h4>
              <div className="flex flex-col gap-2 text-sm text-text-secondary">
                <Link href="/contact" className="hover:text-text transition-colors">Contact</Link>
                <span className="text-text-muted">hello@voluntree.in</span>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <p className="text-center text-xs text-text-muted">&copy; 2026 Voluntree. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
