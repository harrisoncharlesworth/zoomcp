/**
 * AMP-specific Routes
 * Routes for AMP-compatible endpoints
 */

const express = require('express');
const zoomService = require('../services/zoom');

const router = express.Router();

/**
 * @route   GET /summary
 * @desc    Get a summary of the meeting in AMP format
 * @access  Public
 */
router.get('/summary', async (req, res, next) => {
  try {
    const { meetingId, date, participant } = req.query;
    
    if (!meetingId) {
      return res.status(400).json({ 
        version: '0.1',
        error: 'Missing required parameter: meetingId' 
      });
    }
    
    // Return AMP-compatible format
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const summaryData = await zoomService.getMeetingSummary(meetingId, date, participant);
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

/**
 * @route   GET /action-items
 * @desc    Get action items from the meeting in AMP format
 * @access  Public
 */
router.get('/action-items', async (req, res, next) => {
  try {
    const { meetingId, participant } = req.query;
    
    if (!meetingId) {
      return res.status(400).json({ 
        version: '0.1',
        error: 'Missing required parameter: meetingId' 
      });
    }
    
    // Return AMP-compatible format
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const actionItems = await zoomService.getActionItems(meetingId, participant);
    res.status(200).json({
      version: '0.1',
      content: actionItems
    });
  } catch (error) {
    console.error('Error extracting action items:', error);
    res.status(500).json({ 
      version: '0.1',
      error: 'Failed to extract action items' 
    });
  }
});

/**
 * @route   GET /decisions
 * @desc    Get decisions from the meeting in AMP format
 * @access  Public
 */
router.get('/decisions', async (req, res, next) => {
  try {
    const { meetingId, participant } = req.query;
    
    if (!meetingId) {
      return res.status(400).json({ 
        version: '0.1',
        error: 'Missing required parameter: meetingId' 
      });
    }
    
    // Return AMP-compatible format
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const decisions = await zoomService.getDecisions(meetingId, participant);
    res.status(200).json({
      version: '0.1',
      content: decisions
    });
  } catch (error) {
    console.error('Error extracting decisions:', error);
    res.status(500).json({ 
      version: '0.1',
      error: 'Failed to extract decisions' 
    });
  }
});

module.exports = { ampRouter: router };