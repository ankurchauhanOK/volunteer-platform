"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-xl border-2 px-4 py-2.5 text-sm transition-all duration-200 outline-none",
            "focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
            "placeholder:text-gray-400",
            error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-gray-200 hover:border-gray-300",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    )
  },
)
Input.displayName = "Input"
