/**
 * Zoom Transcript MCP Server - Main entry point
 * 
 * This service enables integration with Zoom meeting transcripts via MCP
 */

require('dotenv').config();
const express = require('express');
const { zoomRouter } = require('./routes/zoom');
const { eventsRouter, broadcastEvent } = require('./routes/events');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/zoom', zoomRouter);
app.use('/api/events', eventsRouter);

// Create global broadcast event function to avoid circular dependencies
global.mcp = global.mcp || {};
global.mcp.broadcastEvent = broadcastEvent;

// AMP compatible endpoints
app.get('/amp/events', (req, res) => {
  // Set headers for SSE with AMP compatibility
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send an initial connection message with AMP version
  res.write(`data: ${JSON.stringify({
    version: '0.1',
    content: { type: 'connection', message: 'Connected to Zoom Transcript MCP events' }
  })}\n\n`);

  // Use the existing clients collection from the eventsRouter module
  const { clients } = require('./routes/events');
  clients.add(res);

  // Remove client when connection closes
  req.on('close', () => {
    clients.delete(res);
  });
});

app.get('/amp/zoom/summary', async (req, res) => {
  try {
    const { meetingId, date, participant } = req.query;
    
    if (!meetingId) {
      return res.status(400).json({ 
        error: 'Missing required parameter: meetingId' 
      });
    }
    
    // Return AMP-compatible format
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const summaryData = await require('./services/zoom').getMeetingSummary(meetingId, date, participant);
    res.status(200).json({
      version: '0.1',
      content: summaryData
    });
  } catch (error) {
    console.error('Error generating meeting summary:', error);
    res.status(500).json({ 
      version: '0.1',
      error: 'Failed to generate meeting summary' 
    });
  }
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Zoom Transcript MCP Server running on port ${PORT}`);
});

module.exports = app; // Export for testing