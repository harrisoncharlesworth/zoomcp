/**
 * Tests for Events system
 */

const { broadcastEvent, clients } = require('../routes/events');

describe('Events System', () => {
  // Mock client for testing
  const mockClient = {
    write: jest.fn(),
    writeHead: jest.fn()
  };
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Clear clients collection
    clients.clear();
  });
  
  describe('broadcastEvent', () => {
    it('should send event data to all connected clients', () => {
      // Add mock client to clients collection
      clients.add(mockClient);
      
      // Define test event data
      const eventData = {
        type: 'test_event',
        message: 'This is a test event',
        timestamp: '2023-04-17T12:00:00Z'
      };
      
      // Call broadcastEvent function
      broadcastEvent(eventData);
      
      // Verify the client's write method was called with correct data
      expect(mockClient.write).toHaveBeenCalledTimes(1);
      expect(mockClient.write).toHaveBeenCalledWith(
        `data: ${JSON.stringify(eventData)}\n\n`
      );
    });
    
    it('should do nothing when there are no connected clients', () => {
      // Define test event data
      const eventData = {
        type: 'test_event',
        message: 'This is a test event'
      };
      
      // Call broadcastEvent function
      broadcastEvent(eventData);
      
      // Verify the client's write method was not called
      expect(mockClient.write).not.toHaveBeenCalled();
    });
    
    it('should send to multiple clients when multiple are connected', () => {
      // Create second mock client
      const mockClient2 = {
        write: jest.fn(),
        writeHead: jest.fn()
      };
      
      // Add both clients to clients collection
      clients.add(mockClient);
      clients.add(mockClient2);
      
      // Define test event data
      const eventData = {
        type: 'test_event',
        message: 'This is a test event'
      };
      
      // Call broadcastEvent function
      broadcastEvent(eventData);
      
      // Verify both clients' write methods were called with correct data
      expect(mockClient.write).toHaveBeenCalledTimes(1);
      expect(mockClient2.write).toHaveBeenCalledTimes(1);
      expect(mockClient.write).toHaveBeenCalledWith(
        `data: ${JSON.stringify(eventData)}\n\n`
      );
      expect(mockClient2.write).toHaveBeenCalledWith(
        `data: ${JSON.stringify(eventData)}\n\n`
      );
    });
  });
});