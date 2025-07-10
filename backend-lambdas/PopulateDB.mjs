// index.mjs

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

// --- Configuration ---//
const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "aegis-users";
const TRANSACTIONS_TABLE_NAME = process.env.TRANSACTIONS_TABLE_NAME || "aegis-transactions";
const AWS_REGION = process.env.AWS_REGION || "us-east-1";

// --- AWS Client Initialization ---//
const dynamoDbClient = new DynamoDBClient({ region: AWS_REGION });

// --- Helper functions to replace 'date-fns' --- //
// These functions create a new date object for each calculation to avoid errors.
const subDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
};
const subHours = (date, hours) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() - hours);
  return newDate;
};
const subMinutes = (date, minutes) => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() - minutes);
  return newDate;
};
const subSeconds = (date, seconds) => {
  const newDate = new Date(date);
  newDate.setSeconds(newDate.getSeconds() - seconds);
  return newDate;
};


// --- Mock Data ---//
const now = new Date();

const mockUsers = [
    {
        user_id: { S: "user-1001" },
        full_name: { S: "Alice Johnson" },
        email: { S: "alice.j@example.com" },
        phone_number: { S: "+15551234567" },
        account_status: { S: "ACTIVE" },
        created_at: { S: subDays(now, 90).toISOString() }
    },
    {
        user_id: { S: "user-1002" },
        full_name: { S: "Bob Williams" },
        email: { S: "bob.w@example.com" },
        phone_number: { S: "+15559876543" },
        account_status: { S: "ACTIVE" },
        created_at: { S: subDays(now, 180).toISOString() }
    },
    {
        user_id: { S: "user-1003" },
        full_name: { S: "Carol White" },
        email: { S: "carol.w@example.com" },
        phone_number: { S: "+15552468135" },
        account_status: { S: "ACTIVE" },
        created_at: { S: subDays(now, 30).toISOString() }
    },
    {
        user_id: { S: "user-1004" },
        full_name: { S: "David Green" },
        email: { S: "dave.g@example.com" },
        phone_number: { S: "+15553692580" },
        account_status: { S: "SUSPENDED" },
        created_at: { S: subDays(now, 365).toISOString() }
    },
    {
        user_id: { S: "user-1005" },
        full_name: { S: "Eve Black" },
        email: { S: "eve.b@example.com" },
        phone_number: { S: "+15557771234" },
        account_status: { S: "ACTIVE" },
        created_at: { S: subDays(now, 2).toISOString() }
    }
];

const mockTransactions = [
    // Alice's transactions (Benign)
    {
        user_id: { S: "user-1001" },
        transaction_id: { S: "txn-abc-123" },
        timestamp: { S: subMinutes(now, 60).toISOString() },
        amount: { N: "112.50" },
        merchant: { S: "Online Books Inc." },
        location: { S: "Austin, TX" },
        is_fraudulent: { BOOL: false }
    },
    {
        user_id: { S: "user-1001" },
        transaction_id: { S: "txn-def-456" },
        timestamp: { S: subMinutes(now, 15).toISOString() },
        amount: { N: "34.99" },
        merchant: { S: "Corner Cafe" },
        location: { S: "Austin, TX" },
        is_fraudulent: { BOOL: false }
    },
    // Bob's transactions (Benign)
    {
        user_id: { S: "user-1002" },
        transaction_id: { S: "txn-ghi-789" },
        timestamp: { S: subHours(now, 3).toISOString() },
        amount: { N: "850.00" },
        merchant: { S: "Gadget Store" },
        location: { S: "New York, NY" },
        is_fraudulent: { BOOL: false }
    },
    {
        user_id: { S: "user-1002" },
        transaction_id: { S: "txn-jkl-101" },
        timestamp: { S: subDays(now, 1).toISOString() },
        amount: { N: "45.00" },
        merchant: { S: "SuperMart" },
        location: { S: "New York, NY" },
        is_fraudulent: { BOOL: false }
    },
    // Carol's transaction (Benign)
    {
        user_id: { S: "user-1003" },
        transaction_id: { S: "txn-mno-202" },
        timestamp: { S: subHours(now, 5).toISOString() },
        amount: { N: "78.20" },
        merchant: { S: "Gas Station" },
        location: { S: "Houston, TX" },
        is_fraudulent: { BOOL: false }
    },
    // Fraudulent Transactions
    {
        user_id: { S: "user-1005" }, // New user, suspicious activity
        transaction_id: { S: "txn-frd-001" },
        timestamp: { S: subMinutes(now, 5).toISOString() },
        amount: { N: "1999.99" },
        merchant: { S: "Shady Electronics" },
        location: { S: "St. Petersburg, RU" },
        is_fraudulent: { BOOL: true }
    },
    {
        user_id: { S: "user-1001" }, // Alice's account, but anomalous
        transaction_id: { S: "txn-frd-002" },
        timestamp: { S: subSeconds(now, 30).toISOString() },
        amount: { N: "1250.00" },
        merchant: { S: "Anonymous VPN Service" },
        location: { S: "Lagos, NG" },
        is_fraudulent: { BOOL: true }
    }
];


/**
 * The main handler for the Lambda function.
 * This function iterates through mock data and populates DynamoDB tables.
 * @param {object} event - The event object from the Lambda trigger.
 * @returns {Promise<object>} The HTTP response object.
 */
export const handler = async (event) => {
    console.log("Starting database population process...");
    const logs = [];

    try {
        // --- Populate aegis-users ---
        console.log(`Populating ${USERS_TABLE_NAME}...`);
        for (const user of mockUsers) {
            const command = new PutItemCommand({
                TableName: USERS_TABLE_NAME,
                Item: user,
            });
            await dynamoDbClient.send(command);
            const message = `Successfully inserted user ${user.user_id.S}`;
            console.log(`  ${message}`);
            logs.push(message);
        }

        // --- Populate aegis-transactions ---
        console.log(`\nPopulating ${TRANSACTIONS_TABLE_NAME}...`);
        for (const trx of mockTransactions) {
            const command = new PutItemCommand({
                TableName: TRANSACTIONS_TABLE_NAME,
                Item: trx,
            });
            await dynamoDbClient.send(command);
            const message = `Successfully inserted transaction ${trx.transaction_id.S} for user ${trx.user_id.S}`;
            console.log(`  ${message}`);
            logs.push(message);
        }
        
        console.log("\nData population script finished successfully.");
        // Return a success response
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Database populated successfully!",
                logs: logs
            }),
        };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        console.error("Error populating database:", errorMessage);
        
        // Return an error response
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Failed to populate database.",
                error: errorMessage,
                logs: logs // Include logs of what succeeded before the failure
            }),
        };
    }
};
