import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import twilio from 'twilio';
import { z } from 'zod';

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

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Validation schemas
const sendMessageSchema = z.object({
  to: z.string().describe("Recipient phone number in E.164 format (e.g., +11234567890)"),
  message: z.string().describe("Message content to send")
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Twilio SMS API' });
});

// Send SMS endpoint
app.post('/send-sms', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = sendMessageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validation.error.errors
      });
    }

    const { to, message } = validation.data;

    // Validate phone number format
    if (!to.startsWith("+")) {
      return res.status(400).json({
        error: "Phone number must be in E.164 format (e.g., +11234567890)"
      });
    }

    // Send message via Twilio
    const response = await client.messages.create({
      body: message,
      from: process.env.FROM_NUMBER,
      to: to
    });

    res.json({
      success: true,
      message: "Message sent successfully",
      messageSid: response.sid,
      to: to,
      from: process.env.FROM_NUMBER
    });

  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      error: "Failed to send message",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Send greeting endpoint
app.post('/send-greeting', async (req: Request, res: Response) => {
  try {
    const { to, occasion, customMessage } = req.body;

    if (!to || !occasion) {
      return res.status(400).json({
        error: "Missing required fields: 'to' and 'occasion'"
      });
    }

    // Validate phone number format
    if (!to.startsWith("+")) {
      return res.status(400).json({
        error: "Phone number must be in E.164 format (e.g., +11234567890)"
      });
    }

    const message = customMessage || `Wishing you a wonderful ${occasion}! Hope your day is filled with joy and happiness.`;

    // Send message via Twilio
    const response = await client.messages.create({
      body: message,
      from: process.env.FROM_NUMBER,
      to: to
    });

    res.json({
      success: true,
      message: "Greeting sent successfully",
      messageSid: response.sid,
      occasion: occasion,
      to: to
    });

  } catch (error) {
    console.error("Error sending greeting:", error);
    res.status(500).json({
      error: "Failed to send greeting",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get API documentation
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Twilio SMS API',
    endpoints: {
      'GET /health': 'Health check',
      'POST /send-sms': 'Send SMS message (requires: to, message)',
      'POST /send-greeting': 'Send greeting message (requires: to, occasion, optional: customMessage)'
    },
    example: {
      sendSms: {
        url: '/send-sms',
        method: 'POST',
        body: {
          to: '+11234567890',
          message: 'Hello from the cloud!'
        }
      }
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Twilio SMS API server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
}); 