"use client"

interface ProfileCompletenessProps {
  hasHostPhoto: boolean
  propertyPhotoCount: number
  hasVibes: boolean
  hasIntroVideo: boolean
  hasExperience: boolean
  hasDescription: boolean
  hasFacilities: boolean
  hasLocation: boolean
}

export function ProfileCompleteness({
  hasHostPhoto,
  propertyPhotoCount,
  hasVibes,
  hasIntroVideo,
  hasExperience,
  hasDescription,
  hasFacilities,
  hasLocation,
}: ProfileCompletenessProps) {
  const items = [
    { label: "Host profile photo", done: hasHostPhoto },
    { label: "Property photos", done: propertyPhotoCount >= 4 },
    { label: "Property vibe tags", done: hasVibes },
    { label: "Intro video", done: hasIntroVideo },
    { label: "Volunteer experience", done: hasExperience },
    { label: "Description", done: hasDescription },
    { label: "Facilities & amenities", done: hasFacilities },
    { label: "Location details", done: hasLocation },
  ]

  const done = items.filter(i => i.done).length
  const percentage = Math.round((done / items.length) * 100)

  const suggestions: string[] = []
  if (!hasHostPhoto) suggestions.push("Upload a host photo")
  if (propertyPhotoCount < 4) suggestions.push(`Add ${4 - Math.min(propertyPhotoCount, 4)} more property photos (min 4)`)
  if (!hasVibes) suggestions.push("Add property vibe tags")
  if (!hasIntroVideo) suggestions.push("Add an intro video (optional but recommended)")
  if (!hasExperience) suggestions.push("Describe volunteer experience")
  if (!hasDescription) suggestions.push("Add a description")
  if (!hasFacilities) suggestions.push("Add facility details")
  if (!hasLocation) suggestions.push("Add location details")

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-tanker text-xl text-text">Profile completeness</h4>
        <span className="font-tanker text-2xl text-brand-600">{percentage}%</span>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-1.5">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            {item.done ? (
              <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
            <span className={item.done ? "text-gray-500" : "text-gray-400"}>{item.label}</span>
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
          <p className="text-xs font-semibold text-amber-800">Suggestions to improve:</p>
          {suggestions.map(s => (
            <p key={s} className="text-xs text-amber-700 flex items-center gap-1">
              <span>→</span> {s}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
