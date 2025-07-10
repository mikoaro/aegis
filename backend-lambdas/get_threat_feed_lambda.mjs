// -----------------------------------------------------------------
// File: get_threat_feed_lambda/index.mjs (Endpoint A)
// -----------------------------------------------------------------
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const THREAT_LOG_TABLE = "aegis-threat-log";
export const handler = async (event) => {
    try {
        const command = new ScanCommand({ TableName: THREAT_LOG_TABLE, Limit: 100 });
        const { Items } = await docClient.send(command);
        if (!Items || Items.length === 0) {
            return { statusCode: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify([]) };
        }
        const threats = {};
        for (const item of Items) {
            const { transaction_id, timestamp, action_message } = item;
            if (!threats[transaction_id]) {
                threats[transaction_id] = { id: transaction_id, timestamp: timestamp, actions: [] };
            }
            threats[transaction_id].actions.push({ timestamp, message: action_message });
        }
        Object.values(threats).forEach(threat => threat.actions.sort((a, b) => a.timestamp - b.timestamp));
        const sortedThreats = Object.values(threats).sort((a, b) => b.timestamp - a.timestamp);
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(sortedThreats),
        };
    } catch (error) {
        console.error("Error scanning DynamoDB table:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Failed to retrieve threat feed." }) };
    }
};