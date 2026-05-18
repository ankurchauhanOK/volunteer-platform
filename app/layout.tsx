import type { Metadata } from "next"
import { Manrope, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Voluntree - Travel Free. Travel Safe. Travel Creatively.",
  description: "A community-driven platform connecting volunteers with hosts across India. Swap your skills for adventure.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col bg-beige text-text antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
