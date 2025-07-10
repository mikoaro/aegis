import { DynamoDBClient, QueryCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "aegis-users";
const TRANSACTIONS_TABLE_NAME = process.env.TRANSACTIONS_TABLE_NAME || "aegis-transactions";
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const BEDROCK_MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";
const EVENT_BUS_NAME = "aegis-events";
const FRAUD_SCORE_THRESHOLD = 0.75; // Lowered threshold from 0.9

const dynamoDbClient = new DynamoDBClient({ region: AWS_REGION });
const bedrockClient = new BedrockRuntimeClient({ region: AWS_REGION });
const eventBridgeClient = new EventBridgeClient({ region: AWS_REGION });

export const handler = async (event) => {
  console.log(`Scoring function invoked with ${event.Records.length} records.`);
  
  for (const record of event.Records) {
    try {
      const payloadString = Buffer.from(record.kinesis.data, 'base64').toString('utf-8');
      const dynamoDbEvent = JSON.parse(payloadString);
      
      if (dynamoDbEvent.eventName !== 'INSERT') {
        console.log("Skipping event because it's not an INSERT.");
        continue;
      }
      
      const currentTransaction = dynamoDbEvent.dynamodb.NewImage;
      const userId = currentTransaction?.user_id?.S;
      
      if (!userId) {
        console.log("Skipping event due to missing userId.");
        continue;
      }
      console.log(`Processing transaction for user: ${userId}`);

      const queryCommand = new QueryCommand({
        TableName: TRANSACTIONS_TABLE_NAME,
        KeyConditionExpression: "user_id = :userId",
        ExpressionAttributeValues: { ":userId": { "S": userId } },
      });
      const { Items: historicalTransactions } = await dynamoDbClient.send(queryCommand);

      const prompt = `Analyze the following JSON object representing a financial transaction. The object includes the 'current_transaction' and a 'transaction_history' array for the user. Based on this data, evaluate the likelihood of fraud. Consider factors like transaction amount compared to historical average, time of day, merchant category, and geographical distance from previous transactions. Return a single JSON object with one key, "fraud_score", with a value from 0.0 (not fraudulent) to 1.0 (highly fraudulent). Do not provide any explanation, only the JSON object.
Transaction Data:${JSON.stringify({
        current_transaction: currentTransaction,
        transaction_history: historicalTransactions,
      })}`;

      const bedrockPayload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1024,
        messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
      };

      const invokeCommand = new InvokeModelCommand({
        modelId: BEDROCK_MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(bedrockPayload),
      });
      
      const apiResponse = await bedrockClient.send(invokeCommand);
      const responseBody = JSON.parse(new TextDecoder().decode(apiResponse.body));
      const rawCompletion = responseBody.content[0].text;
      
      // --- Robust JSON Extraction ---
      console.log("Raw response from Bedrock:", rawCompletion);
      const jsonMatch = rawCompletion.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
          throw new Error("Could not find a valid JSON object in the Bedrock response.");
      }
      const jsonString = jsonMatch[0];
      const fraudScore = JSON.parse(jsonString).fraud_score;
      
      console.log(`DEBUG: Bedrock returned a fraud score of [${fraudScore}]`);
      console.log(`DEBUG: Comparing score to threshold of [${FRAUD_SCORE_THRESHOLD}]`);

      if (fraudScore > FRAUD_SCORE_THRESHOLD) {
        console.log("INFO: Fraud score exceeds threshold. Proceeding to publish event.");
        
        const getUserCommand = new GetItemCommand({
          TableName: USERS_TABLE_NAME,
          Key: { user_id: { S: userId } }
        });
        const { Item: userDetails } = await dynamoDbClient.send(getUserCommand);

        const eventDetail = {
          ...currentTransaction,
          phone_number: userDetails?.phone_number,
          metadata: {
            fraudScore: fraudScore,
            timestamp: new Date().toISOString()
          }
        };

        const putEventsCommand = new PutEventsCommand({
          Entries: [{
            EventBusName: EVENT_BUS_NAME,
            Source: "aegis.fraud_detection",
            DetailType: "HighRiskTransactionDetected",
            Detail: JSON.stringify(eventDetail)
          }]
        });

        await eventBridgeClient.send(putEventsCommand);
        console.log(`✅ Published HighRiskTransactionDetected event for user ${userId}.`);
      } else {
        console.log("INFO: Fraud score does not exceed threshold. No event published.");
      }
    } catch (error) {
      console.error("🚨 Error in Transaction-Scoring-Function:", error);
    }
  }
};
