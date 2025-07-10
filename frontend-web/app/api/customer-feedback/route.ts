import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { transaction_id, user_response, user_id } = body

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock CloudWatch log entry
    const logEntry = {
      timestamp: new Date().toISOString(),
      message: `CUSTOMER_FEEDBACK: User ${user_id} responded "${user_response}" for transaction ${transaction_id}`,
      logGroup: "/aws/lambda/customer_feedback_lambda",
      requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
    }

    console.log("Customer feedback received:", logEntry)

    // Determine next action based on response
    const nextAction =
      user_response === "legitimate"
        ? "Account will be unlocked automatically"
        : "Fraud confirmed - maintaining security measures"

    return NextResponse.json({
      status: "success",
      message: "Customer feedback received",
      transaction_id,
      user_response,
      next_action: nextAction,
      timestamp: new Date().toISOString(),
      log_entry: logEntry,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process customer feedback", status: "error" }, { status: 500 })
  }
}
