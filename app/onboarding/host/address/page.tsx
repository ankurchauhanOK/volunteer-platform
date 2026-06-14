"use client"

import { useState, useEffect, useRef } from "react"
import { OnboardingLayout } from "@/components/onboarding/host/OnboardingLayout"
import { useHostOnboarding } from "@/components/onboarding/host/HostOnboardingContext"

interface NominatimResult {
  osm_id: number
  display_name: string
  lat: string
  lon: string
  address: {
    city?: string
    town?: string
    village?: string
    county?: string
    state?: string
    country?: string
    postcode?: string
    road?: string
    house_number?: string
  }
}

function extractCity(addr: NominatimResult["address"]): string {
  return addr.city || addr.town || addr.village || addr.county || ""
}

export default function AddressPage() {
  const { data, updateData, goNext, goBack } = useHostOnboarding()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<NominatimResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const abortRef = useRef<AbortController>(null)

  // Restore previously selected address if coming back
  useEffect(() => {
    if (data.address?.displayName) {
      setSearchQuery(data.address.displayName)
      setSelectedId(data.address.lat && data.address.lng ? data.address.lat + data.address.lng : null)
    }
  }, [])

  // Debounced Nominatim search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const q = searchQuery.trim()
    if (q.length < 2) {
      setResults([])
      return
    }

    setIsSearching(true)
    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=6`,
          {
            headers: { "User-Agent": "Voluntree/1.0 (host onboarding)" },
            signal: controller.signal,
          }
        )
        if (!res.ok) throw new Error("Nominatim error")
        const data: NominatimResult[] = await res.json()
        setResults(data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setResults([])
        }
      } finally {
        setIsSearching(false)
      }
    }, 400)
  }, [searchQuery])

  const handleSelect = (r: NominatimResult) => {
    setSelectedId(r.osm_id)
    setSearchQuery(r.display_name)
    setResults([])

    const city = extractCity(r.address)
    updateData("address", {
      displayName: r.display_name,
      street: r.address.road || "",
      city,
      state: r.address.state || "",
      country: r.address.country || "",
      pinCode: r.address.postcode || "",
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
    })
  }

  const handleClear = () => {
    setSearchQuery("")
    setResults([])
    setSelectedId(null)
  }

  return (
    <OnboardingLayout
      onNext={goNext}
      onBack={goBack}
      nextDisabled={!selectedId}
    >
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-[820px] mx-auto">
          <div
            className="w-full p-10"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "32px",
              border: "1px solid #D9DDD8",
            }}
          >
            <h1
              className="text-center mb-8"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "48px",
                fontWeight: 600,
                color: "#0D4F3A",
              }}
            >
              Enter your address
            </h1>

            {/* Search Field */}
            <div className="relative mb-8">
              <div
                className="flex items-center h-14 px-5 rounded-full border transition-all duration-200"
                style={{
                  borderColor: isSearching ? "#0D4F3A" : "#D9DDD8",
                  backgroundColor: "#F9F9F7",
                }}
              >
                {isSearching ? (
                  <svg className="w-5 h-5 text-[#0D4F3A] mr-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#6F756F] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                )}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for your address, city, or landmark..."
                  className="flex-1 bg-transparent outline-none text-base"
                  style={{ color: "#1A1A1A" }}
                />
                {searchQuery && (
                  <button
                    onClick={handleClear}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E8E4DC] transition-colors"
                    style={{ color: "#6F756F" }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "#6F756F" }}
              >
                {results.length > 0
                  ? "Suggested Locations"
                  : searchQuery.trim().length >= 2 && !isSearching
                    ? "No locations found — try a different search"
                    : "Enter at least 2 characters to search"}
              </p>

              <div className="space-y-3">
                {results.map((r) => (
                  <button
                    key={r.osm_id}
                    onClick={() => handleSelect(r)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left"
                    style={{
                      borderColor: selectedId === r.osm_id ? "#0D4F3A" : "#D9DDD8",
                      backgroundColor: selectedId === r.osm_id ? "#F6F4EF" : "#FFFFFF",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{
                        backgroundColor: selectedId === r.osm_id ? "#0D4F3A" : "#F6F4EF",
                      }}
                    >
                      {selectedId === r.osm_id ? (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-[#0D4F3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium truncate" style={{ color: "#1A1A1A" }}>
                        {r.address.city || r.address.town || r.address.village || r.address.county || "Unknown"}
                      </p>
                      <p className="text-sm truncate" style={{ color: "#6F756F" }}>
                        {r.display_name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
