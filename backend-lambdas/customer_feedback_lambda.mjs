// -----------------------------------------------------------------
// File: customer_feedback_lambda/index.mjs (Endpoint C)
// -----------------------------------------------------------------
import { DynamoDBClient as DDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient as DDBDocClient, PutCommand as DDBPutCommand } from "@aws-sdk/lib-dynamodb";
const ddbClient = new DDBClient({});
const ddbDocClient = DDBDocClient.from(ddbClient);
const LOG_TABLE = "aegis-threat-log";
export const handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { transactionId, response } = requestBody;
    if (!transactionId || !response || !['yes', 'no'].includes(response)) {
      throw new Error("Invalid input: 'transactionId' and a 'response' of 'yes' or 'no' are required.");
    }
    const message = `FEEDBACK RECEIVED: Customer responded '${response}' for transactionId: [${transactionId}]`;
    console.log(message);
    const logCommand = new DDBPutCommand({
        TableName: LOG_TABLE,
        Item: {
            transaction_id: transactionId,
            timestamp: Date.now(),
            action_message: message,
            source_lambda: "customer_feedback_lambda"
        }
    });
    await ddbDocClient.send(logCommand);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ status: "success", message: "Thank you for your feedback." }),
    };
  } catch (error) {
    console.error("ERROR in customer_feedback_lambda:", error.message);
    return { statusCode: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ status: "error", message: error.message })};
  }
};