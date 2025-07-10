// -----------------------------------------------------------------
// File: lock_user_account_lambda/index.mjs (FINAL)
// Description: Correctly handles API Gateway invocation from Bedrock Agent.
// -----------------------------------------------------------------
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const THREAT_LOG_TABLE = "aegis-threat-log";

export const handler = async (event) => {
  try {
    console.log("Received event for lock_user_account_lambda:", JSON.stringify(event, null, 2));

    // According to AWS Docs, agent parameters are in this nested structure
    const properties = event.requestBody.content['application/json'].properties;
    const userId = properties.find(p => p.name === 'userId')?.value;
    const transactionId = properties.find(p => p.name === 'transactionId')?.value;

    if (!userId || !transactionId) {
      throw new Error("Input validation failed: 'userId' and 'transactionId' were not found in the event parameters.");
    }
    
    const message = `ACTION: Account locked for user [${userId}] for transaction [${transactionId}]`;
    console.log(message);
    
    const logCommand = new PutCommand({
        TableName: THREAT_LOG_TABLE,
        Item: {
            transaction_id: transactionId,
            timestamp: Date.now(),
            action_message: message,
            source_lambda: "lock_user_account_lambda"
        }
    });
    await docClient.send(logCommand);

    const responseBody = { status: "success", message: `Account for user ${userId} has been locked.` };
    
    // Return a standard API Gateway proxy response
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(responseBody)
    };

  } catch (error) {
    console.error("ERROR in lock_user_account_lambda:", error.message);
    const errorBody = { status: "error", message: error.message };
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(errorBody)
    };
  }
};
