"use client"

import { Navigation } from "@/components/navigation"
import { ThreatFeed } from "@/components/threat-feed"
import { ConnectionStatus } from "@/components/connection-status"

export default function LiveFeedPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Live Threat Feed</h1>
              <p className="text-muted-foreground mt-1">Real-time fraud detection monitoring</p>
            </div>
            <ConnectionStatus />
          </div>
        </div>

        <ThreatFeed />
      </div>
    </div>
  )
}
