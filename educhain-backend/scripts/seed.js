// seed.js
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

    // Create Admin
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

    // HOD
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

    // Lecturer
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

    // Course Advisor
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

    // School Officer
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

    // Students
    const students = [
      new User({
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
      }),
      new User({
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
      })
    ];

    for (const s of students) await s.save();

    // Courses - multiple departments and levels
    const courses = [
      // Computer Science 100-400
      { code: 'CSC101', title: 'Intro to CS', creditUnits: 3, department: 'Computer Science', faculty: 'Science', level: 100, semester: 'First', lecturers: [{ lecturerId: lecturer._id, lecturerName: 'Dr. Jane Smith', isPrimary: true }], courseAdvisor: { userId: advisor._id, name: 'Dr. Robert Johnson' } },
      { code: 'CSC201', title: 'Algorithms', creditUnits: 3, department: 'Computer Science', faculty: 'Science', level: 200, semester: 'First', lecturers: [{ lecturerId: lecturer._id, lecturerName: 'Dr. Jane Smith', isPrimary: true }] },
      { code: 'CSC301', title: 'Data Structures', creditUnits: 3, department: 'Computer Science', faculty: 'Science', level: 300, semester: 'First', lecturers: [{ lecturerId: lecturer._id, lecturerName: 'Dr. Jane Smith', isPrimary: true }] },
      { code: 'CSC401', title: 'Software Engineering', creditUnits: 3, department: 'Computer Science', faculty: 'Science', level: 400, semester: 'Second', lecturers: [{ lecturerId: lecturer._id, lecturerName: 'Dr. Jane Smith', isPrimary: true }] },

      // Mathematics
      { code: 'MAT101', title: 'Calculus I', creditUnits: 3, department: 'Mathematics', faculty: 'Science', level: 100, semester: 'First', lecturers: [{ lecturerId: lecturer._id, lecturerName: 'Dr. Jane Smith', isPrimary: true }] },
      { code: 'MAT201', title: 'Linear Algebra', creditUnits: 3, department: 'Mathematics', faculty: 'Science', level: 200, semester: 'Second', lecturers: [{ lecturerId: lecturer._id, lecturerName: 'Dr. Jane Smith', isPrimary: true }] },

      // Physics
      { code: 'PHY101', title: 'Mechanics', creditUnits: 3, department: 'Physics', faculty: 'Science', level: 100, semester: 'First', lecturers: [{ lecturerId: lecturer._id, lecturerName: 'Dr. Jane Smith', isPrimary: true }] },

      // Engineering
      { code: 'ENG101', title: 'Intro to Electrical Eng', creditUnits: 3, department: 'Electrical Engineering', faculty: 'Engineering', level: 100, semester: 'First', lecturers: [{ lecturerId: lecturer._id, lecturerName: 'Dr. Jane Smith', isPrimary: true }] }
    ];

    for (const courseData of courses) {
      const course = new Course(courseData);
      await course.save();
      console.log(`📖 Created course: ${courseData.code} - ${courseData.title}`);
    }

    console.log('\n✅ Database seeding completed!');
    console.log('\n📋 Sample login credentials:');
    console.log('Admin: admin@university.edu / admin123');
    console.log('HOD: hod@cs.university.edu / hod123');
    console.log('Lecturer: jane.smith@cs.university.edu / lecturer123');
    console.log('Course Advisor: robert.johnson@cs.university.edu / advisor123');
    console.log('School Officer: sarah.wilson@university.edu / officer123');
    console.log('Student 1: alice.williams@student.university.edu / student123');
    console.log('Student 2: bob.brown@student.university.edu / student123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\n⚠️  Script terminated by user');
  await mongoose.connection.close();
  process.exit(0);
});

seedDatabase();