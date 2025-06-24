# Twilio SMS Server

A versatile SMS service that can run as both a Model Context Protocol (MCP) server for Claude Desktop and as a standalone REST API for cloud deployment.

## 🚀 Two Deployment Modes

### 1. MCP Server Mode (Local with Claude Desktop)
Enables Claude and other AI assistants to send SMS messages through the Model Context Protocol.

### 2. Web API Mode (Cloud Deployment)
Standalone REST API that can be deployed to any cloud platform for web applications.

## ✨ Features

- 📱 Send SMS messages via Twilio
- 🌐 REST API endpoints for web integration
- 🔨 MCP server for Claude Desktop integration
- 📝 Pre-built prompts for common messaging scenarios
- 🔒 Secure handling of Twilio credentials
- 🐳 Docker support for easy deployment
- ☁️ Cloud deployment ready

## 📋 Requirements

- Node.js >= 18
- Twilio account with SMS capabilities
- Environment variables for Twilio credentials

## ⚙️ Environment Setup

Create a `.env` file in the project root:

```env
# Twilio Configuration (Required)
ACCOUNT_SID=your_twilio_account_sid_here
AUTH_TOKEN=your_twilio_auth_token_here
FROM_NUMBER=+1234567890

# Server Configuration (Optional, defaults to 3000)
PORT=3000
```

## 🚀 Installation & Usage

### Local Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run as MCP server (for Claude Desktop)
npm run start:mcp

# Run as Web API server
npm run start:web

# Development mode (rebuilds and starts web server)
npm run dev:web
```

## 🌐 Web API Endpoints

When running in Web API mode, the following endpoints are available:

### `GET /`
API documentation and usage examples

### `GET /health`
Health check endpoint

### `POST /send-sms`
Send an SMS message

**Request Body:**
```json
{
  "to": "+11234567890",
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "messageSid": "SM...",
  "to": "+11234567890",
  "from": "+1234567890"
}
```

### `POST /send-greeting`
Send a greeting message for special occasions

**Request Body:**
```json
{
  "to": "+11234567890",
  "occasion": "birthday",
  "customMessage": "Optional custom message"
}
```

## 🖥️ Claude Desktop Configuration (MCP Mode)

To use this server with Claude Desktop, add the following to your configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "twilio": {
      "command": "npx",
      "args": [
        "-y",
        "@yiyang.1i/sms-mcp-server"
      ],
      "env": {
        "ACCOUNT_SID": "your_account_sid",
        "AUTH_TOKEN": "your_auth_token",
        "FROM_NUMBER": "your_twilio_number"
      }
    }
  }
}
```

After updating the configuration, restart Claude Desktop. If connected successfully, you should see Twilio under the 🔨 menu.

## ☁️ Cloud Deployment

### Option 1: Railway
1. Connect your GitHub repository to [Railway](https://railway.app)
2. Set environment variables in Railway dashboard
3. Deploy automatically

### Option 2: Render
1. Connect your repo to [Render](https://render.com)
2. Create a new Web Service
3. Build command: `npm install && npm run build`
4. Start command: `npm run start:web`
5. Add environment variables

### Option 3: Heroku
```bash
heroku create your-app-name
heroku config:set ACCOUNT_SID=your_sid
heroku config:set AUTH_TOKEN=your_token  
heroku config:set FROM_NUMBER=your_number
git push heroku main
```

### Option 4: Docker
```bash
# Build Docker image
docker build -t twilio-sms-server .

# Run container
docker run -p 3000:3000 \
  -e ACCOUNT_SID=your_sid \
  -e AUTH_TOKEN=your_token \
  -e FROM_NUMBER=your_number \
  twilio-sms-server
```

## 🧪 Testing the API

### Local Testing
```bash
# Start the server
npm run start:web

# Test health endpoint
curl http://localhost:3000/health

# Send a test SMS
curl -X POST http://localhost:3000/send-sms \
  -H "Content-Type: application/json" \
  -d '{"to": "+1234567890", "message": "Hello from the API!"}'

# Send a greeting
curl -X POST http://localhost:3000/send-greeting \
  -H "Content-Type: application/json" \
  -d '{"to": "+1234567890", "occasion": "birthday"}'
```

## 💬 Example Interactions with Claude (MCP Mode)

Here are some natural ways to interact with the server through Claude:

1. **Simple SMS:**
```
Send a text message to +11234567890 saying "Don't forget about dinner tonight!"
```

2. **Creative SMS:**
```
Write a haiku about autumn and send it to my number +11234567890
```

3. **Greeting Messages:**
```
Send a birthday greeting to +11234567890
```

## 📝 Scripts Reference

- `npm run build` - Build TypeScript to JavaScript
- `npm run start:mcp` - Start MCP server mode
- `npm run start:web` - Start web API server mode
- `npm run dev:web` - Development mode (rebuild + start web server)
- `npm run watch` - Watch TypeScript files for changes

## ⚠️ Important Notes

1. **Phone Number Format**: All phone numbers must be in E.164 format (e.g., +11234567890)
2. **Twilio Trial Accounts**: Can only send messages to verified phone numbers
3. **Rate Limits**: Be aware of your Twilio account's rate limits and pricing
4. **Security**: Keep your Twilio credentials secure and never commit them to version control
5. **Environment Variables**: Use `.env` file for local development, set via platform for cloud deployment

## 🐛 Troubleshooting

### Common Errors and Solutions:

1. **"Phone number must be in E.164 format"**
   - Ensure phone number starts with "+" and includes country code

2. **"Invalid credentials" / "accountSid must start with AC"**
   - Verify your ACCOUNT_SID and AUTH_TOKEN from [Twilio Console](https://console.twilio.com)
   - Ensure environment variables are properly loaded

3. **"Invalid 'To' Phone Number"**
   - For trial accounts: Verify the destination number in Twilio Console
   - For paid accounts: Ensure the number format is correct

4. **"Environment variable is required"**
   - Check that `.env` file exists and contains all required variables
   - For cloud deployment, ensure environment variables are set in platform settings

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔐 Security

Please do not include any sensitive information (like phone numbers or Twilio credentials) in GitHub issues or pull requests.