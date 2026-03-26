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

const generateMatricNumber = (departmentCode, level, index) => {
  const year = new Date().getFullYear() % 100;
  return `${departmentCode}/${year}/${String(index).padStart(4, '0')}`;
};

const generateEmail = (firstName, lastName, domain) => {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
};

const studentNames = [
  { first: 'James', last: 'Wilson' }, { first: 'Mary', last: 'Johnson' }, { first: 'John', last: 'Brown' },
  { first: 'Patricia', last: 'Davis' }, { first: 'Robert', last: 'Miller' }, { first: 'Jennifer', last: 'Garcia' },
  { first: 'Michael', last: 'Rodriguez' }, { first: 'Linda', last: 'Martinez' }, { first: 'William', last: 'Hernandez' },
  { first: 'Elizabeth', last: 'Lopez' }, { first: 'David', last: 'Gonzalez' }, { first: 'Barbara', last: 'Wilson' },
  { first: 'Richard', last: 'Anderson' }, { first: 'Susan', last: 'Thomas' }, { first: 'Joseph', last: 'Taylor' }
];

const lecturerNames = [
  { first: 'Dr. Ade', last: 'Okafor' }, { first: 'Prof. Ngozi', last: 'Eze' }, { first: 'Dr. Chidi', last: 'Okonkwo' },
  { first: 'Prof. Ada', last: 'Nwosu' }, { first: 'Dr. Emeka', last: 'Ibe' }, { first: 'Dr. Funke', last: 'Adeyemi' },
  { first: 'Prof. Kunle', last: 'Balogun' }, { first: 'Dr. Simi', last: 'Ogunleye' }, { first: 'Dr. Tunde', last: 'Fashola' },
  { first: 'Prof. Bose', last: 'Adebayo' }
];

const advisorNames = [
  { first: 'Dr. Michael', last: 'Okpara' }, { first: 'Prof. Grace', last: 'Nnamdi' }, { first: 'Dr. Peter', last: 'Obi' },
  { first: 'Dr. Stella', last: 'Okeke' }, { first: 'Prof. Tony', last: 'Ezeh' }
];

const hodNames = [
  { first: 'Prof. Chukwuma', last: 'Maduabuchi' }, { first: 'Prof. Nkechi', last: 'Okoro' }, { first: 'Prof. Ifeanyi', last: 'Nwankwo' },
  { first: 'Prof. Amara', last: 'Okafor' }, { first: 'Prof. Emeka', last: 'Onyeka' }
];

const schoolOfficerNames = [
  { first: 'Mr. John', last: 'Williams' }, { first: 'Mrs. Sarah', last: 'Johnson' }, { first: 'Mr. Peter', last: 'Brown' },
  { first: 'Ms. Mary', last: 'Davis' }, { first: 'Dr. Robert', last: 'Miller' }
];

async function populateDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/result_upload_system');
    console.log('✅ Connected to MongoDB');
    console.log('📝 Starting database population...\n');

    // Clear existing users (optional - uncomment if you want to start fresh)
    // await User.deleteMany({ role: { $ne: 'admin' } });
    // console.log('🗑️  Cleared existing non-admin users\n');

    let created = {
      students: 0,
      lecturers: 0,
      courseAdvisors: 0,
      hods: 0,
      schoolOfficers: 0
    };

    // Create HODs for each department
    console.log('👨‍🏫 Creating HODs for each department...');
    for (let i = 0; i < departments.length; i++) {
      const dept = departments[i];
      const hod = hodNames[i % hodNames.length];
      const email = generateEmail(hod.first, hod.last, 'university.edu');
      
      const existing = await User.findOne({ email, role: 'hod' });
      if (!existing) {
        const hodUser = new User({
          firstName: hod.first,
          lastName: hod.last,
          email: email,
          password: 'hod123',
          role: 'hod',
          department: dept.name,
          faculty: dept.faculty,
          staffId: `${dept.code}HOD001`,
          designation: 'Head of Department',
          isActive: true
        });
        await hodUser.save();
        created.hods++;
        console.log(`   ✅ HOD for ${dept.name}: ${hod.first} ${hod.last}`);
      } else {
        console.log(`   ⚠️ HOD for ${dept.name} already exists`);
      }
    }

    // Create Course Advisors
    console.log('\n📚 Creating Course Advisors...');
    for (let i = 0; i < departments.length * 2; i++) {
      const dept = departments[i % departments.length];
      const advisor = advisorNames[i % advisorNames.length];
      const email = generateEmail(advisor.first, advisor.last, 'university.edu');
      
      const existing = await User.findOne({ email, role: 'course_advisor' });
      if (!existing) {
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
        created.courseAdvisors++;
        console.log(`   ✅ Course Advisor for ${dept.name}: ${advisor.first} ${advisor.last}`);
      }
    }

    // Create Lecturers (5 per department)
    console.log('\n👩‍🏫 Creating Lecturers...');
    for (let i = 0; i < departments.length * 5; i++) {
      const dept = departments[i % departments.length];
      const lecturer = lecturerNames[i % lecturerNames.length];
      const email = generateEmail(lecturer.first, lecturer.last, 'university.edu');
      
      const existing = await User.findOne({ email, role: 'lecturer' });
      if (!existing) {
        const lecturerUser = new User({
          firstName: lecturer.first,
          lastName: lecturer.last,
          email: email,
          password: 'lecturer123',
          role: 'lecturer',
          department: dept.name,
          faculty: dept.faculty,
          staffId: `${dept.code}LEC${String(i + 1).padStart(3, '0')}`,
          designation: 'Lecturer',
          isActive: true
        });
        await lecturerUser.save();
        created.lecturers++;
        if (i % 10 === 0) process.stdout.write('.');
      }
    }
    console.log(`\n   ✅ Created ${created.lecturers} lecturers`);

    // Create School Officers
    console.log('\n🏫 Creating School Officers...');
    for (let i = 0; i < schoolOfficerNames.length; i++) {
      const officer = schoolOfficerNames[i];
      const email = generateEmail(officer.first, officer.last, 'university.edu');
      
      const existing = await User.findOne({ email, role: 'school_officer' });
      if (!existing) {
        const officerUser = new User({
          firstName: officer.first,
          lastName: officer.last,
          email: email,
          password: 'officer123',
          role: 'school_officer',
          department: 'Administration',
          faculty: 'Administration',
          staffId: `SO${String(i + 1).padStart(3, '0')}`,
          designation: 'School Officer',
          isActive: true
        });
        await officerUser.save();
        created.schoolOfficers++;
        console.log(`   ✅ School Officer: ${officer.first} ${officer.last}`);
      }
    }

    // Create Students (10 per department)
    console.log('\n👨‍🎓 Creating Students...');
    for (let i = 0; i < departments.length * 10; i++) {
      const dept = departments[i % departments.length];
      const student = studentNames[i % studentNames.length];
      const level = [100, 200, 300, 400, 500][Math.floor(Math.random() * 5)];
      const matricNumber = generateMatricNumber(dept.code, level, i + 1);
      const email = generateEmail(student.first, student.last, 'student.university.edu');
      
      const existing = await User.findOne({ $or: [{ email }, { matricNumber }] });
      if (!existing) {
        const studentUser = new User({
          firstName: student.first,
          lastName: student.last,
          email: email,
          password: 'student123',
          role: 'student',
          department: dept.name,
          faculty: dept.faculty,
          level: level,
          matricNumber: matricNumber,
          program: `B.Sc ${dept.name}`,
          isActive: true
        });
        await studentUser.save();
        created.students++;
        if (i % 20 === 0) process.stdout.write('.');
      }
    }
    console.log(`\n   ✅ Created ${created.students} students`);

    // Summary
    console.log('\n📊 POPULATION SUMMARY');
    console.log('═══════════════════════════════════');
    console.log(`👨‍🏫 HODs: ${created.hods}`);
    console.log(`📚 Course Advisors: ${created.courseAdvisors}`);
    console.log(`👩‍🏫 Lecturers: ${created.lecturers}`);
    console.log(`🏫 School Officers: ${created.schoolOfficers}`);
    console.log(`👨‍🎓 Students: ${created.students}`);
    console.log(`📋 TOTAL: ${created.hods + created.courseAdvisors + created.lecturers + created.schoolOfficers + created.students} new users`);
    
    // Show sample accounts
    console.log('\n🔑 SAMPLE LOGIN CREDENTIALS:');
    console.log('═══════════════════════════════════');
    console.log('📌 HOD (Computer Science):');
    console.log('   Email: prof.chukwuma.maduabuchi@university.edu');
    console.log('   Password: hod123');
    console.log('\n📌 Course Advisor (Computer Science):');
    console.log('   Email: dr.michael.okpara@university.edu');
    console.log('   Password: advisor123');
    console.log('\n📌 Lecturer (Computer Science):');
    console.log('   Email: dr.ade.okafor@university.edu');
    console.log('   Password: lecturer123');
    console.log('\n📌 School Officer:');
    console.log('   Email: mr.john.williams@university.edu');
    console.log('   Password: officer123');
    console.log('\n📌 Student (Computer Science):');
    console.log('   Email: james.wilson@student.university.edu');
    console.log('   Matric: CS/24/0001');
    console.log('   Password: student123');

    console.log('\n✅ Database population completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating database:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

populateDatabase();
