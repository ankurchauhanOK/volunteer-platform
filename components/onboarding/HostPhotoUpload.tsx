"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface HostPhotoUploadProps {
  value?: string
  onChange: (dataUrl: string) => void
}

export function HostPhotoUpload({ value, onChange }: HostPhotoUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = e => {
      if (e.target?.result) onChange(e.target.result as string)
    }
    reader.readAsDataURL(file)
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-text uppercase tracking-wider">Host profile photo</label>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative mx-auto w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden",
          dragOver ? "border-brand-500 bg-brand-50 scale-105" : "border-gray-300 hover:border-brand-400 hover:bg-gray-50",
          value && "border-solid border-brand-400",
        )}
      >
        {value ? (
          <img src={value} alt="Host" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className="text-xs text-center leading-tight">Upload photo</span>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} />
      </div>
      <p className="text-center text-xs text-gray-400">Clear, friendly photos build trust faster.</p>
    </div>
  )
}
