const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('../src/models/Course');
const User = require('../src/models/User');

const departments = [
  { name: 'Computer Science', code: 'CSC' },
  { name: 'Electrical Engineering', code: 'EEE' },
  { name: 'Mechanical Engineering', code: 'MEE' },
  { name: 'Medicine and Surgery', code: 'MED' },
  { name: 'Business Administration', code: 'BUS' },
  { name: 'English', code: 'ENG' },
  { name: 'Mathematics', code: 'MTH' },
  { name: 'Physics', code: 'PHY' },
  { name: 'Chemistry', code: 'CHM' },
  { name: 'Biology', code: 'BIO' }
];

async function assignLecturers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/result_upload_system');
    console.log('✅ Connected to MongoDB\n');
    console.log('📚 ASSIGNING LECTURERS TO ALL COURSES\n');
    console.log('=' .repeat(60));

    let totalAssigned = 0;
    let totalSkipped = 0;

    for (const dept of departments) {
      // Get all lecturers in this department
      const lecturers = await User.find({ 
        role: 'lecturer', 
        department: dept.name,
        isActive: true 
      });

      if (lecturers.length === 0) {
        console.log(`\n⚠️ No lecturers found for ${dept.name}. Skipping...`);
        continue;
      }

      // Get all courses in this department
      const courses = await Course.find({ 
        department: dept.name,
        isActive: true 
      });

      console.log(`\n📖 ${dept.name}: Found ${courses.length} courses, ${lecturers.length} lecturers`);

      let assigned = 0;
      let alreadyAssigned = 0;

      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        
        // Skip if course already has lecturers
        if (course.lecturers && course.lecturers.length > 0) {
          alreadyAssigned++;
          continue;
        }

        // Assign a lecturer (round-robin distribution)
        const lecturer = lecturers[i % lecturers.length];
        
        course.lecturers = [{
          lecturerId: lecturer._id,
          lecturerName: lecturer.fullName || `${lecturer.firstName} ${lecturer.lastName}`,
          isPrimary: true
        }];
        
        await course.save();
        assigned++;
      }

      totalAssigned += assigned;
      totalSkipped += alreadyAssigned;
      console.log(`   ✅ Assigned: ${assigned} courses`);
      console.log(`   ⚠️ Already had lecturers: ${alreadyAssigned}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 ASSIGNMENT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Total courses assigned: ${totalAssigned}`);
    console.log(`⚠️ Already had lecturers: ${totalSkipped}`);
    console.log(`📚 Total courses processed: ${totalAssigned + totalSkipped}`);

    // Verify assignments
    console.log('\n🔍 VERIFICATION:');
    const allCourses = await Course.find({});
    const withLecturers = allCourses.filter(c => c.lecturers && c.lecturers.length > 0).length;
    console.log(`Courses with lecturers: ${withLecturers} / ${allCourses.length}`);

    console.log('\n✅ Lecturer assignment completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

assignLecturers();
