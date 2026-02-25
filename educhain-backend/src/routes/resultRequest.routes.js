const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const ResultRequest = require('../models/ResultRequest');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { calculateGradePoint, calculateGPA } = require('../utils/helpers');

// ========== STUDENT ROUTES ==========

// Create new result request (draft)
router.post('/create', auth, authorize('student'), async (req, res) => {
  try {
    const student = req.user;
    
    const resultRequest = new ResultRequest({
      student: student._id,
      matricNumber: student.matricNumber,
      studentName: student.fullName,
      department: student.department,
      faculty: student.faculty,
      currentLevel: student.level,
      status: 'draft',
      history: [{
        action: 'Draft created',
        performedBy: student._id,
        comment: 'Initial draft created by student'
      }]
    });

    await resultRequest.save();

    res.status(201).json({
      message: 'Draft result request created',
      requestId: resultRequest._id,
      status: resultRequest.status,
      createdAt: resultRequest.createdAt
    });
  } catch (error) {
    console.error('Create draft error:', error);
    res.status(500).json({ message: 'Server error creating draft' });
  }
});

// Add courses to request
router.post('/:id/courses', auth, authorize('student'), async (req, res) => {
  try {
    const { id } = req.params;
    const { courses } = req.body;
    
    const resultRequest = await ResultRequest.findOne({
      _id: id,
      student: req.user._id,
      status: 'draft'
    });

    if (!resultRequest) {
      return res.status(404).json({ message: 'Draft not found or already submitted' });
    }

    // Validate courses
    for (const course of courses) {
      const courseData = await Course.findOne({ 
        code: course.courseCode.toUpperCase(),
        department: req.user.department,
        isActive: true
      });
      
      if (!courseData) {
        return res.status(400).json({ 
          message: `Course ${course.courseCode} not found in your department or is inactive` 
        });
      }

      // Get primary lecturer
      const primaryLecturer = courseData.lecturers.find(l => l.isPrimary);
      
      resultRequest.courses.push({
        courseCode: courseData.code,
        courseTitle: courseData.title,
        creditUnits: courseData.creditUnits,
        lecturer: {
          name: primaryLecturer?.lecturerName || 'Not Assigned',
          userId: primaryLecturer?.lecturerId
        }
      });
    }

    resultRequest.history.push({
      action: 'Courses added',
      performedBy: req.user._id,
      comment: `Added ${courses.length} course(s)`
    });

    await resultRequest.save();

    res.json({
      message: 'Courses added successfully',
      courses: resultRequest.courses,
      totalCourses: resultRequest.courses.length
    });
  } catch (error) {
    console.error('Add courses error:', error);
    res.status(500).json({ message: 'Server error adding courses' });
  }
});

// Submit result request
router.post('/:id/submit', auth, authorize('student'), async (req, res) => {
  try {
    const { id } = req.params;
    const { academicSession, semester, resultLevel } = req.body;

    const resultRequest = await ResultRequest.findOne({
      _id: id,
      student: req.user._id,
      status: 'draft'
    });

    if (!resultRequest) {
      return res.status(404).json({ message: 'Draft not found or already submitted' });
    }

    if (!resultRequest.courses || resultRequest.courses.length === 0) {
      return res.status(400).json({ message: 'Please add courses before submitting' });
    }

    if (!academicSession || !semester || !resultLevel) {
      return res.status(400).json({ message: 'Academic session, semester, and result level are required' });
    }

    // Update with submission details
    resultRequest.academicSession = academicSession;
    resultRequest.semester = semester;
    resultRequest.resultLevel = resultLevel;
    resultRequest.status = 'submitted';
    resultRequest.submittedAt = new Date();

    // Add initial approvals for workflow
    resultRequest.approvals = [
      {
        role: 'school_officer',
        status: 'pending'
      }
    ];

    resultRequest.history.push({
      action: 'Submitted for approval',
      performedBy: req.user._id,
      comment: `Submitted for ${semester} semester ${academicSession}`
    });

    await resultRequest.save();

    res.json({
      message: 'Result request submitted successfully',
      status: resultRequest.status,
      nextStep: 'Awaiting school officer review',
      submittedAt: resultRequest.submittedAt
    });
  } catch (error) {
    console.error('Submit request error:', error);
    res.status(500).json({ message: 'Server error submitting request' });
  }
});

// Get student's result requests
router.get('/student/my-requests', auth, authorize('student'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { student: req.user._id };
    if (status) query.status = status;

    const requests = await ResultRequest.find(query)
      .select('-history -approvals')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ResultRequest.countDocuments(query);

    res.json({
      requests,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error fetching requests' });
  }
});

// Get single request details
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const resultRequest = await ResultRequest.findById(id)
      .populate('student', 'firstName lastName email phone')
      .populate('courses.gradedBy', 'firstName lastName');

    if (!resultRequest) {
      return res.status(404).json({ message: 'Result request not found' });
    }

    // Check authorization
    if (req.user.role === 'student' && resultRequest.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      request: resultRequest
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ message: 'Server error fetching request' });
  }
});

// ========== SCHOOL OFFICER ROUTES ==========

// Get all pending requests for school officers
router.get('/school-officer/pending', auth, authorize('school_officer', 'admin'), async (req, res) => {
  try {
    const { department, faculty, page = 1, limit = 20 } = req.query;
    
    const query = { 
      status: 'submitted'
    };
    
    if (department) query.department = department;
    if (faculty) query.faculty = faculty;

    const requests = await ResultRequest.find(query)
      .populate('student', 'firstName lastName email phone')
      .sort({ submittedAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ResultRequest.countDocuments(query);

    res.json({
      requests,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ message: 'Server error fetching pending requests' });
  }
});

// School officer approve/reject request
router.post('/:id/school-officer-action', auth, authorize('school_officer', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comment } = req.body; // action: 'approve' or 'reject'

    const resultRequest = await ResultRequest.findById(id);
    
    if (!resultRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (resultRequest.status !== 'submitted') {
      return res.status(400).json({ message: 'Request is not in submitted status' });
    }

    if (action === 'approve') {
      resultRequest.status = 'department_review';
      resultRequest.approvals.push({
        role: 'school_officer',
        userId: req.user._id,
        status: 'approved',
        comment,
        date: new Date()
      });

      resultRequest.history.push({
        action: 'School officer approved',
        performedBy: req.user._id,
        comment: comment || 'Approved by school officer'
      });
    } else if (action === 'reject') {
      resultRequest.status = 'rejected';
      resultRequest.rejectionReason = comment;
      resultRequest.rejectedBy = req.user._id;
      resultRequest.rejectedAt = new Date();

      resultRequest.history.push({
        action: 'School officer rejected',
        performedBy: req.user._id,
        comment: comment || 'Rejected by school officer'
      });
    }

    await resultRequest.save();

    res.json({
      message: `Request ${action}d successfully`,
      status: resultRequest.status,
      updatedAt: resultRequest.updatedAt
    });
  } catch (error) {
    console.error('School officer action error:', error);
    res.status(500).json({ message: 'Server error processing action' });
  }
});

// ========== HOD ROUTES ==========

// Get department pending requests for HOD
router.get('/hod/pending', auth, authorize('hod'), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const requests = await ResultRequest.find({
      department: req.user.department,
      status: 'department_review'
    })
      .populate('student', 'firstName lastName matricNumber level')
      .sort({ submittedAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ResultRequest.countDocuments({
      department: req.user.department,
      status: 'department_review'
    });

    res.json({
      requests,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get HOD pending error:', error);
    res.status(500).json({ message: 'Server error fetching pending requests' });
  }
});

// HOD assign to course advisor
router.post('/:id/hod-action', auth, authorize('hod'), async (req, res) => {
  try {
    const { id } = req.params;
    const { courseAdvisorId, comment } = req.body;

    const resultRequest = await ResultRequest.findOne({
      _id: id,
      department: req.user.department,
      status: 'department_review'
    });

    if (!resultRequest) {
      return res.status(404).json({ message: 'Request not found or not in your department' });
    }

    const courseAdvisor = await User.findOne({ 
      _id: courseAdvisorId, 
      role: 'course_advisor',
      department: req.user.department 
    });
    
    if (!courseAdvisor) {
      return res.status(400).json({ message: 'Invalid course advisor or not in your department' });
    }

    resultRequest.status = 'advisor_review';
    resultRequest.approvals.push({
      role: 'hod',
      userId: req.user._id,
      status: 'approved',
      comment,
      date: new Date()
    });

    // Add course advisor approval placeholder
    resultRequest.approvals.push({
      role: 'course_advisor',
      userId: courseAdvisorId,
      status: 'pending'
    });

    resultRequest.history.push({
      action: 'HOD approved and forwarded to course advisor',
      performedBy: req.user._id,
      comment: comment || `Forwarded to ${courseAdvisor.fullName}`
    });

    await resultRequest.save();

    res.json({
      message: 'Request forwarded to course advisor',
      status: resultRequest.status,
      courseAdvisor: courseAdvisor.fullName
    });
  } catch (error) {
    console.error('HOD action error:', error);
    res.status(500).json({ message: 'Server error processing action' });
  }
});

// ========== COURSE ADVISOR ROUTES ==========

// Get advisor pending requests
router.get('/advisor/pending', auth, authorize('course_advisor'), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const requests = await ResultRequest.find({
      'approvals': {
        $elemMatch: {
          role: 'course_advisor',
          userId: req.user._id,
          status: 'pending'
        }
      },
      status: 'advisor_review'
    })
      .populate('student', 'firstName lastName matricNumber')
      .sort({ submittedAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ResultRequest.countDocuments({
      'approvals': {
        $elemMatch: {
          role: 'course_advisor',
          userId: req.user._id,
          status: 'pending'
        }
      },
      status: 'advisor_review'
    });

    res.json({
      requests,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get advisor pending error:', error);
    res.status(500).json({ message: 'Server error fetching pending requests' });
  }
});

// Course advisor assign to lecturers
router.post('/:id/advisor-action', auth, authorize('course_advisor'), async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const resultRequest = await ResultRequest.findById(id);
    
    if (!resultRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if this advisor is assigned to this request
    const advisorApproval = resultRequest.approvals.find(
      a => a.role === 'course_advisor' && a.userId.toString() === req.user._id.toString()
    );

    if (!advisorApproval || advisorApproval.status !== 'pending') {
      return res.status(403).json({ message: 'Not authorized to act on this request' });
    }

    // Update advisor approval
    advisorApproval.status = 'approved';
    advisorApproval.comment = comment;
    advisorApproval.date = new Date();

    // Assign to lecturers for grading
    resultRequest.status = 'lecturer_grading';

    // Create lecturer approvals
    const lecturerCourses = {};
    resultRequest.courses.forEach(course => {
      if (course.lecturer.userId) {
        if (!lecturerCourses[course.lecturer.userId]) {
          lecturerCourses[course.lecturer.userId] = [];
        }
        lecturerCourses[course.lecturer.userId].push(course.courseCode);
      }
    });

    // Add lecturer approvals
    for (const [lecturerId, courses] of Object.entries(lecturerCourses)) {
      resultRequest.approvals.push({
        role: 'lecturer',
        userId: lecturerId,
        status: 'pending',
        comment: `Courses: ${courses.join(', ')}`
      });
    }

    resultRequest.history.push({
      action: 'Course advisor approved and assigned to lecturers',
      performedBy: req.user._id,
      comment: comment || 'Assigned to respective lecturers for grading'
    });

    await resultRequest.save();

    res.json({
      message: 'Request assigned to lecturers for grading',
      status: resultRequest.status,
      assignedLecturers: Object.keys(lecturerCourses).length
    });
  } catch (error) {
    console.error('Advisor action error:', error);
    res.status(500).json({ message: 'Server error processing action' });
  }
});

// ========== LECTURER ROUTES ==========

// Get lecturer pending grading requests
router.get('/lecturer/pending-grading', auth, authorize('lecturer'), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // Find requests where lecturer needs to grade courses
    const requests = await ResultRequest.find({
      'approvals': {
        $elemMatch: {
          role: 'lecturer',
          userId: req.user._id,
          status: 'pending'
        }
      },
      status: 'lecturer_grading'
    })
      .populate('student', 'firstName lastName matricNumber')
      .sort({ submittedAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get only courses this lecturer needs to grade for each request
    const requestsWithCourses = await Promise.all(
      requests.map(async (request) => {
        const lecturerCourses = request.courses.filter(
          course => course.lecturer.userId?.toString() === req.user._id.toString()
        );
        
        return {
          ...request.toObject(),
          coursesToGrade: lecturerCourses
        };
      })
    );

    const total = await ResultRequest.countDocuments({
      'approvals': {
        $elemMatch: {
          role: 'lecturer',
          userId: req.user._id,
          status: 'pending'
        }
      },
      status: 'lecturer_grading'
    });

    res.json({
      requests: requestsWithCourses,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get pending grading error:', error);
    res.status(500).json({ message: 'Server error fetching pending grading' });
  }
});

// Lecturer submit grades
router.post('/:id/submit-grades', auth, authorize('lecturer'), async (req, res) => {
  try {
    const { id } = req.params;
    const { grades } = req.body; // Array of { courseCode, grade, score, comment }

    const resultRequest = await ResultRequest.findById(id);
    
    if (!resultRequest) {
      return res.status(404).json({ message: 'Result request not found' });
    }

    // Check if lecturer is assigned to grade for this request
    const lecturerApproval = resultRequest.approvals.find(
      a => a.role === 'lecturer' && 
           a.userId.toString() === req.user._id.toString() &&
           a.status === 'pending'
    );

    if (!lecturerApproval) {
      return res.status(403).json({ message: 'Not authorized to grade for this request' });
    }

    // Update grades for each course
    let allCoursesGraded = true;
    
    for (const gradeInfo of grades) {
      const course = resultRequest.courses.find(
        c => c.courseCode === gradeInfo.courseCode && 
             c.lecturer.userId?.toString() === req.user._id.toString()
      );

      if (course) {
        course.grade = gradeInfo.grade;
        course.score = gradeInfo.score;
        course.gradePoint = calculateGradePoint(gradeInfo.grade, gradeInfo.score);
        course.status = 'graded';
        course.gradedBy = req.user._id;
        course.gradedAt = new Date();
        course.lecturerComment = gradeInfo.comment;
      }
    }

    // Check if all courses for this lecturer are graded
    const lecturerCourses = resultRequest.courses.filter(
      c => c.lecturer.userId?.toString() === req.user._id.toString()
    );
    
    const allGraded = lecturerCourses.every(course => course.status === 'graded');
    
    if (allGraded) {
      // Update lecturer approval status
      lecturerApproval.status = 'approved';
      lecturerApproval.comment = 'All courses graded';
      lecturerApproval.date = new Date();

      resultRequest.history.push({
        action: 'Lecturer completed grading',
        performedBy: req.user._id,
        comment: `Graded ${lecturerCourses.length} course(s)`
      });

      // Check if all lecturers have completed grading
      const pendingLecturers = resultRequest.approvals.filter(
        a => a.role === 'lecturer' && a.status === 'pending'
      );

      if (pendingLecturers.length === 0) {
        // All lecturers done, move to final review
        resultRequest.status = 'hod_review';
      }
    }

    await resultRequest.save();

    res.json({
      message: 'Grades submitted successfully',
      allCoursesGraded: allGraded,
      nextStatus: resultRequest.status
    });
  } catch (error) {
    console.error('Submit grades error:', error);
    res.status(500).json({ message: 'Server error submitting grades' });
  }
});

// ========== FINAL APPROVAL & PUBLISHING ==========

// Get requests ready for final approval (HOD)
router.get('/hod/final-approval', auth, authorize('hod'), async (req, res) => {
  try {
    const requests = await ResultRequest.find({
      department: req.user.department,
      status: 'hod_review'
    })
      .populate('student', 'firstName lastName matricNumber')
      .sort({ submittedAt: 1 });

    res.json({
      requests,
      total: requests.length
    });
  } catch (error) {
    console.error('Get final approval error:', error);
    res.status(500).json({ message: 'Server error fetching final approval requests' });
  }
});

// HOD final approval and publish
router.post('/:id/final-approve', auth, authorize('hod'), async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, publishToStudent } = req.body;

    const resultRequest = await ResultRequest.findOne({
      _id: id,
      department: req.user.department,
      status: 'hod_review'
    });

    if (!resultRequest) {
      return res.status(404).json({ message: 'Request not found or not ready for final approval' });
    }

    // Check if all courses are graded
    const ungradedCourses = resultRequest.courses.filter(c => c.status !== 'graded');
    if (ungradedCourses.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot finalize: Some courses are not graded yet',
        ungradedCourses: ungradedCourses.map(c => ({ code: c.courseCode, title: c.courseTitle }))
      });
    }

    // Calculate final GPA
    const { totalCredits, totalPoints, gpa } = calculateGPA(resultRequest.courses);

    resultRequest.status = 'approved';
    resultRequest.finalResult = {
      totalCredits,
      totalPoints,
      gpa: gpa
    };

    // Add final approval
    resultRequest.approvals.push({
      role: 'hod_final',
      userId: req.user._id,
      status: 'approved',
      comment,
      date: new Date()
    });

    if (publishToStudent === true) {
      resultRequest.status = 'completed';
      resultRequest.finalResult.published = true;
      resultRequest.finalResult.publishedAt = new Date();
      resultRequest.finalResult.publishedBy = req.user._id;
      resultRequest.completedAt = new Date();
    }

    resultRequest.history.push({
      action: publishToStudent ? 'Final approval and published' : 'Final approval',
      performedBy: req.user._id,
      comment: comment || (publishToStudent ? 'Results published to student' : 'Approved, ready for publishing')
    });

    await resultRequest.save();

    res.json({
      message: publishToStudent ? 'Results published successfully' : 'Request approved, ready for publishing',
      status: resultRequest.status,
      gpa: resultRequest.finalResult.gpa,
      totalCredits: resultRequest.finalResult.totalCredits
    });
  } catch (error) {
    console.error('Final approve error:', error);
    res.status(500).json({ message: 'Server error processing final approval' });
  }
});

// ========== ADMIN ROUTES ==========

// Get all requests (admin)
router.get('/admin/all', auth, authorize('admin'), async (req, res) => {
  try {
    const { status, department, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (department) query.department = department;

    const requests = await ResultRequest.find(query)
      .populate('student', 'firstName lastName matricNumber department')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ResultRequest.countDocuments(query);

    res.json({
      requests,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ message: 'Server error fetching all requests' });
  }
});

// Delete request (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const resultRequest = await ResultRequest.findByIdAndDelete(req.params.id);
    
    if (!resultRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({
      message: 'Request deleted successfully',
      deletedId: resultRequest._id
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ message: 'Server error deleting request' });
  }
});

module.exports = router;