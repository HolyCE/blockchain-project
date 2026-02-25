const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');

// Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const { department, level, semester, lecturer, active } = req.query;
    
    const query = {};
    
    // Filter by active status
    if (active !== undefined) {
      query.isActive = active === 'true';
    } else {
      query.isActive = true;
    }
    
    if (department) query.department = department;
    if (level) query.level = parseInt(level);
    if (semester) query.semester = semester;
    if (lecturer) {
      query['lecturers.lecturerId'] = lecturer;
    }

    const courses = await Course.find(query)
      .populate('lecturers.lecturerId', 'firstName lastName email staffId')
      .populate('courseAdvisor.userId', 'firstName lastName email')
      .sort({ level: 1, code: 1 });

    res.json({
      courses: courses.map(course => ({
        id: course._id,
        code: course.code,
        title: course.title,
        creditUnits: course.creditUnits,
        department: course.department,
        faculty: course.faculty,
        level: course.level,
        semester: course.semester,
        lecturers: course.lecturers,
        courseAdvisor: course.courseAdvisor,
        isActive: course.isActive,
        description: course.description,
        createdAt: course.createdAt
      })),
      total: courses.length
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ 
      message: 'Server error fetching courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get course by code
router.get('/:code', auth, async (req, res) => {
  try {
    const course = await Course.findOne({ 
      code: req.params.code.toUpperCase()
    })
      .populate('lecturers.lecturerId', 'firstName lastName email staffId designation')
      .populate('courseAdvisor.userId', 'firstName lastName email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ 
      course: {
        id: course._id,
        code: course.code,
        title: course.title,
        creditUnits: course.creditUnits,
        department: course.department,
        faculty: course.faculty,
        level: course.level,
        semester: course.semester,
        lecturers: course.lecturers,
        courseAdvisor: course.courseAdvisor,
        isActive: course.isActive,
        description: course.description,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error fetching course' });
  }
});

// Create new course (Admin/HOD only)
router.post('/', auth, authorize('admin', 'hod'), async (req, res) => {
  try {
    const { code, title, creditUnits, department, faculty, level, semester, lecturers, courseAdvisor } = req.body;

    // Check if course already exists
    const existingCourse = await Course.findOne({ code: code.toUpperCase() });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this code already exists' });
    }

    // Validate lecturers
    const validatedLecturers = [];
    if (lecturers && Array.isArray(lecturers)) {
      for (const lecturer of lecturers) {
        const lecturerUser = await User.findById(lecturer.lecturerId);
        if (!lecturerUser || lecturerUser.role !== 'lecturer') {
          return res.status(400).json({ 
            message: `Invalid lecturer ID: ${lecturer.lecturerId}` 
          });
        }
        validatedLecturers.push({
          lecturerId: lecturer.lecturerId,
          lecturerName: lecturerUser.fullName,
          isPrimary: lecturer.isPrimary || false
        });
      }
    }

    // Validate course advisor if provided
    let validatedAdvisor = null;
    if (courseAdvisor && courseAdvisor.userId) {
      const advisorUser = await User.findById(courseAdvisor.userId);
      if (!advisorUser || advisorUser.role !== 'course_advisor') {
        return res.status(400).json({ 
          message: 'Invalid course advisor ID' 
        });
      }
      validatedAdvisor = {
        userId: advisorUser._id,
        name: advisorUser.fullName
      };
    }

    const course = new Course({
      code: code.toUpperCase(),
      title,
      creditUnits,
      department,
      faculty,
      level,
      semester,
      lecturers: validatedLecturers,
      courseAdvisor: validatedAdvisor,
      isActive: true
    });

    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course: course.toObject()
    });
  } catch (error) {
    console.error('Create course error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Course with this code already exists' });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Server error creating course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update course
router.put('/:id', auth, authorize('admin', 'hod'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        course[key] = req.body[key];
      }
    });

    // Ensure code is uppercase
    if (req.body.code) {
      course.code = req.body.code.toUpperCase();
    }

    await course.save();

    res.json({
      message: 'Course updated successfully',
      course: course.toObject()
    });
  } catch (error) {
    console.error('Update course error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Course with this code already exists' });
    }
    
    res.status(500).json({ 
      message: 'Server error updating course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Assign lecturer to course
router.post('/:id/lecturers', auth, authorize('admin', 'hod'), async (req, res) => {
  try {
    const { lecturerId, isPrimary = false } = req.body;

    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if lecturer exists and is actually a lecturer
    const lecturerUser = await User.findById(lecturerId);
    if (!lecturerUser || lecturerUser.role !== 'lecturer') {
      return res.status(400).json({ message: 'Invalid lecturer ID' });
    }

    // Check if lecturer already assigned
    const existingLecturer = course.lecturers.find(
      l => l.lecturerId.toString() === lecturerId
    );

    if (existingLecturer) {
      return res.status(400).json({ message: 'Lecturer already assigned to this course' });
    }

    // Add lecturer
    course.lecturers.push({
      lecturerId,
      lecturerName: lecturerUser.fullName,
      isPrimary
    });

    // If this is primary, unset primary for others
    if (isPrimary) {
      course.lecturers.forEach(l => {
        if (l.lecturerId.toString() !== lecturerId) {
          l.isPrimary = false;
        }
      });
    }

    await course.save();

    res.json({
      message: 'Lecturer assigned successfully',
      course: course.toObject()
    });
  } catch (error) {
    console.error('Assign lecturer error:', error);
    res.status(500).json({ 
      message: 'Server error assigning lecturer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Remove lecturer from course
router.delete('/:id/lecturers/:lecturerId', auth, authorize('admin', 'hod'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const initialLength = course.lecturers.length;
    course.lecturers = course.lecturers.filter(
      l => l.lecturerId.toString() !== req.params.lecturerId
    );

    if (course.lecturers.length === initialLength) {
      return res.status(404).json({ message: 'Lecturer not found in this course' });
    }

    await course.save();

    res.json({
      message: 'Lecturer removed successfully',
      course: course.toObject()
    });
  } catch (error) {
    console.error('Remove lecturer error:', error);
    res.status(500).json({ message: 'Server error removing lecturer' });
  }
});

// Toggle course active status
router.patch('/:id/status', auth, authorize('admin', 'hod'), async (req, res) => {
  try {
    const { isActive } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      message: `Course ${isActive ? 'activated' : 'deactivated'} successfully`,
      course: course.toObject()
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({ message: 'Server error updating course status' });
  }
});

// Get courses by department
router.get('/department/:department', auth, async (req, res) => {
  try {
    const { level, semester } = req.query;
    
    const query = { 
      department: req.params.department,
      isActive: true 
    };
    
    if (level) query.level = parseInt(level);
    if (semester) query.semester = semester;

    const courses = await Course.find(query)
      .select('code title creditUnits level semester lecturers')
      .sort({ level: 1, code: 1 });

    res.json({
      courses,
      total: courses.length
    });
  } catch (error) {
    console.error('Get department courses error:', error);
    res.status(500).json({ message: 'Server error fetching department courses' });
  }
});

module.exports = router;