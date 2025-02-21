import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import twilio from "twilio";

// Environment variables validation
const requiredEnvVars = ["ACCOUNT_SID", "AUTH_TOKEN", "FROM_NUMBER"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} environment variable is required`);
    process.exit(1);
  }
}

// Initialize Twilio client
const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

// Create MCP server
const server = new McpServer({
    name: "twilio-sms",
    version: "1.0.0",
});

server.prompt(
  "send-greeting",
  {
    to: z.string().describe("Recipient's phone number in E.164 format (e.g., +11234567890)"),
    occasion: z.string().describe("The occasion for the greeting (e.g., birthday, holiday)")
  },
  ({ to, occasion }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please write a warm, personalized greeting for ${occasion} and send it as a text message to ${to}. Make it engaging and friendly.`
      }
    }]
  })
);

server.prompt(
  "send-haiku",
  {
    theme: z.string().describe("The theme of the haiku"),
    to: z.string().describe("Recipient's phone number in E.164 format (e.g., +11234567890)")
  },
  ({ to, theme }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please write a warm, personalized greeting for ${theme} and send it as a text message to ${to}. Make it engaging and friendly.`
      }
    }]
  })
);


// Add send message tool
server.tool(
  "send-message",
  "Send an SMS message via Twilio",
  {
    to: z.string().describe("Recipient phone number in E.164 format (e.g., +11234567890)"),
    message: z.string().describe("Message content to send")
  },
  async ({ to, message }) => {
    try {
      // Validate phone number format
      if (!to.startsWith("+")) {
        return {
          content: [{
            type: "text",
            text: "Error: Phone number must be in E.164 format (e.g., +11234567890)"
          }],
          isError: true
        };
      }

      // Send message via Twilio
      const response = await client.messages.create({
        body: message,
        from: process.env.FROM_NUMBER,
        to: to
      });

      return {
        content: [{
          type: "text",
          text: `Message sent successfully! Message SID: ${response.sid}`
        }]
      };
    } catch (error) {
      console.error("Error sending message:", error);
      return {
        content: [{
          type: "text",
          text: `Error sending message: ${error instanceof Error ? error.message : "Unknown error"}`
        }],
        isError: true
      };
    }
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Twilio SMS MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});