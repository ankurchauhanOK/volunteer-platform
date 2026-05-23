"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { GoogleSignIn } from "@/components/auth/GoogleSignIn"

function LoginForm() {
  const searchParams = useSearchParams()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const raw = localStorage.getItem("vt_users")
      if (!raw || JSON.parse(raw).length === 0) {
        localStorage.setItem("vt_users", JSON.stringify([
          { id: "seed_admin", email: "admin@voluntree.in", password: "admin123!", name: "Admin", role: "admin", onboardingComplete: true, createdAt: new Date().toISOString() },
          { id: "seed_host", email: "host@example.com", password: "host123!", name: "Mountain View Hostel", role: "host", onboardingComplete: true, createdAt: new Date().toISOString() },
          { id: "seed_vol", email: "volunteer@example.com", password: "vol123!", name: "Priya Sharma", role: "volunteer", onboardingComplete: true, createdAt: new Date().toISOString() },
        ]))
      }
      const users = JSON.parse(localStorage.getItem("vt_users") || "[]")
      const user = users.find((u: any) => u.email === form.email)
      if (!user) {
        setError("No account found with this email")
        setLoading(false)
        return
      }
      if (user.password !== form.password) {
        setError("Incorrect password")
        setLoading(false)
        return
      }
      localStorage.setItem("vt_current_user", JSON.stringify(user))
      if (!user.onboardingComplete) {
        localStorage.removeItem("vt_onboarding_volunteer")
        localStorage.removeItem("vt_onboarding_host")
        window.location.replace("/auth/select-role")
        return
      }
      const redirect =
        searchParams.get("redirect") ||
        (user.role === "volunteer" ? "/volunteer/dashboard" :
         user.role === "host" ? "/host/dashboard" : "/")
      window.location.replace(redirect)
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Email / Password Form */}
      {showEmailForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#1B1B1B] tracking-wide mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full h-[58px] px-5 rounded-[18px] bg-[#f6f3ec] border border-[rgba(14,75,54,0.14)] text-[#1B1B1B] text-[15px] placeholder:text-[#717973] focus:outline-none focus:ring-2 focus:ring-[#0E4B36]/20 focus:border-[#0E4B36]/30 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#1B1B1B] tracking-wide mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="w-full h-[58px] px-5 rounded-[18px] bg-[#f6f3ec] border border-[rgba(14,75,54,0.14)] text-[#1B1B1B] text-[15px] placeholder:text-[#717973] focus:outline-none focus:ring-2 focus:ring-[#0E4B36]/20 focus:border-[#0E4B36]/30 transition-all duration-200"
            />
          </div>

          {error && (
            <div className="p-4 rounded-[18px] bg-red-50/80 border border-red-100 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[56px] rounded-[18px] bg-[#0E4B36] text-white font-[Plus_Jakarta_Sans] text-[15px] font-semibold tracking-wide shadow-[0_8px_28px_rgba(14,75,54,0.22)] hover:shadow-[0_12px_36px_rgba(14,75,54,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              "Continue Your Journey"
            )}
          </button>

          <div className="flex items-center justify-between pt-1">
            <Link href="/auth/forgot-password" className="text-[13px] text-[#6B6B6B] hover:text-[#0E4B36] transition-colors font-medium">
              Forgot password?
            </Link>
            <button
              type="button"
              onClick={() => { setShowEmailForm(false); setError("") }}
              className="text-[13px] text-[#6B6B6B] hover:text-[#0E4B36] transition-colors font-medium"
            >
              Back
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Email input for quick start */}
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#1B1B1B] tracking-wide mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full h-[58px] px-5 rounded-[18px] bg-[#f6f3ec] border border-[rgba(14,75,54,0.14)] text-[#1B1B1B] text-[15px] placeholder:text-[#717973] focus:outline-none focus:ring-2 focus:ring-[#0E4B36]/20 focus:border-[#0E4B36]/30 transition-all duration-200"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!form.email) {
                  setError("Please enter your email address")
                  return
                }
                setShowEmailForm(true)
                setError("")
              }}
              className="w-full h-[56px] rounded-[18px] bg-[#0E4B36] text-white font-[Plus_Jakarta_Sans] text-[15px] font-semibold tracking-wide shadow-[0_8px_28px_rgba(14,75,54,0.22)] hover:shadow-[0_12px_36px_rgba(14,75,54,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Continue Your Journey
            </button>
            {error && !showEmailForm && (
              <div className="p-4 rounded-[18px] bg-red-50/80 border border-red-100 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[rgba(14,75,54,0.14)]" />
            <span className="text-[13px] text-[#6B6B6B] font-medium tracking-wide">or</span>
            <div className="flex-1 h-px bg-[rgba(14,75,54,0.14)]" />
          </div>

          {/* Google */}
          <GoogleSignIn />
        </>
      )}

      {/* Demo accounts */}
      {!showEmailForm && (
        <div className="pt-5 border-t border-[rgba(14,75,54,0.10)]">
          <p className="text-[12px] text-[#6B6B6B] text-center mb-3 tracking-wide uppercase font-medium">Demo accounts</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setShowEmailForm(true); setForm({ email: "volunteer@example.com", password: "vol123!" }) }}
              className="h-11 rounded-[14px] border border-[rgba(14,75,54,0.14)] bg-white text-[#1B1B1B] text-[13px] font-medium hover:bg-[#f6f3ec] hover:border-[#0E4B36]/20 transition-all duration-200"
            >
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => { setShowEmailForm(true); setForm({ email: "host@example.com", password: "host123!" }) }}
              className="h-11 rounded-[14px] border border-[rgba(14,75,54,0.14)] bg-white text-[#1B1B1B] text-[13px] font-medium hover:bg-[#f6f3ec] hover:border-[#0E4B36]/20 transition-all duration-200"
            >
              Host
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* Placeholder mosaic cards */
const mosaicCards = [
  { size: "col-span-1 row-span-1", gradient: "from-[#f5f2ea] to-[#e8e4dc]", label: "GOA" },
  { size: "col-span-2 row-span-1", gradient: "from-[#cfe4c9] to-[#b8cdaa]", label: "HIMACHAL" },
  { size: "col-span-1 row-span-2", gradient: "from-[#a8d4c4] to-[#72b89b]", label: "KERALA" },
  { size: "col-span-1 row-span-1", gradient: "from-[#f0e6d2] to-[#dfc49d]", label: "RAJASTHAN" },
  { size: "col-span-2 row-span-1", gradient: "from-[#c0c9c2] to-[#a8b5ad]", label: "SIKKIM" },
  { size: "col-span-1 row-span-1", gradient: "from-[#f4e8d0] to-[#e8d5b0]", label: "LADAKH" },
  { size: "col-span-1 row-span-2", gradient: "from-[#f5f2ea] to-[#e0dcd4]", label: "UTTARAKHAND" },
  { size: "col-span-1 row-span-1", gradient: "from-[#d4e9c4] to-[#bceed3]", label: "MEGHALAYA" },
  { size: "col-span-2 row-span-1", gradient: "from-[#e8e4dc] to-[#d4cfc4]", label: "TAMIL NADU" },
  { size: "col-span-1 row-span-1", gradient: "from-[#c8d8c0] to-[#a8c4a0]", label: "PUNJAB" },
  { size: "col-span-1 row-span-1", gradient: "from-[#f0e8d8] to-[#e4d8c8]", label: "ASSAM" },
  { size: "col-span-2 row-span-1", gradient: "from-[#d8e4d0] to-[#c4d8bc]", label: "MAHARASHTRA" },
  { size: "col-span-1 row-span-2", gradient: "from-[#e4ddd4] to-[#d0c8bc]", label: "KARNATAKA" },
  { size: "col-span-1 row-span-1", gradient: "from-[#c4dcd0] to-[#a8c8b8]", label: "GUJARAT" },
  { size: "col-span-1 row-span-1", gradient: "from-[#f4e0c8] to-[#e8d0b0]", label: "ODISHA" },
  { size: "col-span-2 row-span-1", gradient: "from-[#d8d8c8] to-[#c4c4b4]", label: "WEST BENGAL" },
  { size: "col-span-1 row-span-1", gradient: "from-[#d0e0d4] to-[#b8d0c0]", label: "BIHAR" },
  { size: "col-span-1 row-span-1", gradient: "from-[#e8dcd0] to-[#d4c8b8]", label: "ARUNACHAL" },
]

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F4F1EA] relative overflow-hidden flex flex-col">
      {/* Background Mosaic */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-6 gap-5 p-5 opacity-60">
          {mosaicCards.map((card, i) => (
            <div
              key={i}
              className={`${card.size} relative rounded-[28px] bg-gradient-to-br ${card.gradient} shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-end justify-center pb-6 overflow-hidden`}
            >
              {/* Subtle texture overlay */}
              <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
              {/* Destination label */}
              <span className="relative z-10 font-[Literata] text-[18px] font-semibold text-[#1B1B1B]/40 tracking-wider uppercase">
                {card.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay wash */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-b from-[#F4F1EA]/70 via-[#F4F1EA]/50 to-[#F4F1EA]/80 backdrop-blur-[2px]" />

      {/* Top Navbar */}
      <header className="relative z-50 h-[72px] flex items-center px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0E4B36] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
            </svg>
          </div>
          <span className="font-[Literata] text-[20px] font-semibold text-[#0E4B36] tracking-tight">
            Voluntree
          </span>
        </Link>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[500px] bg-white/[0.92] backdrop-blur-[24px] rounded-[32px] p-10 md:p-12 shadow-[0_20px_60px_-15px_rgba(14,75,54,0.12)]">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0E4B36] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-[Literata] text-[28px] md:text-[32px] font-semibold text-[#1B1B1B] text-center leading-tight mb-3">
            Start your next meaningful journey
          </h1>
          <p className="text-[15px] text-[#6B6B6B] text-center leading-relaxed mb-8 max-w-sm mx-auto">
            Join travelers, volunteers, and hosts building experiences around culture, purpose, and connection.
          </p>

          {/* Form */}
          <Suspense fallback={(
            <div className="animate-pulse space-y-4">
              <div className="h-[58px] rounded-[18px] bg-[#f6f3ec]" />
              <div className="h-[56px] rounded-[18px] bg-[#0E4B36]/20" />
            </div>
          )}>
            <LoginForm />
          </Suspense>
        </div>
      </main>

      {/* Footer subtle */}
      <footer className="relative z-10 py-4 text-center">
        <p className="text-[12px] text-[#6B6B6B]/60">
          &copy; 2025 Voluntree. Rooted in Purpose.
        </p>
      </footer>
    </div>
  )
}
