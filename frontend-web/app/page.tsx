"use client"

import { Navigation } from "@/components/navigation"
import { ThreatFeed } from "@/components/threat-feed"
import { AgentActionLog } from "@/components/agent-action-log"
import { ConnectionStatus } from "@/components/connection-status"
import { StatsOverview } from "@/components/stats-overview"

export default function CommandCenter() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Aegis Command Center</h1>
              <p className="text-muted-foreground mt-1">Real-time fraud detection and remediation</p>
            </div>
            <ConnectionStatus />
          </div>
        </div>

        <StatsOverview />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-6">
            <ThreatFeed />
          </div>

          <div className="space-y-6">
            <AgentActionLog />
          </div>
        </div>
      </div>
    </div>
  )
}
