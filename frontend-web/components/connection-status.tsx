"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"
import { useAegis } from "@/contexts/aegis-context"

export function ConnectionStatus() {
  const { state } = useAegis()

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={state.isConnected ? "default" : "destructive"}>
        {state.isConnected ? (
          <>
            <Wifi className="h-3 w-3 mr-1" />
            Connected
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3 mr-1" />
            Disconnected
          </>
        )}
      </Badge>
      <span className="text-xs text-muted-foreground" suppressHydrationWarning>
        Last update: {new Date(state.lastUpdate).toLocaleTimeString()}
      </span>
    </div>
  )
}
