/**
 * Mock Zoom Data Provider
 * Provides simulated transcript data for testing and development
 * until the real Zoom API integration is available
 */

// Sample meeting participants
const SAMPLE_PARTICIPANTS = [
  'John Smith',
  'Jane Doe',
  'Mike Johnson',
  'Sarah Williams',
  'David Brown'
];

// Sample meeting transcript entries
const generateSampleTranscript = (meetingId, participantCount = 4) => {
  // Select a subset of participants for this meeting
  const participants = [];
  while (participants.length < participantCount) {
    const randomParticipant = SAMPLE_PARTICIPANTS[Math.floor(Math.random() * SAMPLE_PARTICIPANTS.length)];
    if (!participants.includes(randomParticipant)) {
      participants.push(randomParticipant);
    }
  }
  
  // Sample conversation flows for different meeting types
  const conversationFlows = [
    // Regular team meeting
    [
      "Let's get started with our weekly update.",
      "I've completed the frontend changes we discussed last time.",
      "Great work. Are there any blockers for the next sprint?",
      "We need to discuss the API integration timeline.",
      "I think we should prioritize the user authentication flow.",
      "I agree. Authentication is critical for the next release.",
      "Let's schedule a follow-up meeting to discuss technical details.",
      "Action item: John will create the API documentation by Friday.",
      "I'll take care of setting up the testing environment.",
      "We decided to push the release date to next month.",
      "Does everyone agree with this timeline?",
      "Yes, that gives us enough buffer for thorough testing.",
      "Let's wrap up now. Thanks everyone!"
    ],
    // Project planning meeting
    [
      "Welcome to our project planning session.",
      "Let's review our progress from last quarter.",
      "We've hit most of our targets except for the mobile app launch.",
      "What were the main challenges we faced?",
      "The integration with the payment provider took longer than expected.",
      "I think we need to allocate more resources to the mobile team.",
      "Agreed. Let's increase the mobile team size by two developers.",
      "Action item: Mike will draft the resource allocation plan.",
      "When can we expect the new timeline for the mobile launch?",
      "I can have it ready by next Monday.",
      "Great. We've decided to prioritize the mobile app for Q3.",
      "Any other concerns we need to address?",
      "We should review our testing protocols.",
      "Action item: Sarah will review QA processes and suggest improvements.",
      "Thanks everyone for your input."
    ],
    // Technical discussion
    [
      "Let's discuss the architecture for the new feature.",
      "I think we should use a microservices approach.",
      "That makes sense, but we need to consider the deployment complexity.",
      "What about using containers for each service?",
      "Docker would be perfect for this. We can orchestrate with Kubernetes.",
      "I'm concerned about the learning curve for the team.",
      "Valid point. We should plan for some training sessions.",
      "Action item: David will create a Docker training plan.",
      "We need to decide on the database technology as well.",
      "I recommend PostgreSQL for the main data store.",
      "And perhaps Redis for caching?",
      "Agreed. We'll use PostgreSQL and Redis.",
      "Let's document these decisions in our tech spec.",
      "I'll follow up with a detailed implementation plan.",
      "Great discussion everyone."
    ]
  ];
  
  // Select a random conversation flow
  const selectedFlow = conversationFlows[Math.floor(Math.random() * conversationFlows.length)];
  
  // Generate transcript entries
  const entries = [];
  let currentTime = new Date();
  currentTime.setHours(10, 0, 0, 0); // Start at 10:00 AM
  
  selectedFlow.forEach(text => {
    // Select a random participant
    const speaker = participants[Math.floor(Math.random() * participants.length)];
    
    // Format timestamp as HH:MM:SS
    const timestamp = currentTime.toTimeString().substring(0, 8);
    
    // Add entry to transcript
    entries.push({
      timestamp,
      speaker,
      text
    });
    
    // Advance time by 30-90 seconds for next entry
    currentTime = new Date(currentTime.getTime() + (30000 + Math.random() * 60000));
  });
  
  return {
    participants,
    entries
  };
};

// Cache for generated transcripts to provide consistent data on repeated calls
const transcriptCache = new Map();

/**
 * Get a mock transcript for a meeting
 * @param {string} meetingId - The meeting ID
 * @returns {Object} - The transcript data
 */
const getMockTranscript = (meetingId) => {
  // Check if we already generated a transcript for this meeting ID
  if (!transcriptCache.has(meetingId)) {
    // Generate and cache a new transcript
    transcriptCache.set(meetingId, generateSampleTranscript(meetingId));
  }
  
  return transcriptCache.get(meetingId);
};

module.exports = {
  getMockTranscript
};