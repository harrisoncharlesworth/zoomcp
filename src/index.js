/**
 * Zoom Transcript MCP Server - Main entry point
 * 
 * This service enables integration with Zoom meeting transcripts via MCP
 */

require('dotenv').config();
const express = require('express');
const { zoomRouter } = require('./routes/zoom');
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

// AMP compatible endpoints
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