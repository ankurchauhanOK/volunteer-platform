"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/Button"
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function VolunteerLandingPage() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const journeyRef = useRef<HTMLDivElement>(null)
  const destinationsRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)
  const communityRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > window.innerHeight * 0.9)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })

    const ctx = gsap.context(() => {
      // Hero entrance animation
      if (heroTextRef.current) {
        const lines = heroTextRef.current.querySelectorAll(".hero-line")
        gsap.fromTo(
          lines,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.3,
          }
        )

        const support = heroTextRef.current.querySelector(".hero-support")
        if (support) {
          gsap.fromTo(
            support,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 1.2 }
          )
        }
      }

      if (scrollCueRef.current) {
        gsap.fromTo(
          scrollCueRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, delay: 1.8, ease: "power2.out" }
        )
        gsap.to(scrollCueRef.current.querySelector(".scroll-chevron"), {
          y: 8,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        })
      }

      // Section reveal helper
      const revealSection = (
        ref: React.RefObject<HTMLDivElement | null>,
        childSelector: string,
        stagger = 0.12
      ) => {
        if (!ref.current) return
        const children = ref.current.querySelectorAll(childSelector)
        gsap.fromTo(
          children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        )
      }

      revealSection(introRef, ".reveal-item", 0.15)
      revealSection(valuesRef, ".reveal-item", 0.12)
      revealSection(journeyRef, ".reveal-item", 0.15)
      revealSection(destinationsRef, ".reveal-item", 0.1)
      revealSection(trustRef, ".reveal-item", 0.12)
      revealSection(communityRef, ".reveal-item", 0.08)
      revealSection(contactRef, ".reveal-item", 0.15)

      // Parallax on hero background glow
      if (heroRef.current) {
        const glow = heroRef.current.querySelector(".hero-glow")
        if (glow) {
          gsap.to(glow, {
            y: 100,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          })
        }
      }
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      ctx.revert()
    }
  }, [])

  const navLinks = [
    { href: "/opportunities", label: "Opportunities" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About" },
  ]

  return (
    <div className="relative bg-cream">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled
            ? "bg-cream/90 backdrop-blur-md border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-500 ${
                navScrolled ? "bg-sb-500" : "bg-white/10 backdrop-blur-sm"
              }`}
            >
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z"
                />
              </svg>
            </div>
            <span
              className={`font-tanker text-lg tracking-tight transition-colors duration-500 ${
                navScrolled ? "text-text" : "text-white"
              }`}
            >
              Voluntree
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors duration-300 ${
                  navScrolled
                    ? "text-text-secondary hover:text-text"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className={navScrolled ? "" : "text-white/80 hover:text-white hover:bg-white/10"}
              >
                Sign in
              </Button>
            </Link>
            <Link href="/auth/select-role">
              <Button
                size="sm"
                className={
                  navScrolled
                    ? ""
                    : "bg-white text-sb-900 hover:bg-white/90 rounded-full"
                }
              >
                Get Started
              </Button>
            </Link>
          </div>

          <button
            className={`md:hidden transition-colors duration-500 ${
              navScrolled ? "text-text" : "text-white"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div
            className={`border-t p-4 md:hidden animate-fade-in ${
              navScrolled
                ? "bg-cream/95 backdrop-blur-md border-border"
                : "bg-sb-900/95 backdrop-blur-md border-white/10"
            }`}
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm py-1 ${
                    navScrolled ? "text-text-secondary" : "text-white/70"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/select-role" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="relative min-h-screen bg-sb-900 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Subtle radial glow behind text */}
        <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-sb-700/30 blur-[120px] pointer-events-none" />

        <div
          ref={heroTextRef}
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-20"
        >
          <div className="space-y-2 md:space-y-3">
            <h1 className="hero-line font-tanker text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] text-white leading-[0.95] tracking-tight">
              We are movement
            </h1>
            <h1 className="hero-line font-tanker text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] text-sb-400 leading-[0.95] tracking-tight">
              We are impact
            </h1>
            <h1 className="hero-line font-tanker text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white/90 leading-[1.1] tracking-tight pt-2 md:pt-4">
              Your freedom to travel,
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              learn, and contribute
            </h1>
          </div>

          <p className="hero-support mt-10 md:mt-14 text-sm sm:text-base text-white/50 max-w-md mx-auto leading-relaxed">
            Travel across India. Share your skills. Build meaningful experiences
            with trusted hosts who welcome you as family.
          </p>

          <div className="hero-support mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/select-role">
              <Button
                size="lg"
                className="bg-white text-sb-900 hover:bg-white/90 rounded-full px-8 h-12 text-sm font-semibold transition-all duration-200 active:scale-95"
              >
                Start Your Journey <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 h-12 text-sm transition-all duration-200 active:scale-95"
              >
                Browse Opportunities
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          ref={scrollCueRef}
          className="absolute bottom-8 sm:bottom-12 left-0 right-0 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Scroll to explore
          </span>
          <div className="scroll-chevron">
            <ChevronDown className="h-5 w-5 text-white/40" />
          </div>
        </div>
      </section>

      {/* ===== INTRO / TRUST SECTION ===== */}
      <section ref={introRef} className="relative py-28 sm:py-36 md:py-44 lg:py-52 bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <span className="reveal-item label-sm text-sb-500 mb-6 block">
              VOLUNTREE
            </span>
            <h2 className="reveal-item font-tanker text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text leading-[1.05] tracking-tight">
              India&apos;s volunteer travel community.
            </h2>
            <p className="reveal-item mt-8 md:mt-10 text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl">
              We connect passionate travelers with hosts across the country — from
              Himalayan retreats to coastal villages. Every journey is an exchange
              of skills, culture, and trust. Every connection is built on mutual
              respect.
            </p>
          </div>
        </div>
      </section>

      {/* ===== VALUES SECTION ===== */}
      <section ref={valuesRef} className="relative py-24 sm:py-32 md:py-40 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-20 md:gap-y-28">
            {[
              {
                title: "Direct Access to Trusted Volunteering",
                desc: "Connect directly with verified hosts. No middlemen. No hidden fees. Just genuine opportunities to contribute your skills and immerse yourself in local life.",
              },
              {
                title: "Your Freedom to Choose Experiences",
                desc: "Teach, farm, build, create, or care. Choose experiences that match your skills and curiosity. Travel on your terms, at your pace.",
              },
              {
                title: "Precision and Safety",
                desc: "Every host is verified. Every stay is reviewed. Our safety framework and 24/7 support ensure you can focus on what matters — making an impact.",
              },
              {
                title: "Global Community, Personal Touch",
                desc: "Join thousands of volunteers and hosts across India. From the mountains of Himachal to the backwaters of Kerala, find your place in a community that values connection.",
              },
            ].map((item, i) => (
              <div key={i} className="reveal-item">
                <span className="text-xs font-semibold text-sb-500 uppercase tracking-wider mb-4 block">
                  0{i + 1}
                </span>
                <h3 className="font-tanker text-2xl sm:text-3xl md:text-4xl text-text leading-[1.1] tracking-tight mb-5">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-md">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== JOURNEY / PROFILE SECTION ===== */}
      <section
        ref={journeyRef}
        className="relative py-28 sm:py-36 md:py-44 lg:py-52 bg-sb-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <span className="reveal-item label-sm text-sb-500 mb-6 block">
                YOUR PROFILE
              </span>
              <h2 className="reveal-item font-tanker text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text leading-[1.05] tracking-tight">
                Build Your Story
              </h2>
              <p className="reveal-item mt-8 md:mt-10 text-base sm:text-lg text-text-secondary leading-relaxed max-w-lg">
                Create a profile that reflects who you are. Highlight your skills,
                share your passions, and let hosts discover what makes you unique.
                Your journey starts with a single step.
              </p>
              <div className="reveal-item mt-10">
                <Link href="/auth/select-role">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-12 text-sm font-semibold transition-all duration-200 active:scale-95"
                  >
                    Create Your Profile <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="reveal-item relative">
              <div className="aspect-[4/5] rounded-2xl bg-sb-100 border border-sb-200 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sb-200 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-sb-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <p className="font-tanker text-2xl text-sb-700 mb-2">
                    Your Profile
                  </p>
                  <p className="text-sm text-sb-600/70 max-w-xs mx-auto">
                    Skills, languages, experiences — everything that makes you
                    uniquely qualified to volunteer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DESTINATIONS SECTION ===== */}
      <section ref={destinationsRef} className="relative py-28 sm:py-36 md:py-44 bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 md:mb-24">
            <span className="reveal-item label-sm text-sb-500 mb-6 block">
              DESTINATIONS
            </span>
            <h2 className="reveal-item font-tanker text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text leading-[1.05] tracking-tight">
              Discover India
            </h2>
            <p className="reveal-item mt-6 md:mt-8 text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
              From snow-capped peaks to sun-drenched coastlines, find opportunities
              in every corner of the country.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: "Manali", region: "Himachal Pradesh" },
              { name: "Rishikesh", region: "Uttarakhand" },
              { name: "Goa", region: "Goa" },
              { name: "Kerala", region: "Kerala" },
              { name: "Rajasthan", region: "Rajasthan" },
              { name: "Karnataka", region: "Karnataka" },
            ].map((dest, i) => (
              <div
                key={i}
                className="reveal-item group relative aspect-[4/3] rounded-xl bg-white border border-border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.24),0_2px_4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-sb-100/50 group-hover:bg-sb-100 transition-colors duration-300" />
                <div className="relative h-full flex flex-col items-start justify-end p-5 md:p-6">
                  <h3 className="font-tanker text-xl sm:text-2xl md:text-3xl text-text tracking-tight">
                    {dest.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary mt-1">
                    {dest.region}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST / SUPPORT SECTION ===== */}
      <section ref={trustRef} className="relative py-28 sm:py-36 md:py-44 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <span className="reveal-item label-sm text-sb-500 mb-6 block">
                SUPPORT
              </span>
              <h2 className="reveal-item font-tanker text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text leading-[1.05] tracking-tight">
                Supported Every Step
              </h2>
              <p className="reveal-item mt-8 md:mt-10 text-base sm:text-lg text-text-secondary leading-relaxed max-w-lg">
                From application to arrival, our team ensures your volunteer journey
                is seamless. Safety checks, host verification, travel guidance, and
                community support — we&apos;ve built it all.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 md:gap-8 content-center">
              {[
                { value: "500+", label: "Verified Listings" },
                { value: "2,000+", label: "Active Volunteers" },
                { value: "50+", label: "Cities Covered" },
                { value: "95%", label: "Positive Reviews" },
              ].map((stat, i) => (
                <div key={i} className="reveal-item">
                  <p className="font-tanker text-3xl sm:text-4xl md:text-5xl text-sb-600 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-secondary mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY / GLOBAL SECTION ===== */}
      <section
        ref={communityRef}
        className="relative py-28 sm:py-36 md:py-44 lg:py-52 bg-sb-700"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 md:mb-24">
            <span className="reveal-item label-sm text-sb-300 mb-6 block">
              COMMUNITY
            </span>
            <h2 className="reveal-item font-tanker text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight">
              India Awaits
            </h2>
            <p className="reveal-item mt-6 md:mt-8 text-base sm:text-lg text-white/60 leading-relaxed max-w-xl">
              Your next chapter is already written — you just need to turn the page.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-4 md:gap-x-8 md:gap-y-5">
            {[
              "Himachal Pradesh",
              "Uttarakhand",
              "Goa",
              "Kerala",
              "Rajasthan",
              "Karnataka",
              "Tamil Nadu",
              "Maharashtra",
              "Sikkim",
              "Assam",
              "Ladakh",
              "Punjab",
              "Gujarat",
              "Odisha",
              "West Bengal",
            ].map((place, i) => (
              <div key={i} className="reveal-item">
                <p className="text-sm sm:text-base text-white/70 hover:text-white transition-colors duration-200 cursor-default">
                  {place}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT / FOOTER SECTION ===== */}
      <section ref={contactRef} className="relative py-24 sm:py-32 md:py-40 bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="reveal-item font-tanker text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text leading-[1.05] tracking-tight">
              Ready to begin?
            </h2>
            <p className="reveal-item mt-6 md:mt-8 text-base sm:text-lg text-text-secondary leading-relaxed max-w-lg mx-auto">
              Get in touch and start your volunteer journey today.
            </p>
            <div className="reveal-item mt-10 md:mt-12">
              <a
                href="mailto:hello@voluntree.in"
                className="text-lg sm:text-xl text-sb-600 hover:text-sb-700 transition-colors duration-200 font-medium"
              >
                hello@voluntree.in
              </a>
            </div>
            <div className="reveal-item mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/select-role">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-12 text-sm font-semibold transition-all duration-200 active:scale-95"
                >
                  Get Started <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-12 text-sm transition-all duration-200 active:scale-95"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Minimal footer */}
          <div className="reveal-item mt-24 md:mt-32 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sb-500">
                  <svg
                    className="h-3.5 w-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z"
                    />
                  </svg>
                </div>
                <span className="font-tanker text-base text-text tracking-tight">
                  Voluntree
                </span>
              </div>
              <p className="text-xs text-text-muted">
                © 2026 Voluntree. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
