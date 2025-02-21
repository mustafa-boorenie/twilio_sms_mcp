# Twilio MCP Server

A Model Context Protocol (MCP) server that enables Claude and other AI assistants to send SMS and MMS messages using Twilio.

## Features

- Send SMS messages 📱
- Pre-built prompts for common messaging scenarios 📝
- Secure handling of Twilio credentials 🔒

## Configuration

The server requires three environment variables:

- `ACCOUNT_SID`: Your Twilio account SID
- `AUTH_TOKEN`: Your Twilio auth token
- `FROM_NUMBER`: Your Twilio phone number (in E.164 format, e.g., +11234567890)

### Claude Desktop Configuration

To use this server with Claude Desktop, add the following to your configuration file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "twilio": {
      "command": "npx",
      "args": [
        "-y",
        "github:yiyangli@sms-mcp-server"
      ]
      "env": {
        "ACCOUNT_SID": "your_account_sid",
        "AUTH_TOKEN": "your_auth_token",
        "FROM_NUMBER": "your_twilio_number"
      }
    }
  }
}
```

## Example Interactions with Claude

Here are some natural ways to interact with the server through Claude:

1. Simple SMS:
```
Send a text message to +11234567890 saying "Don't forget about dinner tonight!"
```

2. Creative SMS:
```
Write a haiku about autumn and send it to +11234567890
```

## Important Notes

1. **Phone Number Format**: All phone numbers must be in E.164 format (e.g., +11234567890)
2. **Rate Limits**: Be aware of your Twilio account's rate limits and pricing
3. **Security**: Keep your Twilio credentials secure and never commit them to version control

## Troubleshooting

Common error messages and solutions:

1. "Phone number must be in E.164 format"
   - Make sure the phone number starts with "+" and the country code

2. "Invalid credentials"
   - Double-check your ACCOUNT_SID and AUTH_TOKEN, you may copy them from [Twilio Console[(console.twilio.com)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security

Please do not include any sensitive information (like phone numbers or Twilio credentials) in GitHub issues or pull requests.