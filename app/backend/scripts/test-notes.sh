#!/bin/bash

# Script to test notes functionality in the papertrail-backend application

# Prompt for IP address, username, and password
read -p "Enter server IP address: " SERVER_IP
read -p "Enter username: " USERNAME
read -s -p "Enter password: " PASSWORD
echo

# Login and get the token
TOKEN=$(curl -s -X POST http://$SERVER_IP:8080/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed. Please check your credentials."
  exit 1
fi

echo "Logged in successfully."

# Create a new note
CREATE_RESPONSE=$(curl -s -X POST http://$SERVER_IP:8080/notes \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Automated Note","content":"Content created via script."}')

echo "Note created: $CREATE_RESPONSE"

# Extract the note ID
NOTE_ID=$(echo $CREATE_RESPONSE | jq -r '.ID')

if [ "$NOTE_ID" == "null" ] || [ -z "$NOTE_ID" ]; then
  echo "Failed to create note."
  exit 1
fi

# Get all notes
echo "Retrieving all notes:"
curl -s -X GET http://$SERVER_IP:8080/notes \
     -H "Authorization: Bearer $TOKEN" | jq

# Update the note
UPDATE_RESPONSE=$(curl -s -X PUT http://$SERVER_IP:8080/notes/$NOTE_ID \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Updated Automated Note","content":"Updated content via script."}')

echo "Note updated: $UPDATE_RESPONSE"

# Delete the note
DELETE_RESPONSE=$(curl -s -X DELETE http://$SERVER_IP:8080/notes/$NOTE_ID \
     -H "Authorization: Bearer $TOKEN")

echo "Note deleted: $DELETE_RESPONSE"

# Attempt to retrieve the deleted note
echo "Attempting to retrieve deleted note:"
curl -s -X GET http://$SERVER_IP:8080/notes/$NOTE_ID \
     -H "Authorization: Bearer $TOKEN" | jq
