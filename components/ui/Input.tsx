import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; helperText?: string }>(
  ({ className, type, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-text uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-error-text focus-visible:ring-red-500" : "border-border focus-visible:border-brand-500",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-error-text">{error}</p>}
        {helperText && !error && <p className="text-xs text-text-muted">{helperText}</p>}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
