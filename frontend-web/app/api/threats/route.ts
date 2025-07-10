import { NextResponse } from "next/server"

// Mock CloudWatch logs format simulation
const mockCloudWatchLogs = [
  {
    timestamp: "2025-01-24T10:30:01.123Z",
    message: "ACTION: Account locked for user_id user-abc123",
    logGroup: "/aws/lambda/lock_user_account_lambda",
  },
  {
    timestamp: "2025-01-24T10:30:02.456Z",
    message: "ACTION: SMS alert sent to +1-555-0123 regarding transaction txn-def456",
    logGroup: "/aws/lambda/send_alert_lambda",
  },
  {
    timestamp: "2025-01-24T10:30:03.789Z",
    message: "ACTION: Investigation ticket AEGIS-789012 created for fraud analysis team",
    logGroup: "/aws/lambda/create_ticket_lambda",
  },
]

// Generate mock threat data
function generateMockThreats() {
  const merchants = [
    "Luxury Electronics",
    "Premium Fashion",
    "High-End Jewelry",
    "Tech Paradise",
    "Designer Outlet",
    "Gaming World",
    "Exclusive Boutique",
    "Elite Store",
  ]

  const locations = [
    "Miami, FL",
    "Las Vegas, NV",
    "Beverly Hills, CA",
    "Manhattan, NY",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
    "Denver, CO",
  ]

  const threats = []
  const threatCount = Math.floor(Math.random() * 3) + 1 // 1-3 threats

  for (let i = 0; i < threatCount; i++) {
    const now = new Date()
    const transactionId = `txn-${Math.random().toString(36).substr(2, 9)}`
    const userId = `user-${Math.random().toString(36).substr(2, 6)}`

    const transaction = {
      transaction_id: transactionId,
      user_id: userId,
      amount: Math.floor(Math.random() * 5000) + 500,
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      timestamp: new Date(now.getTime() - Math.random() * 300000).toISOString(), // Within last 5 minutes
      fraud_score: 0.85 + Math.random() * 0.15, // High risk scores (85-100%)
      status: Math.random() > 0.7 ? "locked" : "active",
      customer_phone: "+1-555-0123",
    }

    // Generate agent actions with realistic timestamps
    const baseTime = new Date(transaction.timestamp)
    const agent_actions = [
      {
        timestamp: new Date(baseTime.getTime() + 100).toISOString(),
        action: "Account Lock Initiated",
        status: "success",
        details: `User account ${userId} locked to prevent further transactions`,
      },
      {
        timestamp: new Date(baseTime.getTime() + 250).toISOString(),
        action: "Customer Alert Sent",
        status: "success",
        details: `SMS alert sent to ${transaction.customer_phone} regarding suspicious transaction`,
      },
      {
        timestamp: new Date(baseTime.getTime() + 400).toISOString(),
        action: "Investigation Ticket Created",
        status: "success",
        details: `Ticket AEGIS-${transactionId.slice(-6)} created for fraud analysis team`,
      },
    ]

    threats.push({
      transaction,
      agent_actions,
      detected_at: transaction.timestamp,
    })
  }

  return threats
}

export async function GET() {
  try {
    // Simulate API processing delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const threats = generateMockThreats()

    return NextResponse.json({
      threats,
      cloudwatch_logs: mockCloudWatchLogs,
      timestamp: new Date().toISOString(),
      status: "success",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch threats", status: "error" }, { status: 500 })
  }
}
