"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Separator } from "@/components/ui/Separator"
import { Menu, X, Bell, LogOut, LayoutDashboard, MessageSquare, User } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  const linkClass = (path: string) =>
    `text-sm transition-colors ${isActive(path) ? "text-brand-600 font-medium" : "text-text-secondary hover:text-text"}`

  const navLinks = [
    { href: "/opportunities", label: "Opportunities" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/resources", label: "Resources" },
    { href: "/pricing", label: "Pricing" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-text">Voluntree</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href={user.role === "host" ? "/host/messages" : "/volunteer/messages"}>
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={user.role === "host" ? "/host/dashboard" : "/volunteer/dashboard"}>
                <Button variant="ghost" size="icon">
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={user.role === "host" ? "/host/profile" : "/volunteer/profile"}>
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-border hover:ring-brand-200 transition-all">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/auth/select-role">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white p-4 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-3">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)} onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Separator />
            {user ? (
              <>
                <Link href={user.role === "host" ? "/host/dashboard" : "/volunteer/dashboard"} onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start"><LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard</Button>
                </Link>
                <Link href={user.role === "host" ? "/host/profile" : "/volunteer/profile"} onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start"><User className="h-4 w-4 mr-2" /> Profile</Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start text-red-500" onClick={() => { logout(); setMobileOpen(false) }}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
                <Link href="/auth/select-role" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
