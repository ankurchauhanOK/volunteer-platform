"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar"

interface PhotoUploadProps {
  value?: string
  onChange: (dataUrl: string) => void
  label?: string
  helperText?: string
}

export function PhotoUpload({ value, onChange, label = "Profile photo", helperText = "Clear, friendly photos help hosts connect with you faster." }: PhotoUploadProps) {
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
      <label className="block text-xs font-semibold text-text uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-5">
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden shrink-0",
            dragOver ? "border-sb-500 bg-sb-50 scale-105" : "border-border hover:border-sb-400 hover:bg-sb-50/50",
            value && "border-solid border-sb-400",
          )}
        >
          {value ? (
            <Avatar className="w-full h-full">
              <AvatarImage src={value} className="object-cover" />
              <AvatarFallback>
                <svg className="w-8 h-8 text-sb-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex flex-col items-center gap-0.5 text-text-muted">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              <span className="text-xs leading-tight">Upload</span>
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-text-secondary leading-snug">{helperText}</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs font-medium text-sb-600 hover:text-sb-700 transition-colors"
          >
            {value ? "Change photo" : "Choose a photo"}
          </button>
        </div>
      </div>
    </div>
  )
}
