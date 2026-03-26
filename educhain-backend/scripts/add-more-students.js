const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../src/models/User');

const departments = [
  { name: 'Computer Science', code: 'CS', faculty: 'Science' },
  { name: 'Electrical Engineering', code: 'EE', faculty: 'Engineering' },
  { name: 'Mechanical Engineering', code: 'ME', faculty: 'Engineering' },
  { name: 'Medicine and Surgery', code: 'MED', faculty: 'Medicine' },
  { name: 'Business Administration', code: 'BUS', faculty: 'Business' },
  { name: 'English', code: 'ENG', faculty: 'Arts' },
  { name: 'Mathematics', code: 'MTH', faculty: 'Science' },
  { name: 'Physics', code: 'PHY', faculty: 'Science' },
  { name: 'Chemistry', code: 'CHM', faculty: 'Science' },
  { name: 'Biology', code: 'BIO', faculty: 'Science' }
];

// Extended student names to ensure variety
const studentNames = [
  { first: 'James', last: 'Wilson' }, { first: 'Mary', last: 'Johnson' }, { first: 'John', last: 'Brown' },
  { first: 'Patricia', last: 'Davis' }, { first: 'Robert', last: 'Miller' }, { first: 'Jennifer', last: 'Garcia' },
  { first: 'Michael', last: 'Rodriguez' }, { first: 'Linda', last: 'Martinez' }, { first: 'William', last: 'Hernandez' },
  { first: 'Elizabeth', last: 'Lopez' }, { first: 'David', last: 'Gonzalez' }, { first: 'Barbara', last: 'Wilson' },
  { first: 'Richard', last: 'Anderson' }, { first: 'Susan', last: 'Thomas' }, { first: 'Joseph', last: 'Taylor' },
  { first: 'Margaret', last: 'Moore' }, { first: 'Charles', last: 'Jackson' }, { first: 'Dorothy', last: 'Martin' },
  { first: 'Thomas', last: 'Lee' }, { first: 'Nancy', last: 'White' }, { first: 'Christopher', last: 'Harris' },
  { first: 'Karen', last: 'Clark' }, { first: 'Daniel', last: 'Lewis' }, { first: 'Betty', last: 'Robinson' },
  { first: 'Paul', last: 'Walker' }, { first: 'Sandra', last: 'Hall' }, { first: 'Mark', last: 'Allen' },
  { first: 'Ashley', last: 'Young' }, { first: 'Steven', last: 'King' }, { first: 'Kimberly', last: 'Wright' }
];

const generateMatricNumber = (departmentCode, level, index) => {
  const year = new Date().getFullYear() % 100;
  return `${departmentCode}/${year}/${String(index).padStart(4, '0')}`;
};

const generateEmail = (firstName, lastName, domain) => {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
};

async function addMissingStudents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/result_upload_system');
    console.log('✅ Connected to MongoDB\n');
    console.log('📝 ADDING MISSING STUDENTS TO EACH DEPARTMENT\n');
    console.log('═══════════════════════════════════════════════════════\n');

    let totalAdded = 0;
    let totalSkipped = 0;

    for (const dept of departments) {
      // Get current students in this department
      const existingStudents = await User.find({ 
        role: 'student', 
        department: dept.name 
      });
      
      const currentCount = existingStudents.length;
      const needed = 10 - currentCount;
      
      if (needed > 0) {
        console.log(`📖 ${dept.name}: Currently ${currentCount} students, need ${needed} more`);
        
        let added = 0;
        let nameIndex = 0;
        
        while (added < needed && nameIndex < studentNames.length) {
          const student = studentNames[(currentCount + added) % studentNames.length];
          const level = [100, 200, 300, 400, 500][Math.floor(Math.random() * 5)];
          const matricNumber = generateMatricNumber(dept.code, level, currentCount + added + 1);
          const email = generateEmail(student.first, student.last, 'student.university.edu');
          
          // Check if email or matric already exists
          const existing = await User.findOne({ 
            $or: [{ email }, { matricNumber }] 
          });
          
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
            added++;
            console.log(`   ✅ Added: ${student.first} ${student.last} (${matricNumber}) - Level ${level}`);
          }
          nameIndex++;
        }
        
        totalAdded += added;
        console.log(`   📊 Added ${added} new students to ${dept.name}\n`);
      } else {
        console.log(`✅ ${dept.name}: Already has ${currentCount} students (target met)\n`);
        totalSkipped += currentCount;
      }
    }

    // Final Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 STUDENT POPULATION SUMMARY');
    console.log('═══════════════════════════════════════════════════════');
    
    // Show final counts per department
    for (const dept of departments) {
      const count = await User.countDocuments({ role: 'student', department: dept.name });
      console.log(`📚 ${dept.name}: ${count} students`);
    }
    
    const totalStudents = await User.countDocuments({ role: 'student' });
    console.log(`\n🎓 TOTAL STUDENTS: ${totalStudents}`);
    console.log(`✅ New students added: ${totalAdded}`);
    
    console.log('\n✅ Student population completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding students:', error);
    process.exit(1);
  }
}

addMissingStudents();
