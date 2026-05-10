import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-sm",
        hover && "hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 pt-6 pb-4", className)}>{children}</div>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>
}
