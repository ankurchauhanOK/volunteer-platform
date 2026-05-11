import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold text-text uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-xl border-2 bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            error ? "border-error-text" : "border-border focus-visible:border-brand-500",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-error-text">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = "Textarea"

export { Textarea }
