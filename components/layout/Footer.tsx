import Link from "next/link"
import { Container } from "@/components/layout/Container"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v7c0 5-9 8.5-9 8.5S3 18.5 3 13.5v-7L12 2z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">Voluntree</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Travel free. Travel safe. Travel creatively. A community-driven platform connecting volunteers with hosts across India.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/opportunities" className="text-sm hover:text-white transition-colors">Browse Opportunities</Link></li>
              <li><Link href="/how-it-works" className="text-sm hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/resources" className="text-sm hover:text-white transition-colors">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Community</h4>
            <ul className="space-y-2">
              <li><Link href="/safety" className="text-sm hover:text-white transition-colors">Safety</Link></li>
              <li><Link href="/faq" className="text-sm hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/resources" className="text-sm hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Community Guidelines</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Voluntree. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {["instagram", "facebook", "twitter", "youtube"].map((social) => (
              <a key={social} href="#" className="text-gray-500 hover:text-white transition-colors">
                <span className="sr-only">{social}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
