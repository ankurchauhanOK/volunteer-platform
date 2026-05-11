"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/Separator"

export function Footer() {
  return (
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
  )
}
