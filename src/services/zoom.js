/**
 * Zoom Service
 * Handles integration with Zoom API for retrieving meeting transcripts
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');
const natural = require('natural');

// Configure Zoom API client
const zoomConfig = {
  clientId: process.env.ZOOM_CLIENT_ID,
  clientSecret: process.env.ZOOM_CLIENT_SECRET,
  accountId: process.env.ZOOM_ACCOUNT_ID
};

/**
 * Generate a JWT token for Zoom API authentication
 * @returns {string} - JWT token
 */
const generateZoomToken = () => {
  const payload = {
    iss: zoomConfig.clientId,
    exp: Math.floor(Date.now() / 1000) + 3600 // Token expires in 1 hour
  };
  
  return jwt.sign(payload, zoomConfig.clientSecret);
};

/**
 * Fetch transcript data for a specific meeting
 * @param {string} meetingId - Zoom meeting ID
 * @returns {Promise<Object>} - Meeting transcript data
 */
const fetchTranscript = async (meetingId) => {
  try {
    const token = generateZoomToken();
    
    const response = await axios.get(
      `https://api.zoom.us/v2/meetings/${meetingId}/recordings`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract transcript file from recording data
    const recordings = response.data.recording_files || [];
    const transcriptFile = recordings.find(file => file.file_type === 'TRANSCRIPT');
    
    if (!transcriptFile) {
      throw new Error('No transcript found for this meeting');
    }
    
    // Fetch actual transcript content
    const transcriptResponse = await axios.get(transcriptFile.download_url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return parseTranscript(transcriptResponse.data);
  } catch (error) {
    console.error('Error fetching Zoom transcript:', error.message);
    throw new Error(`Failed to fetch transcript: ${error.message}`);
  }
};

/**
 * Parse raw transcript data into structured format
 * @param {string} rawTranscript - Raw transcript text
 * @returns {Object} - Structured transcript data
 */
const parseTranscript = (rawTranscript) => {
  // Implementation will depend on Zoom's transcript format
  // This is a simplified example
  const lines = rawTranscript.split('\n').filter(line => line.trim());
  
  const parsedData = {
    participants: new Set(),
    entries: []
  };
  
  lines.forEach(line => {
    // Example format: "[00:01:23] John Doe: This is what I said"
    const match = line.match(/\[(\d{2}:\d{2}:\d{2})\]\s*([^:]+):(.*)/i);
    
    if (match) {
      const [, timestamp, speaker, text] = match;
      const speakerName = speaker.trim();
      
      parsedData.participants.add(speakerName);
      parsedData.entries.push({
        timestamp,
        speaker: speakerName,
        text: text.trim()
      });
    }
  });
  
  // Convert Set to Array
  parsedData.participants = Array.from(parsedData.participants);
  
  return parsedData;
};

/**
 * Generate a summary of the meeting
 * @param {string} meetingId - Zoom meeting ID
 * @param {string} [date] - Optional date filter
 * @param {string} [participant] - Optional participant filter
 * @returns {Promise<Object>} - Meeting summary
 */
const getMeetingSummary = async (meetingId, date, participant) => {
  // Broadcast event that summary generation has started
  if (global.mcp && global.mcp.broadcastEvent) {
    global.mcp.broadcastEvent({
      type: 'summary_started',
      meetingId,
      timestamp: new Date().toISOString()
    });
  }
  
  const transcript = await fetchTranscript(meetingId);
  
  // Filter by participant if specified
  let filteredEntries = transcript.entries;
  if (participant) {
    filteredEntries = filteredEntries.filter(
      entry => entry.speaker.toLowerCase().includes(participant.toLowerCase())
    );
  }
  
  // Generate summary using natural language processing
  // Here we'll use a simple extractive summarization approach
  const tokenizer = new natural.SentenceTokenizer();
  const allText = filteredEntries.map(entry => entry.text).join(' ');
  const sentences = tokenizer.tokenize(allText);
  
  // Use TF-IDF to find the most important sentences
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();
  
  sentences.forEach(sentence => {
    tfidf.addDocument(sentence);
  });
  
  // Score each sentence based on term importance
  const sentenceScores = sentences.map((sentence, idx) => {
    let score = 0;
    const terms = sentence.split(' ');
    
    terms.forEach(term => {
      score += tfidf.tfidf(term, idx);
    });
    
    return { sentence, score: score / terms.length };
  });
  
  // Sort by score and take top sentences for summary
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.ceil(sentences.length * 0.3))
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
    .map(item => item.sentence);
  
  const summaryResult = {
    meetingId,
    participants: transcript.participants,
    summary: topSentences.join(' '),
    filteredParticipant: participant || null,
    totalEntries: transcript.entries.length,
    filteredEntries: filteredEntries.length
  };
  
  // Broadcast event that summary generation is complete
  if (global.mcp && global.mcp.broadcastEvent) {
    global.mcp.broadcastEvent({
      type: 'summary_completed',
      meetingId,
      participants: transcript.participants.length,
      timestamp: new Date().toISOString()
    });
  }
  
  return summaryResult;
};

/**
 * Extract action items from meeting transcript
 * @param {string} meetingId - Zoom meeting ID
 * @param {string} [participant] - Optional participant filter
 * @returns {Promise<Object>} - Action items from the meeting
 */
const getActionItems = async (meetingId, participant) => {
  const transcript = await fetchTranscript(meetingId);
  
  // Filter by participant if specified
  let filteredEntries = transcript.entries;
  if (participant) {
    filteredEntries = filteredEntries.filter(
      entry => entry.speaker.toLowerCase().includes(participant.toLowerCase())
    );
  }
  
  // Extract action items using simple keyword matching
  // A more sophisticated approach would use NLP models
  const actionKeywords = ['action item', 'follow up', 'to-do', 'todo', 'will do', 'need to', 'should do'];
  
  const actionItems = filteredEntries
    .filter(entry => {
      const lowerText = entry.text.toLowerCase();
      return actionKeywords.some(keyword => lowerText.includes(keyword));
    })
    .map(entry => ({
      timestamp: entry.timestamp,
      speaker: entry.speaker,
      action: entry.text
    }));
  
  return {
    meetingId,
    totalActionItems: actionItems.length,
    actionItems
  };
};

/**
 * Extract decisions from meeting transcript
 * @param {string} meetingId - Zoom meeting ID
 * @param {string} [participant] - Optional participant filter
 * @returns {Promise<Object>} - Decisions from the meeting
 */
const getDecisions = async (meetingId, participant) => {
  const transcript = await fetchTranscript(meetingId);
  
  // Filter by participant if specified
  let filteredEntries = transcript.entries;
  if (participant) {
    filteredEntries = filteredEntries.filter(
      entry => entry.speaker.toLowerCase().includes(participant.toLowerCase())
    );
  }
  
  // Extract decisions using simple keyword matching
  const decisionKeywords = ['decided', 'decision', 'agree', 'agreed', 'conclude', 'concluded', 'consensus'];
  
  const decisions = filteredEntries
    .filter(entry => {
      const lowerText = entry.text.toLowerCase();
      return decisionKeywords.some(keyword => lowerText.includes(keyword));
    })
    .map(entry => ({
      timestamp: entry.timestamp,
      speaker: entry.speaker,
      decision: entry.text
    }));
  
  return {
    meetingId,
    totalDecisions: decisions.length,
    decisions
  };
};

module.exports = {
  fetchTranscript,
  getMeetingSummary,
  getActionItems,
  getDecisions
};