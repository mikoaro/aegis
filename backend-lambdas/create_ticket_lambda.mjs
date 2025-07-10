// -----------------------------------------------------------------
// File: create_ticket_lambda/index.mjs (FINAL)
// -----------------------------------------------------------------
import { DynamoDBClient as DDBClient_Ticket } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient as DDBDocClient_Ticket, PutCommand as DDBPutCommand_Ticket } from "@aws-sdk/lib-dynamodb";

const ticketClient = new DDBClient_Ticket({});
const ticketDocClient = DDBDocClient_Ticket.from(ticketClient);
const TICKET_THREAT_LOG_TABLE = "aegis-threat-log";

export const handler = async (event) => {
  try {
    console.log("Received event for create_ticket_lambda:", JSON.stringify(event, null, 2));

    const properties = event.requestBody.content['application/json'].properties;
    const transactionId = properties.find(p => p.name === 'transactionId')?.value;
    const ticketTitle = properties.find(p => p.name === 'ticketTitle')?.value;
    const ticketDescription = properties.find(p => p.name === 'ticketDescription')?.value;

    if (!transactionId || !ticketTitle) {
      throw new Error("Input validation failed: 'transactionId' and 'ticketTitle' are required.");
    }
        
    const message = `ACTION: Ticket created with title '[${ticketTitle}]' for transaction [${transactionId}]`;
    console.log(message);

    const logCommand = new DDBPutCommand_Ticket({
        TableName: TICKET_THREAT_LOG_TABLE,
        Item: {
            transaction_id: transactionId,
            timestamp: Date.now(),
            action_message: message,
            action_details: ticketDescription,
            source_lambda: "create_ticket_lambda"
        }
    });
    await ticketDocClient.send(logCommand);

    const responseBody = { status: "success", ticketId: `AEGIS-MOCK-${Date.now()}` };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(responseBody)
    };
  } catch (error) {
    console.error("ERROR in create_ticket_lambda:", error.message);
    const errorBody = { status: "error", message: error.message };
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(errorBody)
    };
  }
};
