#!/bin/bash

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "Error: ngrok is not installed. Please install it from https://ngrok.com/download"
    exit 1
}

# Start the server in the background
echo "Starting the Zoom Transcript MCP server..."
npm start &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 3

# Start ngrok
echo "Starting ngrok to create a public URL..."
ngrok http 3000

# When ngrok is terminated, also terminate the server
trap "kill $SERVER_PID" EXIT

# Keep the script running until Ctrl+C
wait