# AMP Integration Configuration

When setting up your Zoom Transcript MCP Server as an AMP integration, use the following configuration:

## Basic Configuration

| Field | Value |
|-------|-------|
| Server Name | `zoom-transcript-mcp` |
| Command or URL | `http://localhost:3000` |
| Arguments | *Leave empty* |

## Environment Variables

| Variable Name | Value |
|--------------|-------|
| ZOOM_CLIENT_ID | *Your Zoom Client ID* |
| ZOOM_CLIENT_SECRET | *Your Zoom Client Secret* |
| ZOOM_ACCOUNT_ID | *Your Zoom Account ID* |
| PORT | `3000` |

## Alternative: Running with npx

If you prefer to have AMP start the server automatically:

| Field | Value |
|-------|-------|
| Server Name | `zoom-transcript-mcp` |
| Command or URL | `npx` |
| Arguments | `--package=zoomcp start` |

## Testing Your Configuration

After setting up your configuration, test it by:

1. Starting the server (if using URL mode)
2. In your AMP project, use the following endpoint:

```
/zoom-transcript-mcp/amp/zoom/summary?meetingId=YOUR_MEETING_ID
/zoom-transcript-mcp/amp/zoom/action-items?meetingId=YOUR_MEETING_ID
/zoom-transcript-mcp/amp/zoom/decisions?meetingId=YOUR_MEETING_ID
/zoom-transcript-mcp/amp/events
```

## Sample AMP Component Usage

```html
<amp-list width="auto"
          height="500"
          layout="fixed-height"
          src="/zoom-transcript-mcp/amp/zoom/summary?meetingId=123456789">
  <template type="amp-mustache">
    <div>
      <h2>Meeting Summary</h2>
      <p>{{content.summary}}</p>
    </div>
  </template>
</amp-list>
```