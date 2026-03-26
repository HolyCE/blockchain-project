#!/bin/bash

echo "🔍 TESTING COMPLETE FORWARD FLOW"
echo "================================"

# 1. Create a student request
echo -e "\n1. Creating student request..."
STUDENT_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"matricNumber":"CS/26/9999","password":"student123"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$STUDENT_TOKEN" ]; then
  echo "❌ Student login failed"
  exit 1
fi
echo "✅ Student logged in"

# Create draft
DRAFT=$(curl -s -X POST http://localhost:5000/api/result-requests/create \
  -H "Authorization: Bearer $STUDENT_TOKEN")
REQUEST_ID=$(echo $DRAFT | grep -o '"requestId":"[^"]*"' | cut -d'"' -f4)
echo "📝 Draft created: $REQUEST_ID"

# Add course
echo "📚 Adding course..."
curl -s -X POST "http://localhost:5000/api/result-requests/$REQUEST_ID/courses" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{"courses":[{"courseCode":"CSC301"}]}' > /dev/null

# Submit
echo "📤 Submitting request..."
curl -s -X POST "http://localhost:5000/api/result-requests/$REQUEST_ID/submit" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{"academicSession":"2023/2024","semester":"First","resultLevel":300}' > /dev/null
echo "✅ Request submitted"

# 2. School officer approves
echo -e "\n2. School officer approving..."
SCHOOL_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah.wilson@university.edu","password":"officer123"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SCHOOL_TOKEN" ]; then
  echo "❌ School officer login failed"
  exit 1
fi

APPROVE_RESULT=$(curl -s -X POST "http://localhost:5000/api/result-requests/$REQUEST_ID/school-officer-action" \
  -H "Authorization: Bearer $SCHOOL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"approve","comment":"Approved"}')
echo "✅ School officer approved"

# 3. Get HOD token
echo -e "\n3. Getting HOD token..."
HOD_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"prof.chukwuma.maduabuchi@university.edu","password":"hod123"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$HOD_TOKEN" ]; then
  echo "❌ HOD login failed"
  exit 1
fi
echo "✅ HOD logged in"

# 4. Get course advisors
echo -e "\n4. Getting course advisors..."
ADVISORS=$(curl -s -H "Authorization: Bearer $HOD_TOKEN" \
  "http://localhost:5000/api/users?role=course_advisor&department=Computer%20Science")
ADVISOR_ID=$(echo $ADVISORS | python3 -c "import sys,json; data=json.load(sys.stdin); users=data.get('users',[]); print(users[0]['_id'] if users else '')")
echo "👨‍🏫 Advisor ID: $ADVISOR_ID"

if [ -z "$ADVISOR_ID" ]; then
  echo "❌ No course advisors found!"
  exit 1
fi

# 5. Forward to advisor
echo -e "\n5. Forwarding request to advisor..."
FORWARD_RESULT=$(curl -s -X POST "http://localhost:5000/api/result-requests/$REQUEST_ID/hod-action" \
  -H "Authorization: Bearer $HOD_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"courseAdvisorId\":\"$ADVISOR_ID\",\"comment\":\"Forwarded from test script\"}")

echo "📤 Forward result: $FORWARD_RESULT"

# 6. Check if request was forwarded
echo -e "\n6. Checking request status..."
REQUEST_STATUS=$(curl -s -H "Authorization: Bearer $HOD_TOKEN" \
  "http://localhost:5000/api/result-requests/$REQUEST_ID" | python3 -c "import sys,json; data=json.load(sys.stdin); print(data.get('request',{}).get('status','unknown'))")
echo "📊 Request status: $REQUEST_STATUS"

# 7. Check advisor pending requests
echo -e "\n7. Checking advisor pending requests..."
ADVISOR_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dr.michael.okpara@university.edu","password":"advisor123"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

ADVISOR_REQUESTS=$(curl -s -H "Authorization: Bearer $ADVISOR_TOKEN" \
  "http://localhost:5000/api/result-requests/advisor/pending")
echo "📋 Advisor pending requests: $(echo $ADVISOR_REQUESTS | grep -o '"total":[0-9]*' | cut -d':' -f2)"

echo -e "\n🎉 Test complete!"
