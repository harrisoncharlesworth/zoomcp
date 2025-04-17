/**
 * Tests for Zoom routes
 */

const request = require('supertest');
const app = require('../index');
const zoomService = require('../services/zoom');

// Mock Zoom service
jest.mock('../services/zoom');

describe('Zoom API Routes', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/zoom/transcript/:meetingId', () => {
    it('should return transcript data for a valid meeting ID', async () => {
      // Mock service response
      zoomService.fetchTranscript.mockResolvedValue({
        participants: ['John Doe', 'Jane Smith'],
        entries: [
          { timestamp: '00:01:23', speaker: 'John Doe', text: 'Hello everyone.' },
          { timestamp: '00:01:30', speaker: 'Jane Smith', text: 'Hi there.' }
        ]
      });

      const res = await request(app).get('/api/zoom/transcript/123456789');

      // Verify response
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('participants');
      expect(res.body).toHaveProperty('entries');
      expect(zoomService.fetchTranscript).toHaveBeenCalledWith('123456789');
    });

    it('should handle errors properly', async () => {
      // Mock service error
      zoomService.fetchTranscript.mockRejectedValue(new Error('Failed to fetch transcript'));

      const res = await request(app).get('/api/zoom/transcript/123456789');

      // Verify error response
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/zoom/summary/:meetingId', () => {
    it('should return meeting summary', async () => {
      // Mock service response
      zoomService.getMeetingSummary.mockResolvedValue({
        meetingId: '123456789',
        participants: ['John Doe', 'Jane Smith'],
        summary: 'This is a summary of the meeting.',
        totalEntries: 10,
        filteredEntries: 10
      });

      const res = await request(app).get('/api/zoom/summary/123456789');

      // Verify response
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('summary');
      expect(zoomService.getMeetingSummary).toHaveBeenCalledWith('123456789', undefined, undefined);
    });

    it('should accept date and participant filters', async () => {
      // Mock service response
      zoomService.getMeetingSummary.mockResolvedValue({
        meetingId: '123456789',
        participants: ['John Doe', 'Jane Smith'],
        summary: 'This is a filtered summary.',
        filteredParticipant: 'John',
        totalEntries: 10,
        filteredEntries: 5
      });

      const res = await request(app)
        .get('/api/zoom/summary/123456789?date=2023-04-15&participant=John');

      // Verify response and parameters
      expect(res.statusCode).toBe(200);
      expect(res.body.filteredParticipant).toBe('John');
      expect(zoomService.getMeetingSummary).toHaveBeenCalledWith(
        '123456789', 
        '2023-04-15', 
        'John'
      );
    });
  });

  describe('GET /api/zoom/action-items/:meetingId', () => {
    it('should return action items from the meeting', async () => {
      // Mock service response
      zoomService.getActionItems.mockResolvedValue({
        meetingId: '123456789',
        totalActionItems: 2,
        actionItems: [
          {
            timestamp: '00:10:23',
            speaker: 'John Doe',
            action: 'John will update the documentation.'
          },
          {
            timestamp: '00:15:45',
            speaker: 'Jane Smith',
            action: 'Jane will schedule a follow-up meeting.'
          }
        ]
      });

      const res = await request(app).get('/api/zoom/action-items/123456789');

      // Verify response
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('actionItems');
      expect(res.body.actionItems).toHaveLength(2);
      expect(zoomService.getActionItems).toHaveBeenCalledWith('123456789', undefined);
    });
  });

  describe('GET /api/zoom/decisions/:meetingId', () => {
    it('should return decisions from the meeting', async () => {
      // Mock service response
      zoomService.getDecisions.mockResolvedValue({
        meetingId: '123456789',
        totalDecisions: 2,
        decisions: [
          {
            timestamp: '00:20:15',
            speaker: 'John Doe',
            decision: 'We decided to go with option A.'
          },
          {
            timestamp: '00:25:30',
            speaker: 'Jane Smith',
            decision: 'The deadline will be moved to next Friday.'
          }
        ]
      });

      const res = await request(app).get('/api/zoom/decisions/123456789');

      // Verify response
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('decisions');
      expect(res.body.decisions).toHaveLength(2);
      expect(zoomService.getDecisions).toHaveBeenCalledWith('123456789', undefined);
    });
  });

  describe('AMP Endpoints', () => {
    it('should return AMP-compatible response for meeting summary', async () => {
      // Mock service response
      zoomService.getMeetingSummary.mockResolvedValue({
        meetingId: '123456789',
        participants: ['John Doe', 'Jane Smith'],
        summary: 'This is a summary of the meeting.',
        totalEntries: 10,
        filteredEntries: 10
      });

      const res = await request(app).get('/amp/zoom/summary?meetingId=123456789');

      // Verify AMP-compatible response
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('version', '0.1');
      expect(res.body).toHaveProperty('content');
      expect(res.header['content-type']).toBe('application/json');
      expect(res.header['access-control-allow-origin']).toBe('*');
    });

    it('should return error for missing meetingId', async () => {
      const res = await request(app).get('/amp/zoom/summary');

      // Verify error response
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});