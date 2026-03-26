const mongoose = require('mongoose');
require('dotenv').config();

// Import models properly
const User = require('./src/models/User');
const ResultRequest = require('./src/models/ResultRequest');

async function checkCompletedResults() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');
        
        // Check all result requests
        const allRequests = await ResultRequest.find({})
            .populate('student', 'firstName lastName matricNumber email')
            .sort({ createdAt: -1 });
        
        console.log(`📊 Total Result Requests: ${allRequests.length}\n`);
        
        // Check by status
        const statuses = {};
        allRequests.forEach(r => {
            statuses[r.status] = (statuses[r.status] || 0) + 1;
        });
        
        console.log('Status Distribution:');
        Object.entries(statuses).forEach(([status, count]) => {
            console.log(`   ${status}: ${count}`);
        });
        
        // Find completed requests
        const completedRequests = await ResultRequest.find({ 
            status: 'completed' 
        }).populate('student', 'firstName lastName matricNumber');
        
        console.log(`\n✅ Completed Results: ${completedRequests.length}`);
        
        if (completedRequests.length === 0) {
            console.log('\n⚠️ No completed results found!');
            console.log('\nCreating a test completed result...');
            
            // Find a student
            const student = await User.findOne({ role: 'student' });
            if (!student) {
                console.log('❌ No student found. Creating a test student first...');
                
                // Create a test student
                const bcrypt = require('bcryptjs');
                const testStudent = new User({
                    firstName: 'Test',
                    lastName: 'Student',
                    email: 'student@test.com',
                    password: await bcrypt.hash('password123', 10),
                    matricNumber: 'TEST/2024/001',
                    role: 'student',
                    department: 'Computer Science',
                    faculty: 'Science',
                    level: 400,
                    isActive: true
                });
                
                await testStudent.save();
                console.log('✅ Created test student:', testStudent.email);
                
                // Create completed result with this student
                const completedRequest = new ResultRequest({
                    student: testStudent._id,
                    matricNumber: testStudent.matricNumber,
                    studentName: testStudent.fullName,
                    department: testStudent.department,
                    faculty: testStudent.faculty,
                    currentLevel: testStudent.level,
                    resultLevel: 400,
                    academicSession: '2023/2024',
                    semester: 'First',
                    status: 'completed',
                    completedAt: new Date(),
                    courses: [
                        {
                            courseCode: 'CSC401',
                            courseTitle: 'Software Engineering',
                            creditUnits: 3,
                            grade: 'A',
                            score: 85,
                            gradePoint: 4.0,
                            status: 'graded'
                        },
                        {
                            courseCode: 'CSC402',
                            courseTitle: 'Database Systems',
                            creditUnits: 3,
                            grade: 'B',
                            score: 75,
                            gradePoint: 3.0,
                            status: 'graded'
                        }
                    ],
                    finalResult: {
                        totalCredits: 6,
                        totalPoints: 21,
                        gpa: 3.5,
                        published: true,
                        publishedAt: new Date()
                    },
                    approvals: [
                        { role: 'school_officer', status: 'approved' },
                        { role: 'hod', status: 'approved' },
                        { role: 'course_advisor', status: 'approved' }
                    ],
                    history: [
                        {
                            action: 'Result completed',
                            comment: 'All grades submitted and verified',
                            timestamp: new Date()
                        }
                    ]
                });
                
                await completedRequest.save();
                console.log('✅ Created test completed result with ID:', completedRequest._id);
            } else {
                // Create completed result with existing student
                const completedRequest = new ResultRequest({
                    student: student._id,
                    matricNumber: student.matricNumber,
                    studentName: student.fullName,
                    department: student.department || 'Computer Science',
                    faculty: student.faculty || 'Science',
                    currentLevel: student.level || 400,
                    resultLevel: 400,
                    academicSession: '2023/2024',
                    semester: 'First',
                    status: 'completed',
                    completedAt: new Date(),
                    courses: [
                        {
                            courseCode: 'CSC401',
                            courseTitle: 'Software Engineering',
                            creditUnits: 3,
                            grade: 'A',
                            score: 85,
                            gradePoint: 4.0,
                            status: 'graded'
                        },
                        {
                            courseCode: 'CSC402',
                            courseTitle: 'Database Systems',
                            creditUnits: 3,
                            grade: 'B',
                            score: 75,
                            gradePoint: 3.0,
                            status: 'graded'
                        }
                    ],
                    finalResult: {
                        totalCredits: 6,
                        totalPoints: 21,
                        gpa: 3.5,
                        published: true,
                        publishedAt: new Date()
                    },
                    approvals: [
                        { role: 'school_officer', status: 'approved' },
                        { role: 'hod', status: 'approved' },
                        { role: 'course_advisor', status: 'approved' }
                    ],
                    history: [
                        {
                            action: 'Result completed',
                            comment: 'All grades submitted and verified',
                            timestamp: new Date()
                        }
                    ]
                });
                
                await completedRequest.save();
                console.log('✅ Created test completed result with ID:', completedRequest._id);
                console.log(`   Student: ${completedRequest.studentName}`);
                console.log(`   GPA: ${completedRequest.finalResult.gpa}`);
            }
            
            // Fetch again
            const newCompleted = await ResultRequest.find({ status: 'completed' });
            console.log(`\n📋 Now have ${newCompleted.length} completed result(s):`);
            newCompleted.forEach(r => {
                console.log(`   - ${r.studentName} (${r.matricNumber}) - GPA: ${r.finalResult?.gpa}`);
                console.log(`     Blockchain Published: ${r.blockchainHash ? '✅ Yes' : '❌ No'}`);
                console.log(`     ID: ${r._id}`);
            });
        } else {
            console.log('\n📋 Completed Results:');
            completedRequests.forEach(r => {
                console.log(`   - ${r.studentName} (${r.matricNumber}) - GPA: ${r.finalResult?.gpa}`);
                console.log(`     Blockchain Published: ${r.blockchainHash ? '✅ Yes' : '❌ No'}`);
                console.log(`     ID: ${r._id}`);
            });
        }
        
        await mongoose.disconnect();
        
    } catch (error) {
        console.error('Error:', error.message);
        console.error(error.stack);
    }
}

checkCompletedResults();
