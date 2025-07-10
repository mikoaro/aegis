import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { transaction_id, user_id } = body

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock CloudWatch log entry
    const logEntry = {
      timestamp: new Date().toISOString(),
      message: `ACTION: Account unlock completed for user_id ${user_id} - transaction ${transaction_id}`,
      logGroup: "/aws/lambda/unlock_account_lambda",
      requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
    }

    console.log("Unlock request processed:", logEntry)

    return NextResponse.json({
      status: "success",
      message: `Account unlocked for user ${user_id}`,
      transaction_id,
      timestamp: new Date().toISOString(),
      log_entry: logEntry,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to unlock account", status: "error" }, { status: 500 })
  }
}
