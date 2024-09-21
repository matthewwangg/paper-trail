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

# Prompt for task priority and tags
read -p "Enter task priority (low, medium, high): " PRIORITY
read -p "Enter task tags (comma separated): " TAGS
IFS=',' read -r -a TAG_ARRAY <<< "$TAGS"

# Convert the TAG_ARRAY to a JSON array of strings
TAG_JSON_ARRAY=$(printf ',\"%s\"' "${TAG_ARRAY[@]}")
TAG_JSON_ARRAY="[${TAG_JSON_ARRAY:1}]"

# Create a new task with priority and tags
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/tasks \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d "{\"title\":\"Task 1\",\"description\":\"First task description\",\"priority\":\"$PRIORITY\",\"tags\":$TAG_JSON_ARRAY}")

echo "Task created: $CREATE_RESPONSE"

# Extract the task ID
TASK_ID=$(echo $CREATE_RESPONSE | jq -r '.id')

if [ "$TASK_ID" == "null" ] || [ -z "$TASK_ID" ]; then
  echo "Failed to create task."
  exit 1
fi

# Get all tasks
echo "Retrieving all tasks:"
curl -s -X GET $BASE_URL/tasks \
     -H "Authorization: Bearer $TOKEN" | jq

# Get tasks grouped by status
echo "Retrieving tasks grouped by status:"
curl -s -X GET $BASE_URL/tasks/grouped/status \
     -H "Authorization: Bearer $TOKEN" | jq

# Get tasks grouped by priority
echo "Retrieving tasks grouped by priority:"
curl -s -X GET $BASE_URL/tasks/grouped/priority \
     -H "Authorization: Bearer $TOKEN" | jq

# Get task by ID
echo "Retrieving task by ID:"
GET_TASK_RESPONSE=$(curl -s -X GET $BASE_URL/tasks/$TASK_ID \
     -H "Authorization: Bearer $TOKEN")
echo "Task details: $GET_TASK_RESPONSE"

# Update the task (change title, description, priority, and tags)
read -p "Enter new task title: " NEW_TITLE
read -p "Enter new task description: " NEW_DESCRIPTION
read -p "Enter new task priority (low, medium, high): " NEW_PRIORITY
read -p "Enter new task tags (comma separated): " NEW_TAGS
IFS=',' read -r -a NEW_TAG_ARRAY <<< "$NEW_TAGS"

# Convert the NEW_TAG_ARRAY to a JSON array of strings
NEW_TAG_JSON_ARRAY=$(printf ',\"%s\"' "${NEW_TAG_ARRAY[@]}")
NEW_TAG_JSON_ARRAY="[${NEW_TAG_JSON_ARRAY:1}]"

UPDATE_RESPONSE=$(curl -s -X PUT $BASE_URL/tasks/$TASK_ID \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d "{\"title\":\"$NEW_TITLE\",\"description\":\"$NEW_DESCRIPTION\",\"priority\":\"$NEW_PRIORITY\",\"tags\":$NEW_TAG_JSON_ARRAY}")

echo "Task updated: $UPDATE_RESPONSE"

# Change the task status to "In Progress"
STATUS_RESPONSE=$(curl -s -X PUT $BASE_URL/tasks/$TASK_ID/status \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"status":"In Progress"}')

echo "Task status updated: $STATUS_RESPONSE"

# Retrieve tasks with filtering (e.g., priority=high)
echo "Retrieving tasks with priority=high:"
curl -s -X GET $BASE_URL/tasks?priority=high \
     -H "Authorization: Bearer $TOKEN" | jq

# Delete the task
DELETE_RESPONSE=$(curl -s -X DELETE $BASE_URL/tasks/$TASK_ID \
     -H "Authorization: Bearer $TOKEN")

echo "Task deleted: $DELETE_RESPONSE"
