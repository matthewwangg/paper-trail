#!/bin/bash

# Script to test tasks functionality in the papertrail-backend application

# Prompt for server IP address, username, and password
read -p "Enter server IP address: " SERVER_IP
read -p "Enter username: " USERNAME
read -s -p "Enter password: " PASSWORD
echo

# Base URL using the provided IP address
BASE_URL="http://$SERVER_IP:8080"

# Login and get the token
TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed. Please check your credentials."
  exit 1
fi

echo "Logged in successfully."

# Create a new task
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/tasks \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Task 1","description":"First task description"}')

echo "Task created: $CREATE_RESPONSE"

# Extract the task ID
TASK_ID=$(echo $CREATE_RESPONSE | jq -r '.ID')

if [ "$TASK_ID" == "null" ] || [ -z "$TASK_ID" ]; then
  echo "Failed to create task."
  exit 1
fi

# Get all tasks
echo "Retrieving all tasks:"
curl -s -X GET $BASE_URL/tasks \
     -H "Authorization: Bearer $TOKEN" | jq

# Update the task
UPDATE_RESPONSE=$(curl -s -X PUT $BASE_URL/tasks/$TASK_ID \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Updated Task 1","description":"Updated description"}')

echo "Task updated: $UPDATE_RESPONSE"

# Change the task status to "In Progress"
STATUS_RESPONSE=$(curl -s -X PUT $BASE_URL/tasks/$TASK_ID/status \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"status":"In Progress"}')

echo "Task status updated: $STATUS_RESPONSE"

# Delete the task
DELETE_RESPONSE=$(curl -s -X DELETE $BASE_URL/tasks/$TASK_ID \
     -H "Authorization: Bearer $TOKEN")

echo "Task deleted: $DELETE_RESPONSE"
