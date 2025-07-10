"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield, Clock, TrendingUp } from "lucide-react"
import { useAegis } from "@/contexts/aegis-context"

export function StatsOverview() {
  const { state } = useAegis()

  const activeThreats = state.threats.filter((t) => t.transaction.status === "active").length
  const resolvedThreats = state.threats.filter((t) => t.transaction.status === "resolved").length
  const avgResponseTime = "0.7s" // Mock average response time
  const preventedLoss = state.threats.reduce((sum, t) => sum + t.transaction.amount, 0)

  const stats = [
    {
      title: "Active Threats",
      value: activeThreats,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Threats Resolved",
      value: resolvedThreats,
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Avg Response Time",
      value: avgResponseTime,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Loss Prevented",
      value: `$${preventedLoss.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" suppressHydrationWarning>{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
