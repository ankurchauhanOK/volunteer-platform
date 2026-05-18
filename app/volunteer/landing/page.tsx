"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/Button"
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

/* ================================================================
   SCENE ASSETS — Pexels free cinematic video loops
   ================================================================ */
const SCENES = [
  {
    src: "https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_25fps.mp4",
    label: "Mountains",
  },
  {
    src: "https://videos.pexels.com/video-files/1536322/1536322-hd_1920_1080_30fps.mp4",
    label: "Forest",
  },
  {
    src: "https://videos.pexels.com/video-files/4109928/4109928-hd_1920_1080_24fps.mp4",
    label: "Village",
  },
  {
    src: "https://videos.pexels.com/video-files/3214448/3214448-hd_1920_1080_25fps.mp4",
    label: "Desert",
  },
  {
    src: "https://videos.pexels.com/video-files/4763824/4763824-hd_1920_1080_25fps.mp4",
    label: "Train",
  },
]

export default function VolunteerLandingPage() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentScene, setCurrentScene] = useState(0)

  /* ---------- Hero refs ---------- */
  const heroRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const textTopLeftRef = useRef<HTMLDivElement>(null)
  const textBottomRightRef = useRef<HTMLDivElement>(null)
  const textBottomLeftRef = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  /* ---------- Section refs ---------- */
  const introRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const journeyRef = useRef<HTMLDivElement>(null)
  const destinationsRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)
  const communityRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  /* ---------- Scene rotation ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => {
        const next = (prev + 1) % SCENES.length
        videoRefs.current[next]?.play().catch(() => {})
        return next
      })
    }, 12000)

    videoRefs.current[0]?.play().catch(() => {})

    return () => clearInterval(interval)
  }, [])

  /* ---------- Nav scroll detection ---------- */
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > window.innerHeight * 0.8)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* ---------- GSAP scroll animations ---------- */
  useEffect(() => {
    const mm = gsap.matchMedia()

    /* ---- Desktop: pinned hero with subtle zoom ---- */
    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1.5,
          },
        })

        /* Window subtly zooms and brightens */
        tl.to(
          windowRef.current,
          { scale: 1.08, duration: 0.6, ease: "power2.out" },
          0
        )

        /* Top-left text fades first */
        tl.to(textTopLeftRef.current, { opacity: 0, y: -30, duration: 0.25 }, 0.1)

        /* Bottom-right text fades */
        tl.to(
          textBottomRightRef.current,
          { opacity: 0, y: 30, duration: 0.25 },
          0.15
        )

        /* Bottom-left text fades */
        tl.to(
          textBottomLeftRef.current,
          { opacity: 0, y: 20, duration: 0.2 },
          0.2
        )

        /* Bottom bar fades */
        tl.to(bottomBarRef.current, { opacity: 0, duration: 0.15 }, 0.25)

        /* Section reveals */
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
      })

      return () => ctx.revert()
    })

    /* ---- Mobile: no pin, simple fades ---- */
    mm.add("(max-width: 767px)", () => {
      const ctx = gsap.context(() => {
        gsap.to(textTopLeftRef.current, {
          opacity: 0,
          y: -20,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=40%",
            scrub: true,
          },
        })

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
                start: "top 85%",
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
      })

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  const navLinks = [
    { href: "/opportunities", label: "Opportunities" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About" },
  ]

  return (
    <div className="relative bg-cream">
      {/* ============================================================
          NAVIGATION — minimal, transparent on hero
          ============================================================ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled
            ? "bg-cream/90 backdrop-blur-md border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-500 ${
                navScrolled ? "bg-sb-500" : "bg-white/10"
              }`}
            >
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
            <span
              className={`font-tanker text-base tracking-tight transition-colors duration-500 ${
                navScrolled ? "text-text" : "text-white"
              }`}
            >
              Voluntree
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs transition-colors duration-300 ${
                  navScrolled
                    ? "text-text-secondary hover:text-text"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className={
                  navScrolled
                    ? "text-xs h-8"
                    : "text-white/70 hover:text-white hover:bg-white/10 text-xs h-8"
                }
              >
                Sign in
              </Button>
            </Link>
          </div>

          <button
            className={`md:hidden transition-colors ${
              navScrolled ? "text-text" : "text-white"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div
            className={`border-t p-4 md:hidden ${
              navScrolled
                ? "bg-cream/95 backdrop-blur-md border-border"
                : "bg-sb-900/95 border-white/10"
            }`}
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm ${
                    navScrolled ? "text-text-secondary" : "text-white/70"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full text-xs">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/select-role" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full text-xs">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ============================================================
          CINEMATIC HERO — Editorial composition matching Jesko exactly
          ============================================================ */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
        style={{ background: "#0f0f0f" }}
      >
        {/* Ambient background wall texture */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, #1a1a1a 0%, #0f0f0f 60%, #0a0a0a 100%)",
          }}
        />

        {/* Subtle wall light falloff from window */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(60,60,60,0.15) 0%, transparent 70%)",
          }}
        />

        {/* ----- TOP LEFT: "We are explorers" ----- */}
        <div
          ref={textTopLeftRef}
          className="absolute z-20 will-change-transform"
          style={{
            top: "12%",
            left: "5%",
            maxWidth: "45vw",
          }}
        >
          <h1
            className="font-tanker text-white leading-[0.9] tracking-tight"
            style={{
              fontSize: "clamp(3rem, 8vw, 8rem)",
              textShadow: "0 4px 30px rgba(0,0,0,0.6)",
            }}
          >
            We are
            <br />
            explorers
          </h1>
        </div>

        {/* ----- CENTER: Train Window ----- */}
        <div
          ref={windowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 will-change-transform"
        >
          {/* Outer wall shadow */}
          <div
            className="absolute -inset-10 md:-inset-16 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Outer frame — thick dark metal */}
          <div
            className="relative p-4 md:p-6 rounded-[36px] md:rounded-[48px]"
            style={{
              background:
                "linear-gradient(180deg, #3a3a3a 0%, #252525 30%, #1a1a1a 70%, #0f0f0f 100%)",
              boxShadow:
                "0 50px 100px rgba(0,0,0,0.8), 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.12)",
            }}
          >
            {/* Middle frame — lighter metal ring */}
            <div
              className="p-2.5 md:p-3.5 rounded-[32px] md:rounded-[40px]"
              style={{
                background:
                  "linear-gradient(180deg, #555 0%, #3a3a3a 50%, #2a2a2a 100%)",
                boxShadow:
                  "inset 0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.08)",
              }}
            >
              {/* Inner frame — glossy highlight */}
              <div
                className="p-1 md:p-1.5 rounded-[28px] md:rounded-[36px]"
                style={{
                  background:
                    "linear-gradient(180deg, #777 0%, #555 20%, #444 80%, #333 100%)",
                  boxShadow:
                    "inset 0 1px 3px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {/* Glass pane */}
                <div
                  className="relative w-[72vw] max-w-[380px] h-[55vh] max-h-[520px] md:w-[28vw] md:max-w-[420px] md:h-[72vh] md:max-h-[680px] overflow-hidden"
                  style={{
                    borderRadius: "24px",
                    background: "#050505",
                    boxShadow:
                      "inset 0 0 60px rgba(0,0,0,0.7), inset 0 0 20px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Scenery video layers */}
                  {SCENES.map((scene, i) => (
                    <video
                      key={i}
                      ref={(el) => {
                        videoRefs.current[i] = el
                      }}
                      src={scene.src}
                      muted
                      loop
                      playsInline
                      preload={i === 0 ? "metadata" : "none"}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms]"
                      style={{
                        opacity: i === currentScene ? 1 : 0,
                        transform: "scale(1.45)",
                        animation: "trainPan 30s linear infinite",
                      }}
                    />
                  ))}

                  {/* Glass reflection overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 35%, rgba(255,255,255,0.02) 100%)",
                    }}
                  />

                  {/* Inner shadow for recessed depth */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      borderRadius: "24px",
                      boxShadow:
                        "inset 0 0 50px rgba(0,0,0,0.5), inset 0 0 100px rgba(0,0,0,0.25)",
                    }}
                  />

                  {/* Voluntree watermark inside glass */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span
                      className="font-tanker text-white/15 tracking-[0.2em]"
                      style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)" }}
                    >
                      Voluntree
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ----- BOTTOM RIGHT: "We chase wonder" ----- */}
        <div
          ref={textBottomRightRef}
          className="absolute z-20 text-right will-change-transform"
          style={{
            bottom: "22%",
            right: "4%",
            maxWidth: "50vw",
          }}
        >
          <h1
            className="font-tanker text-white leading-[0.9] tracking-tight"
            style={{
              fontSize: "clamp(2.8rem, 7.5vw, 7.5rem)",
              textShadow: "0 4px 30px rgba(0,0,0,0.6)",
            }}
          >
            We chase
            <br />
            wonder
          </h1>
        </div>

        {/* ----- BOTTOM LEFT: Supporting text ----- */}
        <div
          ref={textBottomLeftRef}
          className="absolute z-20 will-change-transform"
          style={{
            bottom: "18%",
            left: "5%",
            maxWidth: "280px",
          }}
        >
          <h2
            className="font-tanker text-white leading-[1.05] tracking-tight mb-4"
            style={{
              fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            Your
            <br />
            freedom to
            <br />
            travel
          </h2>
          <div
            className="w-10 h-px mb-4"
            style={{ background: "rgba(255,255,255,0.3)" }}
          />
          <p
            className="text-white/50 leading-relaxed"
            style={{
              fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
              textShadow: "0 1px 10px rgba(0,0,0,0.4)",
            }}
          >
            Every journey is designed around discovery — so you can focus on
            what truly matters, while the world opens itself to you.
          </p>
        </div>

        {/* ----- BOTTOM BAR: Scroll cue + CTA ----- */}
        <div
          ref={bottomBarRef}
          className="absolute z-20 w-full px-5 md:px-8"
          style={{ bottom: "5%" }}
        >
          <div className="relative flex items-end justify-between">
            {/* Left: empty for composition balance */}
            <div className="hidden md:block w-32" />

            {/* Center: minimal pill CTA */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
              <Link href="/auth/select-role">
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-white/90 rounded-full px-6 h-9 text-xs font-semibold transition-all duration-200 active:scale-95"
                >
                  Start Your Journey{" "}
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>

            {/* Right: scroll indicator line */}
            <div className="hidden md:flex items-center gap-4 pb-1">
              <div className="flex items-center gap-1.5">
                <ChevronDown className="h-3.5 w-3.5 text-white/30" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Scroll down
                </span>
              </div>
              <div
                className="w-16 h-px"
                style={{ background: "rgba(255,255,255,0.15)" }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                To start the journey
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          INTRO / TRUST SECTION
          ============================================================ */}
      <section
        ref={introRef}
        className="relative py-24 sm:py-32 md:py-40 lg:py-52 bg-cream"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <span className="reveal-item label-sm text-sb-500 mb-6 block">
              VOLUNTREE
            </span>
            <h2 className="reveal-item font-tanker text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text leading-[1.05] tracking-tight">
              India&apos;s volunteer travel community.
            </h2>
            <p className="reveal-item mt-8 md:mt-10 text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl">
              We connect passionate travelers with hosts across the country —
              from Himalayan retreats to coastal villages. Every journey is an
              exchange of skills, culture, and trust. Every connection is built
              on mutual respect.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          VALUES SECTION
          ============================================================ */}
      <section
        ref={valuesRef}
        className="relative py-24 sm:py-32 md:py-40 bg-white"
      >
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

      {/* ============================================================
          JOURNEY / PROFILE SECTION
          ============================================================ */}
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
                Create a profile that reflects who you are. Highlight your
                skills, share your passions, and let hosts discover what makes
                you unique. Your journey starts with a single step.
              </p>
              <div className="reveal-item mt-10">
                <Link href="/auth/select-role">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-12 text-sm font-semibold transition-all duration-200 active:scale-95"
                  >
                    Create Your Profile{" "}
                    <ArrowRight className="h-4 w-4 ml-2" />
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

      {/* ============================================================
          DESTINATIONS SECTION
          ============================================================ */}
      <section
        ref={destinationsRef}
        className="relative py-28 sm:py-36 md:py-44 bg-cream"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 md:mb-24">
            <span className="reveal-item label-sm text-sb-500 mb-6 block">
              DESTINATIONS
            </span>
            <h2 className="reveal-item font-tanker text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text leading-[1.05] tracking-tight">
              Discover India
            </h2>
            <p className="reveal-item mt-6 md:mt-8 text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
              From snow-capped peaks to sun-drenched coastlines, find
              opportunities in every corner of the country.
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

      {/* ============================================================
          TRUST / SUPPORT SECTION
          ============================================================ */}
      <section
        ref={trustRef}
        className="relative py-28 sm:py-36 md:py-44 bg-white"
      >
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
                From application to arrival, our team ensures your volunteer
                journey is seamless. Safety checks, host verification, travel
                guidance, and community support — we&apos;ve built it all.
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
                  <p className="text-sm text-text-secondary mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          COMMUNITY / GLOBAL SECTION
          ============================================================ */}
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
              Your next chapter is already written — you just need to turn the
              page.
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

      {/* ============================================================
          CONTACT / FOOTER SECTION
          ============================================================ */}
      <section
        ref={contactRef}
        className="relative py-24 sm:py-32 md:py-40 bg-cream"
      >
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
                  Get Started{" "}
                  <ArrowRight className="h-4 w-4 ml-2" />
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
