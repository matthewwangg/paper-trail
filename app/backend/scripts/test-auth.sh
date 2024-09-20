#!/bin/bash

# Script to test auth functionality in the papertrail-backend application

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