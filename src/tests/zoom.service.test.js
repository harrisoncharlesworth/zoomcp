/**
 * Tests for Zoom service
 */

const zoomService = require('../services/zoom');

// Mock axios
jest.mock('axios');
const axios = require('axios');

// Mock natural language processing
jest.mock('natural', () => {
  return {
    SentenceTokenizer: jest.fn().mockImplementation(() => {
      return {
        tokenize: jest.fn().mockReturnValue(['This is sentence one.', 'This is sentence two.'])
      };
    }),
    TfIdf: jest.fn().mockImplementation(() => {
      return {
        addDocument: jest.fn(),
        tfidf: jest.fn().mockReturnValue(1)
      };
    })
  };
});

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token')
}));

describe('Zoom Service', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTranscript', () => {
    it('should fetch and parse transcript data', async () => {
      // Mock successful API response for recordings
      axios.get.mockImplementation((url) => {
        if (url.includes('/recordings')) {
          return Promise.resolve({
            data: {
              recording_files: [
                { file_type: 'TRANSCRIPT', download_url: 'https://zoom.us/transcript-url' }
              ]
            }
          });
        } else {
          // Mock transcript download response
          return Promise.resolve({
            data: '[00:01:23] John Doe: Hello everyone.\n[00:01:30] Jane Smith: Hi there.'
          });
        }
      });

      const result = await zoomService.fetchTranscript('123456789');

      // Verify axios was called correctly
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(axios.get).toHaveBeenNthCalledWith(
        1,
        'https://api.zoom.us/v2/meetings/123456789/recordings',
        expect.any(Object)
      );

      // Verify returned data structure
      expect(result).toHaveProperty('participants');
      expect(result).toHaveProperty('entries');
      expect(result.participants).toContain('John Doe');
      expect(result.participants).toContain('Jane Smith');
      expect(result.entries).toHaveLength(2);
    });

    it('should throw an error when no transcript is found', async () => {
      // Mock API response with no transcript file
      axios.get.mockResolvedValueOnce({
        data: {
          recording_files: [
            { file_type: 'MP4', download_url: 'https://zoom.us/video-url' }
          ]
        }
      });

      await expect(zoomService.fetchTranscript('123456789'))
        .rejects
        .toThrow('No transcript found for this meeting');
    });
  });

  describe('getMeetingSummary', () => {
    it('should generate a summary from transcript data', async () => {
      // Mock fetchTranscript to return sample data
      zoomService.fetchTranscript = jest.fn().mockResolvedValue({
        participants: ['John Doe', 'Jane Smith'],
        entries: [
          { timestamp: '00:01:23', speaker: 'John Doe', text: 'This is sentence one.' },
          { timestamp: '00:01:30', speaker: 'Jane Smith', text: 'This is sentence two.' }
        ]
      });

      const result = await zoomService.getMeetingSummary('123456789');

      // Verify fetchTranscript was called
      expect(zoomService.fetchTranscript).toHaveBeenCalledWith('123456789');

      // Verify returned summary structure
      expect(result).toHaveProperty('meetingId', '123456789');
      expect(result).toHaveProperty('participants');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('totalEntries', 2);
    });

    it('should filter entries by participant', async () => {
      // Mock fetchTranscript to return sample data
      zoomService.fetchTranscript = jest.fn().mockResolvedValue({
        participants: ['John Doe', 'Jane Smith'],
        entries: [
          { timestamp: '00:01:23', speaker: 'John Doe', text: 'This is sentence one.' },
          { timestamp: '00:01:30', speaker: 'Jane Smith', text: 'This is sentence two.' }
        ]
      });

      const result = await zoomService.getMeetingSummary('123456789', null, 'John');

      // Verify filtering by participant
      expect(result.filteredParticipant).toBe('John');
      expect(result.filteredEntries).toBe(1);
    });
  });

  describe('getActionItems', () => {
    it('should extract action items from transcript', async () => {
      // Mock fetchTranscript to return sample data with action items
      zoomService.fetchTranscript = jest.fn().mockResolvedValue({
        participants: ['John Doe', 'Jane Smith'],
        entries: [
          { 
            timestamp: '00:01:23', 
            speaker: 'John Doe', 
            text: 'Action item: John will update the documentation.' 
          },
          { 
            timestamp: '00:01:30', 
            speaker: 'Jane Smith', 
            text: 'We need to schedule a follow-up meeting.' 
          },
          { 
            timestamp: '00:01:40', 
            speaker: 'John Doe', 
            text: 'I agree with that approach.' 
          }
        ]
      });

      const result = await zoomService.getActionItems('123456789');

      // Verify action items extraction
      expect(result).toHaveProperty('meetingId', '123456789');
      expect(result).toHaveProperty('totalActionItems', 2);
      expect(result.actionItems).toHaveLength(2);
      expect(result.actionItems[0].speaker).toBe('John Doe');
    });
  });

  describe('getDecisions', () => {
    it('should extract decisions from transcript', async () => {
      // Mock fetchTranscript to return sample data with decisions
      zoomService.fetchTranscript = jest.fn().mockResolvedValue({
        participants: ['John Doe', 'Jane Smith'],
        entries: [
          { 
            timestamp: '00:01:23', 
            speaker: 'John Doe', 
            text: 'We decided to go with option A for the project.' 
          },
          { 
            timestamp: '00:01:30', 
            speaker: 'Jane Smith', 
            text: 'The team agreed to move the deadline to next Friday.' 
          },
          { 
            timestamp: '00:01:40', 
            speaker: 'John Doe', 
            text: 'Let me know if you have questions.' 
          }
        ]
      });

      const result = await zoomService.getDecisions('123456789');

      // Verify decisions extraction
      expect(result).toHaveProperty('meetingId', '123456789');
      expect(result).toHaveProperty('totalDecisions', 2);
      expect(result.decisions).toHaveLength(2);
      expect(result.decisions[0].speaker).toBe('John Doe');
      expect(result.decisions[1].speaker).toBe('Jane Smith');
    });
  });
});