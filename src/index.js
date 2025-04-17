/**
 * Zoom Transcript MCP Server - Main entry point
 * 
 * This service enables integration with Zoom meeting transcripts via MCP
 */

require('dotenv').config();
const express = require('express');
const { zoomRouter } = require('./routes/zoom');
const { eventsRouter, broadcastEvent } = require('./routes/events');
const { ampRouter } = require('./routes/amp-routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Server name for AMP integration
const SERVER_NAME = 'zoom-transcript-mcp';

app.use(express.json());

// Health check endpoint - support both direct and prefixed routes
app.get(['/health', `/${SERVER_NAME}/health`], (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes - support both direct and prefixed routes
app.use('/api/zoom', zoomRouter);
app.use(`/${SERVER_NAME}/api/zoom`, zoomRouter);
app.use('/api/events', eventsRouter);
app.use(`/${SERVER_NAME}/api/events`, eventsRouter);

// Create global broadcast event function to avoid circular dependencies
global.mcp = global.mcp || {};
global.mcp.broadcastEvent = broadcastEvent;

// Set up AMP routes
app.use('/amp/zoom', ampRouter);
app.use(`/${SERVER_NAME}/amp/zoom`, ampRouter);

// AMP events endpoint - support both direct and prefixed routes
app.get(['/amp/events', `/${SERVER_NAME}/amp/events`], (req, res) => {
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

// AMP routes are now handled by the ampRouter

// Catch-all route for debugging missing endpoints
app.get('*', (req, res, next) => {
  console.log(`[DEBUG] Request to unknown endpoint: ${req.path}`);
  next(); // Let the regular 404 handling take over
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Zoom Transcript MCP Server running on port ${PORT}`);
});

module.exports = app; // Export for testing