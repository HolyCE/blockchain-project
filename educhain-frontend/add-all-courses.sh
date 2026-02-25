#!/bin/bash

echo "📚 ADDING COURSES FOR ALL DEPARTMENTS AND LEVELS"
echo "================================================="

# Get admin token
echo -n "Getting admin token... "
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@university.edu","password":"admin123"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ FAILED"
  exit 1
fi
echo "✅ SUCCESS"

# ==================== COMPUTER SCIENCE COURSES ====================
echo -e "\n💻 Adding COMPUTER SCIENCE courses..."

cs_courses=(
  # Level 100
  '{"code":"CSC101","title":"Introduction to Computer Science","creditUnits":3,"department":"Computer Science","faculty":"Science","level":100,"semester":"First"}'
  '{"code":"CSC102","title":"Computer Programming I","creditUnits":3,"department":"Computer Science","faculty":"Science","level":100,"semester":"First"}'
  '{"code":"CSC103","title":"Introduction to Information Technology","creditUnits":2,"department":"Computer Science","faculty":"Science","level":100,"semester":"Second"}'
  '{"code":"CSC104","title":"Computer Programming II","creditUnits":3,"department":"Computer Science","faculty":"Science","level":100,"semester":"Second"}'
  
  # Level 200
  '{"code":"CSC201","title":"Object-Oriented Programming","creditUnits":3,"department":"Computer Science","faculty":"Science","level":200,"semester":"First"}'
  '{"code":"CSC202","title":"Discrete Mathematics","creditUnits":3,"department":"Computer Science","faculty":"Science","level":200,"semester":"First"}'
  '{"code":"CSC203","title":"Digital Logic Design","creditUnits":3,"department":"Computer Science","faculty":"Science","level":200,"semester":"Second"}'
  '{"code":"CSC204","title":"Computer Organization","creditUnits":3,"department":"Computer Science","faculty":"Science","level":200,"semester":"Second"}'
  
  # Level 300
  '{"code":"CSC301","title":"Data Structures and Algorithms","creditUnits":3,"department":"Computer Science","faculty":"Science","level":300,"semester":"First"}'
  '{"code":"CSC302","title":"Database Management Systems","creditUnits":3,"department":"Computer Science","faculty":"Science","level":300,"semester":"First"}'
  '{"code":"CSC303","title":"Computer Networks","creditUnits":3,"department":"Computer Science","faculty":"Science","level":300,"semester":"Second"}'
  '{"code":"CSC304","title":"Software Engineering","creditUnits":3,"department":"Computer Science","faculty":"Science","level":300,"semester":"Second"}'
  '{"code":"CSC305","title":"Operating Systems","creditUnits":3,"department":"Computer Science","faculty":"Science","level":300,"semester":"First"}'
  '{"code":"CSC306","title":"Compiler Construction","creditUnits":3,"department":"Computer Science","faculty":"Science","level":300,"semester":"Second"}'
  
  # Level 400
  '{"code":"CSC401","title":"Artificial Intelligence","creditUnits":3,"department":"Computer Science","faculty":"Science","level":400,"semester":"First"}'
  '{"code":"CSC402","title":"Machine Learning","creditUnits":3,"department":"Computer Science","faculty":"Science","level":400,"semester":"First"}'
  '{"code":"CSC403","title":"Computer Graphics","creditUnits":3,"department":"Computer Science","faculty":"Science","level":400,"semester":"Second"}'
  '{"code":"CSC404","title":"Human Computer Interaction","creditUnits":3,"department":"Computer Science","faculty":"Science","level":400,"semester":"Second"}'
  '{"code":"CSC405","title":"Parallel Computing","creditUnits":3,"department":"Computer Science","faculty":"Science","level":400,"semester":"First"}'
  
  # Level 500
  '{"code":"CSC501","title":"Advanced Algorithms","creditUnits":3,"department":"Computer Science","faculty":"Science","level":500,"semester":"First"}'
  '{"code":"CSC502","title":"Distributed Systems","creditUnits":3,"department":"Computer Science","faculty":"Science","level":500,"semester":"First"}'
  '{"code":"CSC503","title":"Cloud Computing","creditUnits":3,"department":"Computer Science","faculty":"Science","level":500,"semester":"Second"}'
  '{"code":"CSC504","title":"Cybersecurity","creditUnits":3,"department":"Computer Science","faculty":"Science","level":500,"semester":"Second"}'
)

for course in "${cs_courses[@]}"; do
  code=$(echo $course | grep -o '"code":"[^"]*"' | cut -d'"' -f4)
  echo -n "  Adding $code... "
  curl -s -X POST http://localhost:5000/api/courses \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$course" > /dev/null && echo "✅" || echo "⚠️"
done

# ==================== ELECTRICAL ENGINEERING COURSES ====================
echo -e "\n⚡ Adding ELECTRICAL ENGINEERING courses..."

ee_courses=(
  # Level 100
  '{"code":"EE101","title":"Introduction to Engineering","creditUnits":2,"department":"Electrical Engineering","faculty":"Engineering","level":100,"semester":"First"}'
  '{"code":"EE102","title":"Engineering Mathematics I","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":100,"semester":"First"}'
  '{"code":"EE103","title":"Basic Electronics","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":100,"semester":"Second"}'
  
  # Level 200
  '{"code":"EE201","title":"Circuit Theory I","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":200,"semester":"First"}'
  '{"code":"EE202","title":"Digital Electronics","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":200,"semester":"First"}'
  '{"code":"EE203","title":"Electromagnetic Fields","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":200,"semester":"Second"}'
  '{"code":"EE204","title":"Signals and Systems","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":200,"semester":"Second"}'
  
  # Level 300
  '{"code":"EE301","title":"Analog Electronics","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":300,"semester":"First"}'
  '{"code":"EE302","title":"Microprocessors","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":300,"semester":"First"}'
  '{"code":"EE303","title":"Power Systems","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":300,"semester":"Second"}'
  '{"code":"EE304","title":"Control Systems","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":300,"semester":"Second"}'
  
  # Level 400
  '{"code":"EE401","title":"Digital Signal Processing","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":400,"semester":"First"}'
  '{"code":"EE402","title":"Communication Systems","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":400,"semester":"First"}'
  '{"code":"EE403","title":"Power Electronics","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":400,"semester":"Second"}'
  '{"code":"EE404","title":"Renewable Energy Systems","creditUnits":3,"department":"Electrical Engineering","faculty":"Engineering","level":400,"semester":"Second"}'
)

for course in "${ee_courses[@]}"; do
  code=$(echo $course | grep -o '"code":"[^"]*"' | cut -d'"' -f4)
  echo -n "  Adding $code... "
  curl -s -X POST http://localhost:5000/api/courses \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$course" > /dev/null && echo "✅" || echo "⚠️"
done

# ==================== MECHANICAL ENGINEERING COURSES ====================
echo -e "\n🔧 Adding MECHANICAL ENGINEERING courses..."

me_courses=(
  '{"code":"ME101","title":"Engineering Drawing","creditUnits":2,"department":"Mechanical Engineering","faculty":"Engineering","level":100,"semester":"First"}'
  '{"code":"ME102","title":"Workshop Practice","creditUnits":2,"department":"Mechanical Engineering","faculty":"Engineering","level":100,"semester":"Second"}'
  '{"code":"ME201","title":"Thermodynamics","creditUnits":3,"department":"Mechanical Engineering","faculty":"Engineering","level":200,"semester":"First"}'
  '{"code":"ME202","title":"Fluid Mechanics","creditUnits":3,"department":"Mechanical Engineering","faculty":"Engineering","level":200,"semester":"First"}'
  '{"code":"ME203","title":"Strength of Materials","creditUnits":3,"department":"Mechanical Engineering","faculty":"Engineering","level":200,"semester":"Second"}'
  '{"code":"ME204","title":"Dynamics","creditUnits":3,"department":"Mechanical Engineering","faculty":"Engineering","level":200,"semester":"Second"}'
  '{"code":"ME301","title":"Heat Transfer","creditUnits":3,"department":"Mechanical Engineering","faculty":"Engineering","level":300,"semester":"First"}'
  '{"code":"ME302","title":"Machine Design","creditUnits":3,"department":"Mechanical Engineering","faculty":"Engineering","level":300,"semester":"First"}'
  '{"code":"ME303","title":"Manufacturing Processes","creditUnits":3,"department":"Mechanical Engineering","faculty":"Engineering","level":300,"semester":"Second"}'
  '{"code":"ME304","title":"Vibrations","creditUnits":3,"department":"Mechanical Engineering","faculty":"Engineering","level":300,"semester":"Second"}'
)

for course in "${me_courses[@]}"; do
  code=$(echo $course | grep -o '"code":"[^"]*"' | cut -d'"' -f4)
  echo -n "  Adding $code... "
  curl -s -X POST http://localhost:5000/api/courses \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$course" > /dev/null && echo "✅" || echo "⚠️"
done

# ==================== MEDICINE COURSES ====================
echo -e "\n🏥 Adding MEDICINE courses..."

med_courses=(
  '{"code":"MED101","title":"Human Anatomy I","creditUnits":3,"department":"Medicine and Surgery","faculty":"Medicine","level":100,"semester":"First"}'
  '{"code":"MED102","title":"Physiology I","creditUnits":3,"department":"Medicine and Surgery","faculty":"Medicine","level":100,"semester":"First"}'
  '{"code":"MED103","title":"Biochemistry","creditUnits":3,"department":"Medicine and Surgery","faculty":"Medicine","level":100,"semester":"Second"}'
  '{"code":"MED201","title":"Pathology","creditUnits":3,"department":"Medicine and Surgery","faculty":"Medicine","level":200,"semester":"First"}'
  '{"code":"MED202","title":"Pharmacology","creditUnits":3,"department":"Medicine and Surgery","faculty":"Medicine","level":200,"semester":"First"}'
  '{"code":"MED203","title":"Microbiology","creditUnits":3,"department":"Medicine and Surgery","faculty":"Medicine","level":200,"semester":"Second"}'
  '{"code":"MED301","title":"Internal Medicine","creditUnits":4,"department":"Medicine and Surgery","faculty":"Medicine","level":300,"semester":"First"}'
  '{"code":"MED302","title":"Surgery","creditUnits":4,"department":"Medicine and Surgery","faculty":"Medicine","level":300,"semester":"First"}'
  '{"code":"MED303","title":"Pediatrics","creditUnits":3,"department":"Medicine and Surgery","faculty":"Medicine","level":300,"semester":"Second"}'
  '{"code":"MED304","title":"Obstetrics","creditUnits":3,"department":"Medicine and Surgery","faculty":"Medicine","level":300,"semester":"Second"}'
)

for course in "${med_courses[@]}"; do
  code=$(echo $course | grep -o '"code":"[^"]*"' | cut -d'"' -f4)
  echo -n "  Adding $code... "
  curl -s -X POST http://localhost:5000/api/courses \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$course" > /dev/null && echo "✅" || echo "⚠️"
done

# ==================== BUSINESS ADMINISTRATION COURSES ====================
echo -e "\n📊 Adding BUSINESS ADMINISTRATION courses..."

bus_courses=(
  '{"code":"BUS101","title":"Principles of Management","creditUnits":3,"department":"Business Administration","faculty":"Business","level":100,"semester":"First"}'
  '{"code":"BUS102","title":"Business Mathematics","creditUnits":3,"department":"Business Administration","faculty":"Business","level":100,"semester":"First"}'
  '{"code":"BUS103","title":"Introduction to Accounting","creditUnits":3,"department":"Business Administration","faculty":"Business","level":100,"semester":"Second"}'
  '{"code":"BUS201","title":"Marketing Principles","creditUnits":3,"department":"Business Administration","faculty":"Business","level":200,"semester":"First"}'
  '{"code":"BUS202","title":"Organizational Behavior","creditUnits":3,"department":"Business Administration","faculty":"Business","level":200,"semester":"First"}'
  '{"code":"BUS203","title":"Business Law","creditUnits":3,"department":"Business Administration","faculty":"Business","level":200,"semester":"Second"}'
  '{"code":"BUS204","title":"Human Resource Management","creditUnits":3,"department":"Business Administration","faculty":"Business","level":200,"semester":"Second"}'
  '{"code":"BUS301","title":"Financial Management","creditUnits":3,"department":"Business Administration","faculty":"Business","level":300,"semester":"First"}'
  '{"code":"BUS302","title":"Strategic Management","creditUnits":3,"department":"Business Administration","faculty":"Business","level":300,"semester":"First"}'
  '{"code":"BUS303","title":"Entrepreneurship","creditUnits":3,"department":"Business Administration","faculty":"Business","level":300,"semester":"Second"}'
  '{"code":"BUS304","title":"International Business","creditUnits":3,"department":"Business Administration","faculty":"Business","level":300,"semester":"Second"}'
)

for course in "${bus_courses[@]}"; do
  code=$(echo $course | grep -o '"code":"[^"]*"' | cut -d'"' -f4)
  echo -n "  Adding $code... "
  curl -s -X POST http://localhost:5000/api/courses \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$course" > /dev/null && echo "✅" || echo "⚠️"
done

# ==================== ENGLISH COURSES ====================
echo -e "\n📖 Adding ENGLISH courses..."

eng_courses=(
  '{"code":"ENG101","title":"Introduction to Literature","creditUnits":3,"department":"English","faculty":"Arts","level":100,"semester":"First"}'
  '{"code":"ENG102","title":"English Grammar","creditUnits":3,"department":"English","faculty":"Arts","level":100,"semester":"First"}'
  '{"code":"ENG103","title":"Composition I","creditUnits":2,"department":"English","faculty":"Arts","level":100,"semester":"Second"}'
  '{"code":"ENG201","title":"African Literature","creditUnits":3,"department":"English","faculty":"Arts","level":200,"semester":"First"}'
  '{"code":"ENG202","title":"American Literature","creditUnits":3,"department":"English","faculty":"Arts","level":200,"semester":"First"}'
  '{"code":"ENG203","title":"Shakespeare","creditUnits":3,"department":"English","faculty":"Arts","level":200,"semester":"Second"}'
  '{"code":"ENG204","title":"Creative Writing","creditUnits":3,"department":"English","faculty":"Arts","level":200,"semester":"Second"}'
  '{"code":"ENG301","title":"Modern Poetry","creditUnits":3,"department":"English","faculty":"Arts","level":300,"semester":"First"}'
  '{"code":"ENG302","title":"Literary Theory","creditUnits":3,"department":"English","faculty":"Arts","level":300,"semester":"First"}'
  '{"code":"ENG303","title":"Postcolonial Literature","creditUnits":3,"department":"English","faculty":"Arts","level":300,"semester":"Second"}'
)

for course in "${eng_courses[@]}"; do
  code=$(echo $course | grep -o '"code":"[^"]*"' | cut -d'"' -f4)
  echo -n "  Adding $code... "
  curl -s -X POST http://localhost:5000/api/courses \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$course" > /dev/null && echo "✅" || echo "⚠️"
done

# ==================== MATHEMATICS COURSES ====================
echo -e "\n🧮 Adding MATHEMATICS courses..."

math_courses=(
  '{"code":"MTH101","title":"Elementary Mathematics I","creditUnits":3,"department":"Mathematics","faculty":"Science","level":100,"semester":"First"}'
  '{"code":"MTH102","title":"Elementary Mathematics II","creditUnits":3,"department":"Mathematics","faculty":"Science","level":100,"semester":"Second"}'
  '{"code":"MTH201","title":"Calculus I","creditUnits":3,"department":"Mathematics","faculty":"Science","level":200,"semester":"First"}'
  '{"code":"MTH202","title":"Calculus II","creditUnits":3,"department":"Mathematics","faculty":"Science","level":200,"semester":"Second"}'
  '{"code":"MTH203","title":"Linear Algebra","creditUnits":3,"department":"Mathematics","faculty":"Science","level":200,"semester":"First"}'
  '{"code":"MTH204","title":"Differential Equations","creditUnits":3,"department":"Mathematics","faculty":"Science","level":200,"semester":"Second"}'
  '{"code":"MTH301","title":"Real Analysis","creditUnits":3,"department":"Mathematics","faculty":"Science","level":300,"semester":"First"}'
  '{"code":"MTH302","title":"Abstract Algebra","creditUnits":3,"department":"Mathematics","faculty":"Science","level":300,"semester":"First"}'
  '{"code":"MTH303","title":"Numerical Analysis","creditUnits":3,"department":"Mathematics","faculty":"Science","level":300,"semester":"Second"}'
  '{"code":"MTH304","title":"Complex Analysis","creditUnits":3,"department":"Mathematics","faculty":"Science","level":300,"semester":"Second"}'
)

for course in "${math_courses[@]}"; do
  code=$(echo $course | grep -o '"code":"[^"]*"' | cut -d'"' -f4)
  echo -n "  Adding $code... "
  curl -s -X POST http://localhost:5000/api/courses \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$course" > /dev/null && echo "✅" || echo "⚠️"
done

# ==================== SUMMARY ====================
echo -e "\n📊 FINAL SUMMARY"
echo "================="
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/courses | python3 -c "
import sys,json
data = json.load(sys.stdin)
print(f'Total courses in database: {data[\"total\"]}')
print('\nCourses by department:')
depts = {}
for course in data['courses']:
    depts[course['department']] = depts.get(course['department'], 0) + 1
for dept, count in sorted(depts.items()):
    print(f'  {dept}: {count} courses')
"

echo -e "\n✅ All courses added successfully!"
echo "Now you can test with different student accounts:"
echo "  • COM/22/1234 - Computer Science (Level 300)"
echo "  • ENG/22/4567 - Electrical Engineering (Level 300)"
echo "  • MED/22/7890 - Medicine (Level 400)"
echo "  • BUS/22/5678 - Business Admin (Level 300)"
