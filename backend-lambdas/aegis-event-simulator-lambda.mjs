import { KinesisClient, PutRecordCommand } from "@aws-sdk/client-kinesis";
// --- Configuration ---
const KINESIS_STREAM_NAME = "aegis-transactions-stream";
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
// --- AWS Client Initialization ---
const kinesisClient = new KinesisClient({ region: AWS_REGION });
/**
 * This Lambda function simulates benign or fraudulent transaction events and
 * publishes them to the Kinesis stream to trigger the Aegis workflow.
 */
export const handler = async (event) => {
  if (typeof event === "string") {
    console.log("It's a string!");
  }

  if (typeof event === "object" && event !== null && !Array.isArray(event)) {
    console.log("It's a plain JavaScript object (like a parsed JSON object)!");
    console.log(event);
  }

  let requestBody;
  if (event.body) {
    requestBody = JSON.parse(event.body);
  } else {
    requestBody = event;
  }

  // The 'eventType' from the test event determines which transaction to send.
  const eventType = requestBody.eventType || "benign"; // Default to benign if not specified
  let transactionData;
  if (eventType === "fraudulent") {
    console.log("Simulating a FRAUDULENT transaction...");
    transactionData = {
      // High amount, unusual merchant for this user
      user_id: { S: "user-1001" },
      transaction_id: { S: `sim-frd-${Date.now()}` },
      timestamp: { S: new Date().toISOString() },
      amount: { N: "3800.00" },
      merchant: { S: "Offshore Web Services" },
      location: { S: "Kyiv, UA" },
      is_fraudulent: { BOOL: true },
    };
  } else {
    console.log("Simulating a BENIGN transaction...");
    transactionData = {
      // Normal spending pattern for this user
      user_id: { S: "user-1002" },
      transaction_id: { S: `sim-bgn-${Date.now()}` },
      timestamp: { S: new Date().toISOString() },
      amount: { N: "75.50" },
      merchant: { S: "Local Grocery Store" },
      location: { S: "New York, NY" },
      is_fraudulent: { BOOL: false },
    };
  }
  // The scoring function expects the payload to mimic the DynamoDB Streams format.
  const payload = {
    dynamodb: { NewImage: transactionData },
    eventName: "INSERT",
  };
  // Prepare the record for Kinesis
  const command = new PutRecordCommand({
    StreamName: KINESIS_STREAM_NAME,
    Data: Buffer.from(JSON.stringify(payload)),
    PartitionKey: transactionData.user_id.S, // A partition key is required
  });
  try {
    const response = await kinesisClient.send(command);
    const successMessage = `Successfully published '${eventType}' event to Kinesis. SequenceNumber: ${response.SequenceNumber}`;
    console.log(successMessage);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: successMessage }),
    };
  } catch (error) {
    console.error("Error publishing to Kinesis:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to publish event to Kinesis.",
        error: error.message,
      }),
    };
  }
};
