import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

// These are now environment variables for easier configuration
const AGENT_ID = process.env.AGENT_ID;
const AGENT_ALIAS_ID = process.env.AGENT_ALIAS_ID;

export const handler = async (event) => {
  console.log("Original Event:", JSON.stringify(event, null, 2));
  
  // 1. FORMAT DATA
  const rawDetail = event.detail;
  const cleanDetail = {
    user_id: rawDetail.user_id.S,
    phone_number: rawDetail.phone_number.S,
    transaction_id: rawDetail.transaction_id.S,
    amount: Number(rawDetail.amount.N),
    merchant: rawDetail.merchant.S,
    location: rawDetail.location.S,
    is_fraudulent: rawDetail.is_fraudulent.BOOL,
    fraudScore: rawDetail.metadata.fraudScore,
  };
  
  // --- NEW: Add natural language context to the agent's input ---
  const inputText = `A high-risk transaction was detected. Here are the details: ${JSON.stringify(cleanDetail)}`;
  console.log("Input being sent to agent:", inputText);
  // --- End of New Code ---

  // 2. INVOKE AGENT
  const command = new InvokeAgentCommand({
    agentId: AGENT_ID,
    agentAliasId: AGENT_ALIAS_ID,
    sessionId: event.id, // Use the event ID for a unique session ID
    inputText: inputText, // Use the new input with context
  });

  try {
    const response = await client.send(command);
    let completion = "";
    for await (const chunk of response.completion) {
      if (chunk.chunk?.bytes) {
        completion += new TextDecoder().decode(chunk.chunk.bytes);
      }
    }
    
    console.log("Raw agent response:", completion);
    
    const jsonMatch = completion.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not find a valid JSON object in the agent's response.");
    }
    
    const plan = JSON.parse(jsonMatch[0]);
    console.log("Parsed plan:", JSON.stringify(plan, null, 2));

    // 3. RETURN THE PLAN
    return plan;

  } catch (error) {
    console.error("Error in orchestration lambda:", error);
    throw new Error(error.message);
  }
};
