import { Card, CardContent } from "@/components/ui/Card"

interface StatsCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: { value: string; positive: boolean }
}

export function StatsCard({ label, value, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {trend && (
              <p className={`text-xs mt-1 ${trend.positive ? "text-green-600" : "text-red-600"}`}>
                {trend.positive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          {icon && <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
