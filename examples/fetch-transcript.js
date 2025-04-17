/**
 * Example script for fetching and processing Zoom meeting transcripts
 * 
 * This example shows how to use the MCP server from a Node.js client
 */

const axios = require('axios');

// Configuration
const MCP_SERVER_URL = 'http://localhost:3000';
const MEETING_ID = '123456789'; // Replace with an actual Zoom meeting ID

/**
 * Fetch and display meeting summary
 */
async function fetchMeetingSummary() {
  try {
    console.log('Fetching meeting summary...');
    
    const response = await axios.get(`${MCP_SERVER_URL}/api/zoom/summary/${MEETING_ID}`);
    
    console.log('\nMeeting Summary:');
    console.log('-----------------');
    console.log(`Meeting ID: ${response.data.meetingId}`);
    console.log(`Participants: ${response.data.participants.join(', ')}`);
    console.log('\nSummary:');
    console.log(response.data.summary);
    console.log(`\nTotal entries: ${response.data.totalEntries}`);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching meeting summary:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
}

/**
 * Fetch and display action items
 */
async function fetchActionItems() {
  try {
    console.log('\nFetching action items...');
    
    const response = await axios.get(`${MCP_SERVER_URL}/api/zoom/action-items/${MEETING_ID}`);
    
    console.log('\nAction Items:');
    console.log('-----------------');
    console.log(`Meeting ID: ${response.data.meetingId}`);
    console.log(`Total action items: ${response.data.totalActionItems}`);
    
    if (response.data.actionItems.length > 0) {
      console.log('\nItems:');
      response.data.actionItems.forEach((item, index) => {
        console.log(`\n${index + 1}. Speaker: ${item.speaker}`);
        console.log(`   Time: ${item.timestamp}`);
        console.log(`   Action: ${item.action}`);
      });
    } else {
      console.log('No action items found.');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching action items:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
}

/**
 * Fetch and display decisions
 */
async function fetchDecisions() {
  try {
    console.log('\nFetching decisions...');
    
    const response = await axios.get(`${MCP_SERVER_URL}/api/zoom/decisions/${MEETING_ID}`);
    
    console.log('\nDecisions:');
    console.log('-----------------');
    console.log(`Meeting ID: ${response.data.meetingId}`);
    console.log(`Total decisions: ${response.data.totalDecisions}`);
    
    if (response.data.decisions.length > 0) {
      console.log('\nItems:');
      response.data.decisions.forEach((item, index) => {
        console.log(`\n${index + 1}. Speaker: ${item.speaker}`);
        console.log(`   Time: ${item.timestamp}`);
        console.log(`   Decision: ${item.decision}`);
      });
    } else {
      console.log('No decisions found.');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching decisions:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
}

/**
 * Main function to run all examples
 */
async function main() {
  console.log('Zoom Transcript MCP Client Example');
  console.log('================================\n');
  
  await fetchMeetingSummary();
  await fetchActionItems();
  await fetchDecisions();
  
  console.log('\nDone!');
}

// Run the examples
main().catch(console.error);