const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../src/models/User');

const departments = [
  { name: 'Computer Science', faculty: 'Science', code: 'CS' },
  { name: 'Electrical Engineering', faculty: 'Engineering', code: 'EE' },
  { name: 'Mechanical Engineering', faculty: 'Engineering', code: 'ME' },
  { name: 'Medicine and Surgery', faculty: 'Medicine', code: 'MED' },
  { name: 'Business Administration', faculty: 'Business', code: 'BUS' },
  { name: 'English', faculty: 'Arts', code: 'ENG' },
  { name: 'Mathematics', faculty: 'Science', code: 'MTH' },
  { name: 'Physics', faculty: 'Science', code: 'PHY' },
  { name: 'Chemistry', faculty: 'Science', code: 'CHM' },
  { name: 'Biology', faculty: 'Science', code: 'BIO' }
];

const advisorNames = [
  { first: 'Dr. Michael', last: 'Okpara' },
  { first: 'Prof. Grace', last: 'Nnamdi' },
  { first: 'Dr. Peter', last: 'Obi' },
  { first: 'Dr. Stella', last: 'Okeke' },
  { first: 'Prof. Tony', last: 'Ezeh' }
];

async function createCourseAdvisors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/result_upload_system');
    console.log('✅ Connected to MongoDB\n');
    console.log('📚 CREATING COURSE ADVISORS FOR ALL DEPARTMENTS\n');
    console.log('═══════════════════════════════════════════════════════\n');

    let created = 0;
    let existing = 0;

    for (const dept of departments) {
      console.log(`📖 ${dept.name} Department:`);
      
      // Create 2 advisors per department
      for (let i = 0; i < 2; i++) {
        const advisor = advisorNames[(dept.name.length + i) % advisorNames.length];
        const email = `${advisor.first.toLowerCase()}.${advisor.last.toLowerCase()}@university.edu`.replace(/\s/g, '');
        
        // Check if advisor already exists
        const existingAdvisor = await User.findOne({ email });
        
        if (!existingAdvisor) {
          const advisorUser = new User({
            firstName: advisor.first,
            lastName: advisor.last,
            email: email,
            password: 'advisor123',
            role: 'course_advisor',
            department: dept.name,
            faculty: dept.faculty,
            staffId: `${dept.code}CA${String(i + 1).padStart(3, '0')}`,
            designation: 'Course Advisor',
            isActive: true
          });
          await advisorUser.save();
          created++;
          console.log(`   ✅ Created: ${advisor.first} ${advisor.last} (${email})`);
        } else {
          existing++;
          console.log(`   ⚠️ Already exists: ${advisor.first} ${advisor.last}`);
        }
      }
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 COURSE ADVISOR CREATION SUMMARY');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ New Course Advisors Created: ${created}`);
    console.log(`⚠️  Already Existing: ${existing}`);
    console.log(`📋 Total Course Advisors: ${created + existing}`);
    
    // List all course advisors
    console.log('\n🔍 ALL COURSE ADVISORS:');
    const allAdvisors = await User.find({ role: 'course_advisor' }).select('firstName lastName email department');
    for (const advisor of allAdvisors) {
      console.log(`   📌 ${advisor.firstName} ${advisor.lastName} - ${advisor.department}`);
      console.log(`      Email: ${advisor.email}`);
      console.log(`      Password: advisor123\n`);
    }
    
    console.log('✅ Course advisor creation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating course advisors:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

createCourseAdvisors();
