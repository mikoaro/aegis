// -----------------------------------------------------------------
// File: send_alert_lambda/index.mjs (FINAL)
// -----------------------------------------------------------------
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { DynamoDBClient as DDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient as DDBDocClient, PutCommand as DDBPutCommand } from "@aws-sdk/lib-dynamodb";

const snsClient = new SNSClient({});
const dbClient = new DDBClient({});
const docClient = DDBDocClient.from(dbClient);
const ALERT_THREAT_LOG_TABLE = "aegis-threat-log";

export const handler = async (event) => {
  try {
    console.log("Received event for send_alert_lambda:", JSON.stringify(event, null, 2));
    
    const properties = event.requestBody.content['application/json'].properties;
    const transactionId = properties.find(p => p.name === 'transactionId')?.value;
    const phoneNumber = properties.find(p => p.name === 'phoneNumber')?.value;
    // The transactionDetails object is sent as a stringified value that needs to be parsed
    const transactionDetailsString = properties.find(p => p.name === 'transactionDetails')?.value || '{}';
    const transactionDetails = JSON.parse(transactionDetailsString);

    if (!transactionId || !phoneNumber || !transactionDetails.amount) {
      throw new Error("Input validation failed: 'transactionId', 'phoneNumber', and 'transactionDetails' are required.");
    }

    const deepLink = `aegisapp://verify?transactionId=${transactionId}`;
    const alertMessage = `Aegis Security Alert: A suspicious transaction of ${transactionDetails.amount} USD at ${transactionDetails.merchant} was detected. Please verify here: ${deepLink}`;
    
    const snsCommand = new PublishCommand({ Message: alertMessage, PhoneNumber: phoneNumber });
    await snsClient.send(snsCommand);

    const message = `ACTION: Alert sent to [${phoneNumber}] for transaction [${transactionId}]`;
    console.log(message);

    const logCommand = new DDBPutCommand({
        TableName: ALERT_THREAT_LOG_TABLE,
        Item: {
            transaction_id: transactionId,
            timestamp: Date.now(),
            action_message: message,
            source_lambda: "send_alert_lambda"
        }
    });
    await docClient.send(logCommand);

    const responseBody = { status: "success", messageId: `sms-sent-${Date.now()}` };
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(responseBody)
    };
  } catch (error) {
    console.error("ERROR in send_alert_lambda:", error.message);
    const errorBody = { status: "error", message: error.message };
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(errorBody)
    };
  }
};