import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple"
  size?: "sm" | "md"
  className?: string
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center font-medium rounded-full",
      size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
      variant === "default" && "bg-gray-100 text-gray-700",
      variant === "success" && "bg-green-100 text-green-700",
      variant === "warning" && "bg-yellow-100 text-yellow-700",
      variant === "error" && "bg-red-100 text-red-700",
      variant === "info" && "bg-blue-100 text-blue-700",
      variant === "purple" && "bg-purple-100 text-purple-700",
      className,
    )}>
      {children}
    </span>
  )
}
