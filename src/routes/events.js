/**
 * Events Routes
 * Handles SSE (Server-Sent Events) for real-time updates
 */

const express = require('express');
const router = express.Router();

// Collection of active SSE clients
const clients = new Set();

/**
 * Send an event to all connected clients
 * @param {Object} data - The event data to send
 */
const broadcastEvent = (data) => {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

/**
 * @route   GET /api/events
 * @desc    SSE endpoint for real-time updates
 * @access  Public
 */
router.get('/', (req, res) => {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send an initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connection', message: 'Connected to Zoom Transcript MCP events' })}\n\n`);

  // Add this client to the set
  clients.add(res);

  // Remove client when connection closes
  req.on('close', () => {
    clients.delete(res);
  });
});

module.exports = { eventsRouter: router, broadcastEvent, clients };