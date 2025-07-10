"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle, Shield, MessageSquare, Ticket } from "lucide-react"
import { useAegis, type AgentAction } from "@/contexts/aegis-context"
import { cn } from "@/lib/utils"

export function AgentActionLog() {
  const { state } = useAegis()
  const [actions, setActions] = useState<AgentAction[]>([])

  // Generate detailed agent actions when a threat is selected
  useEffect(() => {
    if (state.selectedThreat) {
      const threat = state.selectedThreat
      const baseTime = new Date(threat.detected_at)

      // Generate realistic agent action sequence
      const agentActions: AgentAction[] = [
        {
          timestamp: new Date(baseTime.getTime() + 100).toISOString(),
          action: "Account Lock Initiated",
          status: "success",
          details: `User account ${threat.transaction.user_id} locked to prevent further transactions`,
        },
        {
          timestamp: new Date(baseTime.getTime() + 250).toISOString(),
          action: "Customer Alert Sent",
          status: "success",
          details: `SMS alert sent to ${threat.transaction.customer_phone} regarding suspicious transaction`,
        },
        {
          timestamp: new Date(baseTime.getTime() + 400).toISOString(),
          action: "Investigation Ticket Created",
          status: "success",
          details: `Ticket AEGIS-${threat.transaction.transaction_id.slice(-6)} created for fraud analysis team`,
        },
        {
          timestamp: new Date(baseTime.getTime() + 550).toISOString(),
          action: "Risk Assessment Updated",
          status: "success",
          details: `User risk profile updated with fraud score: ${(threat.transaction.fraud_score * 100).toFixed(1)}%`,
        },
        {
          timestamp: new Date(baseTime.getTime() + 700).toISOString(),
          action: "Compliance Notification",
          status: "success",
          details: "Regulatory compliance team notified of high-risk transaction event",
        },
      ]

      // Add unlock action if account was unlocked
      if (threat.transaction.status === "resolved") {
        agentActions.push({
          timestamp: new Date(baseTime.getTime() + 1000).toISOString(),
          action: "Account Unlock Completed",
          status: "success",
          details: "Account unlocked by analyst override - false positive confirmed",
        })
      }

      setActions(agentActions)
    } else {
      setActions([])
    }
  }, [state.selectedThreat])

  const getActionIcon = (action: string) => {
    if (action.includes("Lock")) return Shield
    if (action.includes("Alert") || action.includes("SMS")) return MessageSquare
    if (action.includes("Ticket")) return Ticket
    if (action.includes("Unlock")) return CheckCircle
    return CheckCircle
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return CheckCircle
      case "pending":
        return Clock
      case "failed":
        return XCircle
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-500"
      case "pending":
        return "text-yellow-500"
      case "failed":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Agent Action Log</span>
          {actions.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {actions.length} Actions
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-4">
            {!state.selectedThreat ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a threat to view agent actions</p>
                <p className="text-sm">Detailed action logs will appear here</p>
              </div>
            ) : actions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Processing threat...</p>
                <p className="text-sm">Agent actions will appear shortly</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <h3 className="font-semibold text-sm">Selected Threat</h3>
                  <p className="text-sm text-muted-foreground">
                    {state.selectedThreat.transaction.merchant} - ${state.selectedThreat.transaction.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">ID: {state.selectedThreat.transaction.transaction_id}</p>
                </div>

                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

                  {actions.map((action, index) => {
                    const ActionIcon = getActionIcon(action.action)
                    const StatusIcon = getStatusIcon(action.status)

                    return (
                      <div key={index} className="relative flex items-start space-x-4 pb-6">
                        {/* Timeline dot */}
                        <div
                          className={cn(
                            "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 bg-background",
                            action.status === "success"
                              ? "border-green-500"
                              : action.status === "pending"
                                ? "border-yellow-500"
                                : "border-red-500",
                          )}
                        >
                          <ActionIcon className="h-5 w-5 text-muted-foreground" />
                        </div>

                        {/* Action content */}
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold">{action.action}</h4>
                            <StatusIcon className={cn("h-4 w-4", getStatusColor(action.status))} />
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">{action.details}</p>

                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(action.timestamp).toLocaleTimeString()}</span>
                            <Badge variant={action.status === "success" ? "default" : "secondary"} className="text-xs">
                              {action.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Summary */}
                <div className="mt-6 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold">Remediation Complete</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All automated security protocols executed successfully. Total response time:{" "}
                    {actions.length > 0
                      ? `${
                          Math.round(
                            ((new Date(actions[actions.length - 1].timestamp).getTime() -
                              new Date(actions[0].timestamp).getTime()) /
                              1000) *
                              10,
                          ) / 10
                        }s`
                      : "0s"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
