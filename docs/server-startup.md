# Starting the Zoom Transcript MCP Server

## Basic Server Start

```bash
cd zoomcp
npm install
npm start
```

The server will start on port 3001 by default (configurable in .env).

## For AMP Integration

AMP requires a publicly accessible URL. There are two options for this:

### 1. Use ngrok (for development/testing)

If you have ngrok installed:

```bash
# Start the server
npm start

# In a separate terminal, start ngrok
ngrok http 3001
```

Or use the provided script:

```bash
./start-with-ngrok.sh
```

ngrok will provide a URL like `https://abc123.ngrok.io` that you can use in your AMP configuration.

#### Installing ngrok

If you don't have ngrok installed, you can install it from [https://ngrok.com/download](https://ngrok.com/download) or:

```bash
# Using npm
npm install -g ngrok

# Using brew on macOS
brew install ngrok
```

### 2. Deploy to a Cloud Provider (for production)

For a permanent solution, deploy your server to a cloud provider:

1. **Push your code to a repository**

2. **Set up a server** on AWS, Google Cloud, Heroku, etc.

3. **Deploy and start your server**
   ```bash
   git clone https://github.com/harrisoncharlesworth/zoomcp.git
   cd zoomcp
   npm install
   npm start
   ```

## Current Status

Your MCP server is currently running on port 3001.

- To test the API directly: `http://localhost:3001/api/zoom/summary/123456789`
- Health check: `http://localhost:3001/health`

## For AMP Integration

Once you have a public URL (through ngrok or deployment), update your AMP configuration:

| Field | Value |
|-------|-------|
| Server Name | `zoom-transcript-mcp` |
| Command or URL | `https://your-public-url.com` |
| Arguments | *Leave empty* |

You can then access the AMP endpoints:

```
/zoom-transcript-mcp/amp/zoom/summary?meetingId=123456789
/zoom-transcript-mcp/amp/zoom/action-items?meetingId=123456789
/zoom-transcript-mcp/amp/zoom/decisions?meetingId=123456789
/zoom-transcript-mcp/amp/events
```