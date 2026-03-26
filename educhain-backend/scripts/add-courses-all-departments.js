const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('../src/models/Course');
const User = require('../src/models/User');

// Departments with their details
const departments = [
  { name: 'Computer Science', code: 'CSC', faculty: 'Science' },
  { name: 'Electrical Engineering', code: 'EEE', faculty: 'Engineering' },
  { name: 'Mechanical Engineering', code: 'MEE', faculty: 'Engineering' },
  { name: 'Medicine and Surgery', code: 'MED', faculty: 'Medicine' },
  { name: 'Business Administration', code: 'BUS', faculty: 'Business' },
  { name: 'English', code: 'ENG', faculty: 'Arts' },
  { name: 'Mathematics', code: 'MTH', faculty: 'Science' },
  { name: 'Physics', code: 'PHY', faculty: 'Science' },
  { name: 'Chemistry', code: 'CHM', faculty: 'Science' },
  { name: 'Biology', code: 'BIO', faculty: 'Science' }
];

// Course titles by department
const courseTitles = {
  'Computer Science': [
    'Introduction to Programming', 'Object-Oriented Programming', 'Data Structures', 'Algorithms', 'Database Systems',
    'Operating Systems', 'Computer Networks', 'Software Engineering', 'Web Development', 'Artificial Intelligence',
    'Machine Learning', 'Cybersecurity', 'Cloud Computing', 'Mobile App Development', 'Human Computer Interaction',
    'Computer Graphics', 'Distributed Systems', 'Compiler Design', 'Computer Architecture', 'Parallel Computing'
  ],
  'Electrical Engineering': [
    'Circuit Theory', 'Digital Electronics', 'Signals and Systems', 'Control Systems', 'Power Systems',
    'Electrical Machines', 'Microprocessors', 'Communication Systems', 'Digital Signal Processing', 'Power Electronics',
    'Renewable Energy', 'Embedded Systems', 'Instrumentation', 'High Voltage Engineering', 'Electric Drives',
    'Optoelectronics', 'Microwave Engineering', 'Antenna Theory', 'VLSI Design', 'Power System Protection'
  ],
  'Mechanical Engineering': [
    'Engineering Mechanics', 'Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Machine Design',
    'Heat Transfer', 'Manufacturing Processes', 'Dynamics', 'Vibrations', 'Mechatronics',
    'Robotics', 'CAD/CAM', 'Refrigeration', 'Automobile Engineering', 'Materials Science',
    'Computational Fluid Dynamics', 'Finite Element Analysis', 'Industrial Engineering', 'Production Planning', 'Quality Control'
  ],
  'Medicine and Surgery': [
    'Human Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology',
    'Microbiology', 'Immunology', 'Internal Medicine', 'Surgery', 'Pediatrics',
    'Obstetrics and Gynecology', 'Psychiatry', 'Radiology', 'Anesthesiology', 'Orthopedics',
    'Ophthalmology', 'Otorhinolaryngology', 'Dermatology', 'Emergency Medicine', 'Community Medicine'
  ],
  'Business Administration': [
    'Principles of Management', 'Organizational Behavior', 'Marketing Management', 'Financial Accounting', 'Business Statistics',
    'Human Resource Management', 'Strategic Management', 'Operations Management', 'Entrepreneurship', 'Business Ethics',
    'International Business', 'Supply Chain Management', 'Project Management', 'Consumer Behavior', 'Corporate Finance',
    'Investment Analysis', 'Business Law', 'Leadership', 'Change Management', 'Business Analytics'
  ],
  'English': [
    'Introduction to Literature', 'English Grammar', 'Composition', 'African Literature', 'American Literature',
    'British Literature', 'Shakespeare', 'Creative Writing', 'Literary Theory', 'Postcolonial Literature',
    'Poetry', 'Drama', 'Fiction', 'Rhetoric', 'Linguistics',
    'Modern Literature', 'Victorian Literature', 'Romantic Poetry', 'Critical Analysis', 'World Literature'
  ],
  'Mathematics': [
    'Calculus I', 'Calculus II', 'Linear Algebra', 'Differential Equations', 'Real Analysis',
    'Complex Analysis', 'Abstract Algebra', 'Numerical Analysis', 'Probability Theory', 'Statistics',
    'Discrete Mathematics', 'Topology', 'Functional Analysis', 'Number Theory', 'Optimization Theory',
    'Graph Theory', 'Mathematical Modeling', 'Operations Research', 'Fourier Analysis', 'Dynamical Systems'
  ],
  'Physics': [
    'Mechanics', 'Electricity and Magnetism', 'Thermal Physics', 'Waves and Optics', 'Modern Physics',
    'Quantum Mechanics', 'Statistical Mechanics', 'Solid State Physics', 'Nuclear Physics', 'Astrophysics',
    'Electrodynamics', 'Mathematical Physics', 'Computational Physics', 'Plasma Physics', 'Particle Physics',
    'Condensed Matter Physics', 'Biophysics', 'Photonics', 'Nanotechnology', 'Relativity'
  ],
  'Chemistry': [
    'General Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry',
    'Biochemistry', 'Polymer Chemistry', 'Environmental Chemistry', 'Medicinal Chemistry', 'Industrial Chemistry',
    'Spectroscopy', 'Thermochemistry', 'Quantum Chemistry', 'Chemical Kinetics', 'Electrochemistry',
    'Organometallic Chemistry', 'Green Chemistry', 'Supramolecular Chemistry', 'Materials Chemistry', 'Forensic Chemistry'
  ],
  'Biology': [
    'Cell Biology', 'Genetics', 'Molecular Biology', 'Ecology', 'Evolutionary Biology',
    'Microbiology', 'Botany', 'Zoology', 'Physiology', 'Biotechnology',
    'Biochemistry', 'Marine Biology', 'Immunology', 'Neuroscience', 'Developmental Biology',
    'Conservation Biology', 'Bioinformatics', 'Virology', 'Parasitology', 'Environmental Biology'
  ]
};

// Levels for courses (100-600)
const levels = [100, 200, 300, 400, 500, 600];

// Semesters
const semesters = ['First', 'Second'];

// Helper to get random element
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function addCoursesForDepartment(department, coursesList) {
  let added = 0;
  let existing = 0;
  
  for (let i = 0; i < coursesList.length; i++) {
    const title = coursesList[i];
    const courseCode = `${department.code}${100 + i + 1}`;
    const level = levels[Math.floor(i / 4) % levels.length];
    const semester = i % 2 === 0 ? 'First' : 'Second';
    
    // Check if course already exists
    const existingCourse = await Course.findOne({ code: courseCode });
    if (!existingCourse) {
      const course = new Course({
        code: courseCode,
        title: title,
        creditUnits: [2, 3, 4][Math.floor(Math.random() * 3)],
        department: department.name,
        faculty: department.faculty,
        level: level,
        semester: semester,
        isActive: true,
        description: `${title} course for ${department.name} students at ${level} level`
      });
      await course.save();
      added++;
    } else {
      existing++;
    }
  }
  return { added, existing };
}

async function populateCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/result_upload_system');
    console.log('✅ Connected to MongoDB\n');
    console.log('📚 ADDING COURSES FOR ALL DEPARTMENTS\n');
    console.log('═══════════════════════════════════════════════════════\n');

    let totalAdded = 0;
    let totalExisting = 0;

    for (const dept of departments) {
      const coursesList = courseTitles[dept.name];
      if (coursesList) {
        console.log(`📖 ${dept.name} (${dept.code})`);
        const { added, existing } = await addCoursesForDepartment(dept, coursesList);
        totalAdded += added;
        totalExisting += existing;
        console.log(`   ✅ Added: ${added} new courses`);
        if (existing > 0) {
          console.log(`   ⚠️  Existing: ${existing} courses`);
        }
        console.log('');
      } else {
        console.log(`⚠️  No course list found for ${dept.name}\n`);
      }
    }

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 COURSE ADDITION SUMMARY');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`📚 Total Departments: ${departments.length}`);
    console.log(`✅ New Courses Added: ${totalAdded}`);
    console.log(`⚠️  Existing Courses: ${totalExisting}`);
    console.log(`📋 Total Courses in Database: ${totalAdded + totalExisting}`);
    
    // Verify by fetching counts
    const allCourses = await Course.find({});
    console.log(`\n🔍 Verification: ${allCourses.length} total courses in database`);
    
    // Group by department
    const deptCounts = {};
    for (const course of allCourses) {
      deptCounts[course.department] = (deptCounts[course.department] || 0) + 1;
    }
    
    console.log('\n📊 Courses by Department:');
    for (const [dept, count] of Object.entries(deptCounts).sort()) {
      console.log(`   ${dept}: ${count} courses`);
    }
    
    console.log('\n✅ Course population completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating courses:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

populateCourses();
