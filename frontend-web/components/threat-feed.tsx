"use client";

import { useEffect, useState, useOptimistic, startTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, CreditCard, Clock, Unlock } from "lucide-react";
import { useAegis, type ThreatData } from "@/contexts/aegis-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ThreatFeed() {
  const { state, dispatch } = useAegis();
  const [isLoading, setIsLoading] = useState(false);

  // Optimistic updates for unlock operations
  const [optimisticThreats, setOptimisticThreats] = useOptimistic(
    state.threats,
    (
      currentThreats,
      { transaction_id, status }: { transaction_id: string; status: string }
    ) => {
      return currentThreats.map((threat) =>
        threat.transaction.transaction_id === transaction_id
          ? {
              ...threat,
              transaction: { ...threat.transaction, status: status as any },
            }
          : threat
      );
    }
  );

  // Polling mechanism for threat updates
  useEffect(() => {
    const pollThreats = async () => {
      try {
        dispatch({ type: "SET_CONNECTION_STATUS", payload: true });
        // const response = await fetch("/api/threats");
        const response = await fetch(
          "https://a3b7k0jok1.execute-api.us-east-1.amazonaws.com/api/threats"
        );
        const data = await response.json();

        // Add new threats that aren't already in the list
        data.threats.forEach((threat: ThreatData) => {
          const exists = state.threats.some(
            (t) =>
              t.transaction.transaction_id === threat.transaction.transaction_id
          );
          if (!exists) {
            dispatch({ type: "ADD_THREAT", payload: threat });
            toast.error(
              `High-risk transaction detected: ${threat.transaction.merchant}`,
              {
                description: `Amount: $${threat.transaction.amount} - Score: ${threat.transaction.fraud_score}`,
              }
            );
          }
        });
      } catch (error) {
        dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
        console.error("Failed to fetch threats:", error);
      }
    };

    // Initial load
    pollThreats();

    // Poll every 20 seconds
    const interval = setInterval(pollThreats, 20000);
    return () => clearInterval(interval);
  }, [dispatch, state.threats]);

  // WebSocket simulation for real-time updates
  useEffect(() => {
    const simulateWebSocket = () => {
      // Simulate random threat generation
      if (Math.random() < 0.1) {
        // 10% chance every 5 seconds
        const mockThreat = generateMockThreat();
        dispatch({ type: "ADD_THREAT", payload: mockThreat });
        toast.error(`New threat detected: ${mockThreat.transaction.merchant}`);
      }
    };

    const wsInterval = setInterval(simulateWebSocket, 5000);
    return () => clearInterval(wsInterval);
  }, [dispatch]);

  const handleUnlockAccount = async (threat: ThreatData) => {
    setIsLoading(true);

    // Optimistic update (wrap in transition to satisfy React 19)
    startTransition(() => {
      setOptimisticThreats({
        transaction_id: threat.transaction.transaction_id,
        status: "unlocking",
      });
    });

    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: threat.transaction.transaction_id,
          user_id: threat.transaction.user_id,
        }),
      });

      if (response.ok) {
        // Update the actual state
        dispatch({
          type: "UPDATE_THREAT",
          payload: {
            transaction_id: threat.transaction.transaction_id,
            updates: { status: "resolved" },
          },
        });
        toast.success("Account unlocked successfully");
      } else {
        throw new Error("Failed to unlock account");
      }
    } catch (error) {
      // Revert optimistic update on error
      dispatch({
        type: "UPDATE_THREAT",
        payload: {
          transaction_id: threat.transaction.transaction_id,
          updates: { status: "locked" },
        },
      });
      toast.error("Failed to unlock account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectThreat = (threat: ThreatData) => {
    dispatch({ type: "SELECT_THREAT", payload: threat });
  };

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <span>Live Threat Feed</span>
          <Badge variant="destructive" className="ml-auto">
            {optimisticThreats.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-2 p-4">
            {optimisticThreats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No threats detected</p>
                <p className="text-sm">System monitoring active</p>
              </div>
            ) : (
              optimisticThreats.map((threat) => (
                <ThreatItem
                  key={threat.transaction.transaction_id}
                  threat={threat}
                  isSelected={
                    state.selectedThreat?.transaction.transaction_id ===
                    threat.transaction.transaction_id
                  }
                  onSelect={() => handleSelectThreat(threat)}
                  onUnlock={() => handleUnlockAccount(threat)}
                  isUnlocking={
                    isLoading && threat.transaction.status === "unlocking"
                  }
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ThreatItem({
  threat,
  isSelected,
  onSelect,
  onUnlock,
  isUnlocking,
}: {
  threat: ThreatData;
  isSelected: boolean;
  onSelect: () => void;
  onUnlock: () => void;
  isUnlocking: boolean;
}) {
  const getRiskColor = (score: number) => {
    if (score >= 0.9) return "text-red-500";
    if (score >= 0.7) return "text-orange-500";
    return "text-yellow-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "locked":
        return "destructive";
      case "unlocking":
        return "secondary";
      case "resolved":
        return "default";
      default:
        return "destructive";
    }
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
        isSelected ? "border-primary bg-primary/5" : "border-border",
        threat.transaction.status === "active" && "pulse-red"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">
            {threat.transaction.transaction_id}
          </span>
        </div>
        <Badge variant={getStatusColor(threat.transaction.status)}>
          {threat.transaction.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg">
            ${threat.transaction.amount.toLocaleString()}
          </span>
          <span
            className={cn(
              "font-bold",
              getRiskColor(threat.transaction.fraud_score)
            )}
          >
            Risk: {(threat.transaction.fraud_score * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span className="font-medium">{threat.transaction.merchant}</span>
        </div>

        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{threat.transaction.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span suppressHydrationWarning>
              {new Date(threat.transaction.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {(threat.transaction.status === "locked" ||
          threat.transaction.status === "unlocking") && (
          <div className="mt-3 pt-3 border-t">
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-background text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onUnlock();
              }}
              disabled={
                isUnlocking || threat.transaction.status === "unlocking"
              }
            >
              <Unlock className="h-4 w-4 mr-2" />
              {isUnlocking || threat.transaction.status === "unlocking"
                ? "Unlocking..."
                : "Override & Unlock"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock threat generation for WebSocket simulation
function generateMockThreat(): ThreatData {
  const merchants = [
    "Luxury Goods Inc.",
    "Electronics World",
    "Fashion Boutique",
    "Tech Store",
    "Jewelry Palace",
    "Gaming Paradise",
    "Premium Outlet",
    "Designer Store",
  ];

  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
  ];

  const now = new Date();
  const transactionId = `txn-${Math.random().toString(36).substr(2, 9)}`;
  const userId = `user-${Math.random().toString(36).substr(2, 6)}`;

  const transaction = {
    transaction_id: transactionId,
    user_id: userId,
    amount: Math.floor(Math.random() * 2000) + 100,
    merchant: merchants[Math.floor(Math.random() * merchants.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    timestamp: now.toISOString(),
    fraud_score: 0.85 + Math.random() * 0.15, // High risk scores
    status: "active" as const,
    customer_phone: "+1-555-0123",
  };

  const agent_actions: any[] = [];

  return {
    transaction,
    agent_actions,
    detected_at: now.toISOString(),
  };
}
