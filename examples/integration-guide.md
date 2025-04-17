# Integrating Zoom Transcript MCP with AMP

This guide explains how to use the Zoom Transcript MCP server with AMP (Accelerated Mobile Pages) to display meeting insights.

## Prerequisites

1. A running instance of the Zoom Transcript MCP server
2. Zoom API credentials configured in the server's `.env` file
3. Basic understanding of AMP HTML

## Setup

### 1. Configure Zoom API Credentials

First, ensure your MCP server has the proper Zoom API credentials in the `.env` file:

```
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_ACCOUNT_ID=your_zoom_account_id
```

You can obtain these credentials from the [Zoom Developer Portal](https://marketplace.zoom.us/).

### 2. Start the MCP Server

Start the server using:

```bash
npm run dev
```

This will start the server on port 3000 (or the port specified in your `.env` file).

## Connecting AMP to the MCP Server

### AMP-Compatible Endpoints

The MCP server provides AMP-compatible endpoints that return data in the format expected by AMP components:

```
GET /amp/zoom/summary?meetingId=123456789&participant=John
```

This endpoint returns:

```json
{
  "version": "0.1",
  "content": {
    "meetingId": "123456789",
    "participants": ["John Doe", "Jane Smith"],
    "summary": "This is a summary of the meeting...",
    "filteredParticipant": "John",
    "totalEntries": 25,
    "filteredEntries": 10
  }
}
```

### Example: Using amp-list to Display Meeting Summary

Use `amp-list` to fetch and display meeting summary data:

```html
<amp-list width="auto"
          height="500"
          layout="fixed-height"
          src="http://your-mcp-server.com/amp/zoom/summary?meetingId=123456789">
  <template type="amp-mustache">
    <div>
      <h2>Meeting Summary</h2>
      <p>{{content.summary}}</p>
      
      <h3>Participants:</h3>
      <ul>
        {{#content.participants}}
          <li>{{.}}</li>
        {{/content.participants}}
      </ul>
    </div>
  </template>
</amp-list>
```

### Example: Using amp-form to Request Meeting Data

Use `amp-form` to allow users to request specific meeting data:

```html
<form method="GET"
      action-xhr="http://your-mcp-server.com/amp/zoom/summary"
      target="_top">
  <input type="text" name="meetingId" placeholder="Meeting ID" required>
  <input type="text" name="participant" placeholder="Participant Filter (optional)">
  <input type="submit" value="Get Summary">
</form>
```

## CORS Configuration

The MCP server is already configured to allow cross-origin requests from AMP pages with the following headers:

```
Access-Control-Allow-Origin: *
Content-Type: application/json
```

## Full Example

See the `amp-client.html` file in the examples directory for a complete working example of an AMP page that interacts with the MCP server.

## Troubleshooting

1. **CORS Issues**: If you're seeing CORS errors, ensure your server is correctly setting the `Access-Control-Allow-Origin` header.

2. **Data Not Displaying**: Check that your AMP template is correctly referencing the data structure returned by the MCP server.

3. **Server Errors**: Look at the server logs to identify any issues with the Zoom API integration.

## Next Steps

- Add support for additional AMP-compatible endpoints (action items, decisions)
- Implement caching for improved performance
- Add authentication to protect sensitive meeting data