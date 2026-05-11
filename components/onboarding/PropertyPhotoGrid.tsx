"use client"

import { useState, useRef, useCallback } from "react"
import { cn, photoSuggestionLabels } from "@/lib/utils"

interface PropertyPhotoGridProps {
  photos: string[]
  onChange: (photos: string[]) => void
}

export function PropertyPhotoGrid({ photos, onChange }: PropertyPhotoGridProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList) => {
    const remaining = 20 - photos.length
    const toProcess = Math.min(files.length, remaining)
    const newPhotos: string[] = []
    let loaded = 0
    for (let i = 0; i < toProcess; i++) {
      const file = files[i]
      if (!file.type.startsWith("image/")) continue
      const reader = new FileReader()
      reader.onload = e => {
        if (e.target?.result) newPhotos.push(e.target.result as string)
        loaded++
        if (loaded === toProcess) onChange([...photos, ...newPhotos])
      }
      reader.readAsDataURL(file)
    }
  }, [photos, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }, [addFiles])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files)
  }, [addFiles])

  const removePhoto = (idx: number) => onChange(photos.filter((_, i) => i !== idx))
  const moveUp = (idx: number) => {
    if (idx === 0) return
    const arr: string[] = [...photos]
    const tmp = arr[idx - 1]
    arr[idx - 1] = arr[idx]
    arr[idx] = tmp
    onChange(arr)
  }
  const moveDown = (idx: number) => {
    if (idx === photos.length - 1) return
    const arr: string[] = [...photos]
    const tmp = arr[idx]
    arr[idx] = arr[idx + 1]
    arr[idx + 1] = tmp
    onChange(arr)
  }

  const showUploadCard = photos.length < 20

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Property photos</label>
      <p className="text-xs text-gray-500 -mt-2">Upload photos that represent your space and atmosphere.</p>

      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !showUploadCard ? null : inputRef.current?.click()}
        className={cn(
          "rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer",
          dragOver ? "border-brand-500 bg-brand-50" : "border-gray-300 hover:border-brand-400 hover:bg-gray-50",
          !showUploadCard && "hidden",
        )}
      >
        <svg className="mx-auto w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm text-gray-500">Drag & drop photos here, or tap to browse</p>
        <p className="text-xs text-gray-400 mt-1">{photos.length} / 20 uploaded</p>
        <input ref={inputRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={handleChange} />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo, idx) => (
            <div key={idx} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 animate-scale-in">
              <img src={photo} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0}
                  className="p-1 rounded bg-white/90 text-gray-700 hover:bg-white disabled:opacity-30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                </button>
                <button type="button" onClick={() => moveDown(idx)} disabled={idx === photos.length - 1}
                  className="p-1 rounded bg-white/90 text-gray-700 hover:bg-white disabled:opacity-30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <button type="button" onClick={() => removePhoto(idx)}
                  className="p-1 rounded bg-red-500/90 text-white hover:bg-red-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">{idx + 1}</span>
            </div>
          ))}
          {showUploadCard && (
            <button type="button" onClick={() => inputRef.current?.click()}
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-400 hover:bg-gray-50 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-brand-500 transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-[10px]">Add more</span>
            </button>
          )}
        </div>
      )}

      {photos.length === 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">Suggested photos:</p>
          <div className="flex flex-wrap gap-1.5">
            {photoSuggestionLabels.map(label => (
              <span key={label} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] border border-gray-200">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
        <p className="text-xs font-medium text-amber-800">Tips for great photos:</p>
        <ul className="text-[11px] text-amber-700 space-y-0.5">
          <li>• Show clean and well-lit spaces</li>
          <li>• Upload real photos, not posters</li>
          <li>• Include where volunteers stay</li>
          <li>• Include common areas</li>
          <li>• Show daily life atmosphere</li>
        </ul>
      </div>
    </div>
  )
}
