"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface PhotoGridUploadProps {
  photos: string[]
  onChange: (photos: string[]) => void
  maxPhotos?: number
  label?: string
  helperText?: string
}

export function PhotoGridUpload({
  photos,
  onChange,
  maxPhotos = 6,
  label = "Profile photos",
  helperText = "Upload 2 photos to start. Add 4 or more to make your profile stand out.",
}: PhotoGridUploadProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleFile = useCallback(
    (file: File, slotIndex: number) => {
      if (!file.type.startsWith("image/")) return
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          const newPhotos = [...photos]
          newPhotos[slotIndex] = e.target.result as string
          onChange(newPhotos)
        }
      }
      reader.readAsDataURL(file)
    },
    [photos, onChange]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file, slotIndex)
      // Reset input so same file can be selected again
      e.target.value = ""
    },
    [handleFile]
  )

  const handleRemove = useCallback(
    (slotIndex: number) => {
      const newPhotos = photos.filter((_, i) => i !== slotIndex)
      onChange(newPhotos)
    },
    [photos, onChange]
  )

  const handleDragStart = useCallback((index: number) => {
    setDraggingIndex(index)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault()
      if (draggingIndex !== null && draggingIndex !== index) {
        setDragOverIndex(index)
      }
    },
    [draggingIndex]
  )

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault()
      setDragOverIndex(null)
      setDraggingIndex(null)

      // Handle file drop into empty slot
      const files = e.dataTransfer.files
      if (files.length > 0 && files[0].type.startsWith("image/")) {
        if (!photos[dropIndex]) {
          handleFile(files[0], dropIndex)
          return
        }
      }

      // Handle reorder: swap photos between slots
      const fromIndex = draggingIndex
      if (fromIndex === null || fromIndex === dropIndex) return

      const newPhotos = [...photos]
      const fromPhoto = newPhotos[fromIndex]
      const toPhoto = newPhotos[dropIndex]
      newPhotos[fromIndex] = toPhoto || ""
      newPhotos[dropIndex] = fromPhoto || ""
      // Clean up empty strings at end
      while (newPhotos.length > 0 && !newPhotos[newPhotos.length - 1]) {
        newPhotos.pop()
      }
      onChange(newPhotos)
    },
    [draggingIndex, photos, handleFile, onChange]
  )

  const handleDragEnd = useCallback(() => {
    setDraggingIndex(null)
    setDragOverIndex(null)
  }, [])

  const slots = Array.from({ length: maxPhotos }, (_, i) => i)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-text uppercase tracking-wider">
          {label}
        </label>
        {photos.length > 0 && (
          <span className="text-[10px] text-text-muted">
            {photos.length}/{maxPhotos}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {slots.map((slotIndex) => {
          const photo = photos[slotIndex]
          const isDraggingOver = dragOverIndex === slotIndex
          const isDragging = draggingIndex === slotIndex

          return (
            <div
              key={slotIndex}
              draggable={!!photo}
              onDragStart={() => handleDragStart(slotIndex)}
              onDragOver={(e) => handleDragOver(e, slotIndex)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, slotIndex)}
              onDragEnd={handleDragEnd}
              onClick={() => !photo && inputRefs.current[slotIndex]?.click()}
              className={cn(
                "relative aspect-[3/4] rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group",
                photo
                  ? "shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.24)]"
                  : "border-2 border-dashed border-border bg-ceramic/30 hover:border-sb-400 hover:bg-sb-50/30",
                isDraggingOver && "scale-[1.02] border-sb-400 bg-sb-50/20 ring-1 ring-sb-500/20",
                isDragging && "opacity-50 scale-95",
                !photo && "hover:-translate-y-0.5 hover:shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.24)]"
              )}
            >
              {photo ? (
                <>
                  <img
                    src={photo}
                    alt={`Profile photo ${slotIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    draggable={false}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(slotIndex)
                      }}
                      className="w-8 h-8 rounded-full bg-white/90 text-text flex items-center justify-center shadow-sm hover:bg-white transition-all active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {/* Drag handle indicator on hover */}
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <svg className="w-3 h-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="w-7 h-7 rounded-full bg-sb-500 text-white flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                </div>
              )}
              <input
                ref={(el) => { inputRefs.current[slotIndex] = el }}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleChange(e, slotIndex)}
              />
            </div>
          )
        })}
      </div>

      <p className="text-[11px] text-text-muted text-center leading-relaxed">
        {helperText}
      </p>
      <p className="text-[10px] text-text-muted text-center">
        Hold, drag and drop to reorder your photos
      </p>
    </div>
  )
}
