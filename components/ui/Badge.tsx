import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gray-100 text-gray-700",
        primary: "border-transparent bg-brand-100 text-brand-700",
        secondary: "border-transparent bg-ocean-100 text-ocean-700",
        success: "border-transparent bg-green-100 text-green-700",
        warning: "border-transparent bg-warm-100 text-warning-text",
        destructive: "border-transparent bg-red-100 text-red-700",
        info: "border-transparent bg-sky-100 text-sky-400",
        purple: "border-transparent bg-purple-100 text-purple-700",
        outline: "border-border text-text-secondary",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
