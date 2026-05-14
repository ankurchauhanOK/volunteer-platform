import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 tracking-tight",
  {
    variants: {
      variant: {
        default: "bg-sb-500 text-white hover:bg-sb-600 shadow-sm",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline: "border border-sb-500 bg-transparent text-sb-600 hover:bg-sb-50",
        secondary: "bg-sb-100 text-sb-800 hover:bg-sb-200",
        ghost: "text-text-secondary hover:bg-ceramic hover:text-text",
        link: "text-sb-600 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-4 text-sm",
        md: "h-10 px-5 text-sm font-medium",
        lg: "h-12 px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
