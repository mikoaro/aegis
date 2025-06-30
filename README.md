# 🛡️ Aegis: A Blueprint for Real-Time, Agentic Fraud Remediation on AWS

### Aegis is an AI-powered security agent that not just detects fraudulent transactions in real-time—it orchestrates an automated response to block them, notify customers, and initiate investigation workflows, all within milliseconds.

---

## \#\# About The Project

The financial services industry faces a relentless and escalating threat from payment fraud, with potential losses projected to reach billions annually. Traditional fraud detection systems, often relying on slow batch processing and rigid rule engines, are increasingly outmatched. They introduce critical delays, struggle to adapt to new fraud methods, and rely on costly, manual remediation processes that create a poor customer experience.

**Aegis** represents a paradigm shift from passive flagging to **active, agentic remediation**. Instead of just creating an alert for a human analyst, Aegis employs an AI agent as an autonomous decision-maker. This agent reasons about a detected threat and orchestrates a complex, multi-step response workflow in real-time, without human intervention.

This project is a blueprint for building a modern, event-driven, and intelligent security system on AWS, designed to mitigate financial risk and transform security into a transparent, interactive, and trust-building experience.

### \#\#\# Core Features:

- **Real-Time Detection:** Ingests and analyzes transaction streams with millisecond latency using Amazon Kinesis and AWS Lambda.
- **AI-Powered Scoring:** Leverages Amazon Bedrock (e.g., Claude 3 Haiku) to score transactions for fraud probability based on historical context.
- **Agentic Remediation:** Uses a Bedrock Agent as a "cognitive core" to autonomously orchestrate a response (e.g., lock account, send alert, create ticket).
- **Decoupled & Scalable Architecture:** Built on a serverless, event-driven framework using Amazon EventBridge and AWS Step Functions for resilience and scalability.
- **Innovative User Experience:** Includes a real-time Fraud Operations Command Center and a customer-facing mobile app for interactive security alerts.

---

## \#\# 🚀 Technology Stack

Aegis is built on a modern, serverless technology stack, leveraging the power of AWS and cutting-edge frontend frameworks.

### \#\#\# Backend & Cloud Infrastructure:

- **Compute:** AWS Lambda
- **AI & Agents:** Amazon Bedrock
- **Streaming Data:** Amazon Kinesis Data Streams
- **Workflow Orchestration:** AWS Step Functions
- **Event Routing:** Amazon EventBridge
- **Database:** Amazon DynamoDB
- **API:** Amazon API Gateway
- **Notifications:** Amazon SNS
- **Logging & Monitoring:** Amazon CloudWatch

### \#\#\# Frontend - Fraud Operations Command Center:

- **Framework:** Next.js 15
- **UI Library:** React 19

### \#\#\# Frontend - Customer Security Companion:

- **Framework:** React Native with Expo
- **Styling:** NativeWind
- **Build & Deployment:** Expo Application Services (EAS)

---

##  🏛️ Architecture

Aegis uses a highly decoupled, event-driven architecture that ensures scalability, resilience, and maintainability.

1.  **Ingestion & Scoring:** Financial transactions are published to an **Amazon Kinesis Data Stream**. An **AWS Lambda** function consumes these events, enriches them with user history from **Amazon DynamoDB**, and invokes an **Amazon Bedrock** model to get a fraud score.
2.  **Threat Declaration:** If the score exceeds a threshold, the Lambda function publishes a `HighRiskTransactionDetected` event to a custom **Amazon EventBridge** event bus. This decouples detection from response.
3.  **Orchestration & Remediation:** An EventBridge rule triggers an **AWS Step Functions** state machine. This workflow manages the remediation process, providing resilience, auditability, and state management.
4.  **Cognitive Core:** The first step in the state machine invokes a **Bedrock Agent**. This agent, guided by a natural language prompt, reasons about the threat and uses its "tools" (other Lambda functions) to perform actions.
5.  **Agentic Actions:** The agent calls discrete Lambda functions via an OpenAPI schema to lock the user's account, send an alert, and create an investigation ticket.
6.  **User Interfaces:** A **Next.js Command Center** provides a real-time view for analysts, while a **React Native mobile app** delivers interactive notifications to customers.

---

##  ✨ Key Features

Aegis is not just a backend process; it's a complete security platform with purpose-built interfaces for analysts and customers.

###  Fraud Operations Command Center

A web application providing analysts with real-time visibility and control.

- **Live Threat Feed:** A panel pushes `HighRiskTransactionDetected` events directly to the UI using WebSocket APIs, providing a live feed of threats.
- **Agent Action Log:** For each threat, the UI displays a clear, timestamped timeline of the automated actions taken by the Bedrock Agent.
- **Analyst Override with Optimistic UI:** Analysts can override a lock with a single click. The UI leverages React 19's `useOptimistic` hook to provide instant visual feedback.

###  Customer Security Companion

A mobile app that turns security into an interactive partnership.

- **Interactive Push Notifications:** Customers receive rich push notifications with "Confirm Transaction" and "Deny Transaction" buttons.
- **Seamless Resolution Loop:** Tapping the notification opens an in-app screen to verify the transaction, allowing the security loop to be closed in seconds.

---

##  🛠️ Getting Started 

This section demonstrates the core end-to-end workflow.

### Prerequisites:

- AWS Account & AWS CLI configured
- Node.js and Python installed
- An AWS region with Amazon Bedrock model access

### \#\#\# 1. Backend Deployment:

- **Event Simulation:** Use the provided Python script to publish sample transaction events to the Kinesis stream.
- **Core Logic:** Deploy the core Lambda functions. For the POC, the "tool" Lambdas can simply have mock logic that writes to CloudWatch.
- **Workflow & Agent:** Configure the Step Functions state machine and the Bedrock Agent with its instructions and OpenAPI schema.

### \#\#\# 2. Frontend Setup:

- **Command Center:**
  ```bash
  cd frontend/command-center
  npm install
  npm run dev
  ```
- The minimal dashboard will poll a dedicated Lambda to read CloudWatch logs, simulating a real-time feed of the agent's actions.

\<br\>

\<details\>
\<summary\>\<b\>📄 Click to view Sample Bedrock Prompts and OpenAPI Schema\</b\>\</summary\>

### \#\#\# Artifact A: Sample Amazon Bedrock Prompts

**For the Transaction-Scoring-Function:**

```
Analyze the following JSON object representing a financial transaction. The object includes the 'current_transaction' and a 'transaction_history' array for the user. Based on this data, evaluate the likelihood of fraud. Return a single JSON object with one key, "fraud_score", with a value from 0.0 (not fraudulent) to 1.0 (highly fraudulent). Do not provide any explanation, only the JSON object.
```

**For the Bedrock Agent (Internal Instructions/System Prompt):**

```
You are Aegis, an autonomous fraud remediation agent. Your sole purpose is to act upon receiving a 'HighRiskTransactionDetected' event. You must follow this protocol precisely and in order.
1. Invoke the lock_user_account tool using the user_id from the event detail.
2. If the account lock is successful, invoke the send_alert tool using the phone_number and transaction_details from the event.
3. Regardless of the alert status, invoke the create_ticket tool, passing the entire event detail as the ticket description.

Your final response should be a JSON object summarizing the outcome of each action.
```

### \#\#\# Artifact B: OpenAPI Schema for Bedrock Agent Action Group

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Aegis Fraud Remediation API",
    "version": "1.0.0"
  },
  "paths": {
    "/lockAccount": {
      "post": {
        "summary": "Lock a user's account",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": { "userId": { "type": "string" } },
                "required": ["userId"]
              }
            }
          }
        }
      }
    },
    "/sendAlert": {
      "post": {
        "summary": "Send an SMS alert to the customer"
      }
    },
    "/createTicket": {
      "post": {
        "summary": "Create an investigation ticket"
      }
    }
  }
}
```


