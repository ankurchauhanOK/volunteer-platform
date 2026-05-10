"use client"

import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ className, label, error, options, placeholder, id, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          "w-full rounded-xl border-2 px-4 py-2.5 text-sm transition-all duration-200 outline-none bg-white",
          "focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
          error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-gray-200 hover:border-gray-300",
          className,
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
