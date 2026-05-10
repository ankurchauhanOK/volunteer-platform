"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/store"
import { Button } from "@/components/ui/Button"
import { Container } from "@/components/layout/Container"

export function Navbar() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const unreadNotifs = user ? db.notifications.unreadCount(user.id) : 0
  const unreadMsgs = user ? db.getUnreadMessageCount(user.id) : 0

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">Voluntree</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/opportunities" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Opportunities
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </Link>
            <Link href="/resources" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Resources
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {(unreadNotifs + unreadMsgs) > 0 && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                  </span>
                )}
                <Link href={user.role === "volunteer" ? "/volunteer/dashboard" : user.role === "host" ? "/host/dashboard" : "/admin"}>
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Log out
                </Button>
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link href="/opportunities" className="px-2 py-2 text-sm text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Opportunities</Link>
              <Link href="/how-it-works" className="px-2 py-2 text-sm text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>How It Works</Link>
              <Link href="/resources" className="px-2 py-2 text-sm text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Resources</Link>
              <Link href="/pricing" className="px-2 py-2 text-sm text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
              {user && (
                <>
                  <Link href={user.role === "volunteer" ? "/volunteer/dashboard" : "/host/dashboard"} className="px-2 py-2 text-sm text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false) }} className="px-2 py-2 text-sm text-left text-red-600 hover:text-red-700">Log out</button>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </nav>
  )
}
