const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../src/models/User');
const Course = require('../src/models/Course');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/result_upload_system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin user
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@university.edu',
      password: 'admin123',
      role: 'admin',
      department: 'Administration',
      faculty: 'Administration',
      staffId: 'ADM001'
    });
    await admin.save();
    console.log('👑 Created admin user');

    // Create HOD user
    const hod = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'hod@cs.university.edu',
      password: 'hod123',
      role: 'hod',
      department: 'Computer Science',
      faculty: 'Science',
      staffId: 'CS001',
      designation: 'Head of Department'
    });
    await hod.save();
    console.log('👨‍🏫 Created HOD user');

    // Create Lecturer user
    const lecturer = new User({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@cs.university.edu',
      password: 'lecturer123',
      role: 'lecturer',
      department: 'Computer Science',
      faculty: 'Science',
      staffId: 'CS002',
      designation: 'Senior Lecturer'
    });
    await lecturer.save();
    console.log('👩‍🏫 Created lecturer user');

    // Create Course Advisor
    const advisor = new User({
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@cs.university.edu',
      password: 'advisor123',
      role: 'course_advisor',
      department: 'Computer Science',
      faculty: 'Science',
      staffId: 'CS003',
      designation: 'Course Advisor'
    });
    await advisor.save();
    console.log('📚 Created course advisor user');

    // Create School Officer
    const schoolOfficer = new User({
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@university.edu',
      password: 'officer123',
      role: 'school_officer',
      department: 'Administration',
      faculty: 'Administration',
      staffId: 'ADM002',
      designation: 'School Officer'
    });
    await schoolOfficer.save();
    console.log('🏫 Created school officer user');

    // Create Student user
    const student = new User({
      firstName: 'Alice',
      lastName: 'Williams',
      email: 'alice.williams@student.university.edu',
      password: 'student123',
      role: 'student',
      matricNumber: 'COM/22/1234',
      department: 'Computer Science',
      faculty: 'Science',
      level: 300,
      program: 'B.Sc Computer Science'
    });
    await student.save();
    console.log('👩‍🎓 Created student user');

    // Create another Student
    const student2 = new User({
      firstName: 'Bob',
      lastName: 'Brown',
      email: 'bob.brown@student.university.edu',
      password: 'student123',
      role: 'student',
      matricNumber: 'COM/22/1235',
      department: 'Computer Science',
      faculty: 'Science',
      level: 300,
      program: 'B.Sc Computer Science'
    });
    await student2.save();
    console.log('👨‍🎓 Created second student user');

    // Create Courses
    const courses = [
      {
        code: 'CSC301',
        title: 'Data Structures and Algorithms',
        creditUnits: 3,
        department: 'Computer Science',
        faculty: 'Science',
        level: 300,
        semester: 'First',
        lecturers: [{
          lecturerId: lecturer._id,
          lecturerName: 'Dr. Jane Smith',
          isPrimary: true
        }],
        courseAdvisor: {
          userId: advisor._id,
          name: 'Dr. Robert Johnson'
        },
        description: 'Advanced data structures and algorithm analysis'
      },
      {
        code: 'CSC302',
        title: 'Database Management Systems',
        creditUnits: 3,
        department: 'Computer Science',
        faculty: 'Science',
        level: 300,
        semester: 'First',
        lecturers: [{
          lecturerId: lecturer._id,
          lecturerName: 'Dr. Jane Smith',
          isPrimary: true
        }],
        description: 'Introduction to database systems and SQL'
      },
      {
        code: 'CSC303',
        title: 'Computer Networks',
        creditUnits: 3,
        department: 'Computer Science',
        faculty: 'Science',
        level: 300,
        semester: 'Second',
        lecturers: [{
          lecturerId: lecturer._id,
          lecturerName: 'Dr. Jane Smith',
          isPrimary: true
        }],
        description: 'Fundamentals of computer networking'
      },
      {
        code: 'CSC304',
        title: 'Software Engineering',
        creditUnits: 3,
        department: 'Computer Science',
        faculty: 'Science',
        level: 300,
        semester: 'Second',
        lecturers: [{
          lecturerId: lecturer._id,
          lecturerName: 'Dr. Jane Smith',
          isPrimary: true
        }],
        description: 'Software development methodologies and practices'
      },
      {
        code: 'MAT101',
        title: 'Calculus I',
        creditUnits: 3,
        department: 'Mathematics',
        faculty: 'Science',
        level: 100,
        semester: 'First',
        lecturers: [{
          lecturerId: lecturer._id,
          lecturerName: 'Dr. Jane Smith',
          isPrimary: true
        }],
        description: 'Introduction to differential calculus'
      }
    ];

    for (const courseData of courses) {
      const course = new Course(courseData);
      await course.save();
      console.log(`📖 Created course: ${courseData.code} - ${courseData.title}`);
    }

    console.log('\n✅ Database seeding completed!');
    console.log('\n📋 Login Credentials:');
    console.log('====================');
    console.log('Admin: admin@university.edu / admin123');
    console.log('HOD: hod@cs.university.edu / hod123');
    console.log('Lecturer: jane.smith@cs.university.edu / lecturer123');
    console.log('Course Advisor: robert.johnson@cs.university.edu / advisor123');
    console.log('School Officer: sarah.wilson@university.edu / officer123');
    console.log('Student 1: alice.williams@student.university.edu / student123');
    console.log('Student 2: bob.brown@student.university.edu / student123');
    console.log('\n🚀 Run: npm run dev to start the server');
    console.log('🌐 API will be available at: http://localhost:5000');
    console.log('📊 Health check: http://localhost:5000/api/health');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Handle script termination
process.on('SIGINT', async () => {
  console.log('\n⚠️  Script terminated by user');
  await mongoose.connection.close();
  process.exit(0);
});

seedDatabase();