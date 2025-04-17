# Zoom Transcript MCP Server

A Node.js Express server that integrates with Zoom to retrieve and process meeting transcripts. This MCP (Messaging Control Program) server provides endpoints to request summaries, action items, and decisions from meeting transcripts.

## Features

- **Transcript Retrieval**: Fetch raw transcript data from Zoom meetings
- **Summarization**: Generate concise summaries of meeting discussions
- **Action Item Extraction**: Identify and list action items mentioned during meetings
- **Decision Tracking**: Extract decisions made during meetings
- **Participant Filtering**: Filter transcript data by participant
- **AMP Compatibility**: Includes AMP-compatible endpoints for rich display

## Installation

```bash
# Clone the repository
git clone https://github.com/harrisoncharlesworth/zoomcp.git
cd zoomcp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Zoom API credentials
```

## Configuration

Create a `.env` file with the following variables:

```
# Zoom API Configuration
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_ACCOUNT_ID=your_zoom_account_id

# Server Configuration
PORT=3000
NODE_ENV=development
```

## API Endpoints

### Health Check

```
GET /health
```

Returns status information about the API.

### Transcript Retrieval

```
GET /api/zoom/transcript/:meetingId
```

Fetches the raw transcript data for a specific meeting.

### Meeting Summary

```
GET /api/zoom/summary/:meetingId?date=YYYY-MM-DD&participant=John
```

Generates a summary of the meeting discussion. Supports optional date and participant filters.

### Action Items

```
GET /api/zoom/action-items/:meetingId?participant=John
```

Extracts action items from the meeting transcript. Supports optional participant filter.

### Decisions

```
GET /api/zoom/decisions/:meetingId?participant=John
```

Extracts decisions made during the meeting. Supports optional participant filter.

### AMP-Compatible Endpoints

```
GET /amp/zoom/summary?meetingId=123456789&participant=John
```

Provides an AMP-compatible response for summary data.

## Usage

### Starting the Server

```bash
# Development mode with hot reloading
npm run dev

# Production mode
npm start
```

### Running Tests

```bash
npm test
```

## Integration with ChatGPT

This MCP server is designed to work with ChatGPT integrations. When connected as a plugin or tool, it allows ChatGPT to:

1. Retrieve meeting transcripts
2. Generate summaries of meetings
3. Extract action items assigned to team members
4. List decisions made during meetings
5. Filter information by specific participants

## Development

This project uses:

- Node.js and Express for the server
- Zoom API for transcript retrieval
- Natural language processing for text analysis
- Jest for testing

## License

MIT