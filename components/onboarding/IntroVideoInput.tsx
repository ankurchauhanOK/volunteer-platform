"use client"

import { useState } from "react"

interface IntroVideoInputProps {
  value?: string
  onChange: (url: string) => void
}

export function IntroVideoInput({ value, onChange }: IntroVideoInputProps) {
  const [mode, setMode] = useState<"upload" | "link">(value?.startsWith("http") ? "link" : "upload")

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Optional intro video</label>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button type="button" onClick={() => setMode("upload")}
            className={`px-2.5 py-1 text-xs rounded-md transition-all ${mode === "upload" ? "bg-white shadow-sm text-gray-700 font-medium" : "text-gray-500 hover:text-gray-700"}`}>
            Upload
          </button>
          <button type="button" onClick={() => setMode("link")}
            className={`px-2.5 py-1 text-xs rounded-md transition-all ${mode === "link" ? "bg-white shadow-sm text-gray-700 font-medium" : "text-gray-500 hover:text-gray-700"}`}>
            Link
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-brand-400 hover:bg-gray-50 transition-all cursor-pointer">
          <svg className="mx-auto w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-sm text-gray-500">Upload a short video</p>
          <p className="text-xs text-gray-400 mt-1">30 seconds max</p>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={value || ""}
            onChange={e => onChange(e.target.value)}
            placeholder="Paste YouTube, Instagram, or Reel URL..."
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {value && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Link added
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400">Introduce yourself and your space in 30 seconds. Hosts with videos usually receive more trusted applications.</p>
    </div>
  )
}
