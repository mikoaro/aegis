// -----------------------------------------------------------------
// File: unlock_account_lambda/index.mjs (Endpoint B)
// -----------------------------------------------------------------
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
const dynamoClient = new DynamoDBClient({});
const USERS_TABLE_NAME = "aegis-users";
export const handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { userId } = requestBody;
    if (!userId) throw new Error("Missing 'userId' in request body.");
    const command = new UpdateItemCommand({
      TableName: USERS_TABLE_NAME,
      Key: { user_id: { S: userId } },
      UpdateExpression: "SET account_status = :status",
      ExpressionAttributeValues: { ":status": { S: "ACTIVE" } },
      ReturnValues: "ALL_NEW",
    });
    await dynamoClient.send(command);
    console.log(
      `OVERRIDE: Account for user [${userId}] successfully set to ACTIVE.`
    );
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        status: "success",
        message: `User ${userId} has been unlocked.`,
      }),
    };
  } catch (error) {
    console.error("Error in unlock_account_lambda:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ status: "error", message: error.message }),
    };
  }
};
