# Testing with Mock Transcript Data

While you're setting up the Zoom API integration, you can use the included mock data provider to test your MCP server functionality.

## Using Mock Data

The MCP server automatically uses mock data when the Zoom API integration isn't available. Here's how to use it:

1. **Start the server**

   ```bash
   cd zoomcp
   npm install
   npm start
   ```

2. **Create a public URL with ngrok**

   ```bash
   ./start-with-ngrok.sh
   ```
   
   Or, in a separate terminal:
   
   ```bash
   ngrok http 3000
   ```

3. **Make API requests to test endpoints**

   Use any meeting ID (like "123456789") to get mock transcript data:

   ```
   GET https://your-ngrok-url.ngrok.io/api/zoom/transcript/123456789
   GET https://your-ngrok-url.ngrok.io/api/zoom/summary/123456789
   GET https://your-ngrok-url.ngrok.io/api/zoom/action-items/123456789
   GET https://your-ngrok-url.ngrok.io/api/zoom/decisions/123456789
   ```

4. **For AMP integration**

   Update your AMP configuration with the ngrok URL:
   
   | Field | Value |
   |-------|-------|
   | Server Name | `zoom-transcript-mcp` |
   | Command or URL | `https://your-ngrok-url.ngrok.io` |
   | Arguments | *Leave empty* |

   Then use these endpoints:
   
   ```
   /zoom-transcript-mcp/amp/zoom/summary?meetingId=123456789
   /zoom-transcript-mcp/amp/zoom/action-items?meetingId=123456789
   /zoom-transcript-mcp/amp/zoom/decisions?meetingId=123456789
   /zoom-transcript-mcp/amp/events
   ```

## Mock Data Features

- The mock data generator creates realistic meeting transcripts with random participants
- Different meeting IDs will generate different transcripts
- The same meeting ID will always return the same transcript (cached in memory)
- The generated data includes action items and decisions that can be extracted

## Switching to Real Zoom API

When you're ready to integrate with the real Zoom API:

1. Get your Zoom API credentials from the [Zoom Developer Portal](https://marketplace.zoom.us/)

2. Update your `.env` file with the credentials:

   ```
   ZOOM_CLIENT_ID=your_zoom_client_id
   ZOOM_CLIENT_SECRET=your_zoom_client_secret
   ZOOM_ACCOUNT_ID=your_zoom_account_id
   ```

3. Edit `src/services/zoom.js` to use the real API implementation:
   - Remove the mock data import
   - Uncomment the real implementation in the `fetchTranscript` function

4. Install the Zoom API SDK when it becomes available:

   ```bash
   npm install @zoom/api
   ```

5. Test with an actual Zoom meeting that has a transcript