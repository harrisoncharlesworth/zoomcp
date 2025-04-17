/**
 * Zoom Routes
 * Handles API endpoints for Zoom transcript processing
 */

const express = require('express');
const zoomService = require('../services/zoom');

const router = express.Router();

/**
 * @route   GET /api/zoom/transcript/:meetingId
 * @desc    Get raw transcript data for a meeting
 * @access  Public
 */
router.get('/transcript/:meetingId', async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID is required' });
    }
    
    const transcript = await zoomService.fetchTranscript(meetingId);
    res.status(200).json(transcript);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/zoom/summary/:meetingId
 * @desc    Get a summary of the meeting
 * @access  Public
 */
router.get('/summary/:meetingId', async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const { date, participant } = req.query;
    
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID is required' });
    }
    
    const summary = await zoomService.getMeetingSummary(meetingId, date, participant);
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/zoom/action-items/:meetingId
 * @desc    Get action items from the meeting
 * @access  Public
 */
router.get('/action-items/:meetingId', async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const { participant } = req.query;
    
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID is required' });
    }
    
    const actionItems = await zoomService.getActionItems(meetingId, participant);
    res.status(200).json(actionItems);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/zoom/decisions/:meetingId
 * @desc    Get decisions from the meeting
 * @access  Public
 */
router.get('/decisions/:meetingId', async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const { participant } = req.query;
    
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID is required' });
    }
    
    const decisions = await zoomService.getDecisions(meetingId, participant);
    res.status(200).json(decisions);
  } catch (error) {
    next(error);
  }
});

module.exports = { zoomRouter: router };