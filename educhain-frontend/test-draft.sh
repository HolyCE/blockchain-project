#!/bin/bash

echo "🔍 TESTING DRAFT CREATION"
echo "=========================="

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTljMTFlMjk4ODA4NDJjN2MwMWEwNzQiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzkzMzIyMywiZXhwIjoxNzc0NTM4MDIzfQ.GeKs8I_BUVkdWHT_hcrOZFEVdVLAvDHpy6K5rOPCdms"

echo -e "\n1. Creating draft request..."
DRAFT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/result-requests/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Draft response: $DRAFT_RESPONSE"

# Extract request ID if successful
if [[ "$DRAFT_RESPONSE" == *"requestId"* ]]; then
  REQUEST_ID=$(echo $DRAFT_RESPONSE | grep -o '"requestId":"[^"]*"' | cut -d'"' -f4)
  echo -e "\n✅ Draft created with ID: $REQUEST_ID"
  
  # Get available courses for your department (Computer Science Level 400)
  echo -e "\n2. Fetching available courses..."
  COURSES=$(curl -s -H "Authorization: Bearer $TOKEN" \
    "http://localhost:5000/api/courses?department=Computer%20Science&level=400" | python3 -m json.tool)
  
  echo "Courses for Computer Science Level 400:"
  echo "$COURSES" | grep -E '"code"|"title"' | head -10
  
else
  echo -e "\n❌ Draft creation failed"
  echo "Error: $DRAFT_RESPONSE"
fi
