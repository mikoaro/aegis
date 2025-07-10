"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface Transaction {
  transaction_id: string
  user_id: string
  amount: number
  merchant: string
  location: string
  timestamp: string
  fraud_score: number
  status: "active" | "locked" | "unlocking" | "resolved"
  customer_phone: string
}

export interface AgentAction {
  timestamp: string
  action: string
  status: "success" | "pending" | "failed"
  details: string
}

export interface ThreatData {
  transaction: Transaction
  agent_actions: AgentAction[]
  detected_at: string
}

interface AegisState {
  threats: ThreatData[]
  selectedThreat: ThreatData | null
  isConnected: boolean
  lastUpdate: string
}

type AegisAction =
  | { type: "ADD_THREAT"; payload: ThreatData }
  | { type: "UPDATE_THREAT"; payload: { transaction_id: string; updates: Partial<Transaction> } }
  | { type: "SELECT_THREAT"; payload: ThreatData | null }
  | { type: "SET_CONNECTION_STATUS"; payload: boolean }
  | { type: "UPDATE_LAST_UPDATE" }
  | { type: "LOAD_FROM_STORAGE"; payload: ThreatData[] }

const initialState: AegisState = {
  threats: [],
  selectedThreat: null,
  isConnected: false,
  lastUpdate: new Date().toISOString(),
}

function aegisReducer(state: AegisState, action: AegisAction): AegisState {
  switch (action.type) {
    case "ADD_THREAT":
      const newThreats = [action.payload, ...state.threats].slice(0, 50) // Keep last 50
      return {
        ...state,
        threats: newThreats,
        lastUpdate: new Date().toISOString(),
      }
    case "UPDATE_THREAT":
      return {
        ...state,
        threats: state.threats.map((threat) =>
          threat.transaction.transaction_id === action.payload.transaction_id
            ? { ...threat, transaction: { ...threat.transaction, ...action.payload.updates } }
            : threat,
        ),
        selectedThreat:
          state.selectedThreat?.transaction.transaction_id === action.payload.transaction_id
            ? {
                ...state.selectedThreat,
                transaction: { ...state.selectedThreat.transaction, ...action.payload.updates },
              }
            : state.selectedThreat,
      }
    case "SELECT_THREAT":
      return { ...state, selectedThreat: action.payload }
    case "SET_CONNECTION_STATUS":
      return { ...state, isConnected: action.payload }
    case "UPDATE_LAST_UPDATE":
      return { ...state, lastUpdate: new Date().toISOString() }
    case "LOAD_FROM_STORAGE":
      return { ...state, threats: action.payload }
    default:
      return state
  }
}

const AegisContext = createContext<{
  state: AegisState
  dispatch: React.Dispatch<AegisAction>
} | null>(null)

export function AegisProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(aegisReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("aegis-threats")
    if (stored) {
      try {
        const threats = JSON.parse(stored)
        dispatch({ type: "LOAD_FROM_STORAGE", payload: threats })
      } catch (error) {
        console.error("Failed to load stored threats:", error)
      }
    }
  }, [])

  // Save to localStorage when threats change
  useEffect(() => {
    localStorage.setItem("aegis-threats", JSON.stringify(state.threats))
  }, [state.threats])

  return <AegisContext.Provider value={{ state, dispatch }}>{children}</AegisContext.Provider>
}

export function useAegis() {
  const context = useContext(AegisContext)
  if (!context) {
    throw new Error("useAegis must be used within an AegisProvider")
  }
  return context
}
