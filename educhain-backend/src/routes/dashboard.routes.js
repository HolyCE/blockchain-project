const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const ResultRequest = require('../models/ResultRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Course = require('../models/Course');

// Dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = req.user;
    let stats = {};

    switch (user.role) {
      case 'student':
        stats = await getStudentStats(user);
        break;
      case 'lecturer':
        stats = await getLecturerStats(user);
        break;
      case 'hod':
        stats = await getHODStats(user);
        break;
      case 'course_advisor':
        stats = await getCourseAdvisorStats(user);
        break;
      case 'school_officer':
        stats = await getSchoolOfficerStats(user);
        break;
      case 'admin':
        stats = await getAdminStats(user);
        break;
      default:
        stats = { message: 'No stats available for this role' };
    }

    // Get recent notifications
    const recentNotifications = await Notification.find({
      recipient: user._id,
      isRead: false
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      user: {
        id: user._id,
        name: user.fullName,
        role: user.role,
        department: user.department,
        faculty: user.faculty
      },
      stats,
      recentNotifications: recentNotifications.map(notif => ({
        id: notif._id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        createdAt: notif.createdAt,
        isRead: notif.isRead
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Server error fetching dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

async function getStudentStats(user) {
  const [
    totalRequests,
    pendingRequests,
    completedRequests,
    draftRequests,
    rejectedRequests
  ] = await Promise.all([
    ResultRequest.countDocuments({ student: user._id }),
    ResultRequest.countDocuments({ 
      student: user._id,
      status: { $in: ['submitted', 'department_review', 'lecturer_grading', 'hod_review', 'advisor_review'] }
    }),
    ResultRequest.countDocuments({ 
      student: user._id,
      status: 'completed'
    }),
    ResultRequest.countDocuments({ 
      student: user._id,
      status: 'draft'
    }),
    ResultRequest.countDocuments({ 
      student: user._id,
      status: 'rejected'
    })
  ]);

  return {
    totalRequests,
    pendingRequests,
    completedRequests,
    draftRequests,
    rejectedRequests,
    successRate: totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0
  };
}

async function getLecturerStats(user) {
  const [
    pendingGrading,
    totalGraded,
    assignedCourses
  ] = await Promise.all([
    ResultRequest.countDocuments({
      'courses.lecturer.userId': user._id,
      'status': 'lecturer_grading'
    }),
    ResultRequest.countDocuments({
      'courses.lecturer.userId': user._id,
      'courses.gradedBy': user._id
    }),
    Course.countDocuments({
      'lecturers.lecturerId': user._id,
      isActive: true
    })
  ]);

  return {
    pendingGrading,
    totalGraded,
    assignedCourses,
    completionRate: (pendingGrading + totalGraded) > 0 ? 
      Math.round((totalGraded / (pendingGrading + totalGraded)) * 100) : 0
  };
}

async function getHODStats(user) {
  const [
    departmentTotal,
    departmentPending,
    departmentCompleted,
    departmentStudents,
    departmentLecturers
  ] = await Promise.all([
    ResultRequest.countDocuments({ department: user.department }),
    ResultRequest.countDocuments({ 
      department: user.department,
      status: { $in: ['department_review', 'hod_review'] }
    }),
    ResultRequest.countDocuments({ 
      department: user.department,
      status: 'completed'
    }),
    User.countDocuments({ 
      department: user.department,
      role: 'student',
      isActive: true 
    }),
    User.countDocuments({ 
      department: user.department,
      role: 'lecturer',
      isActive: true 
    })
  ]);

  return {
    departmentTotal,
    departmentPending,
    departmentCompleted,
    departmentStudents,
    departmentLecturers,
    completionRate: departmentTotal > 0 ? 
      Math.round((departmentCompleted / departmentTotal) * 100) : 0
  };
}

async function getCourseAdvisorStats(user) {
  const [
    pendingReview,
    totalReviewed,
    assignedStudents
  ] = await Promise.all([
    ResultRequest.countDocuments({
      'approvals': {
        $elemMatch: {
          role: 'course_advisor',
          userId: user._id,
          status: 'pending'
        }
      },
      status: 'advisor_review'
    }),
    ResultRequest.countDocuments({
      'approvals': {
        $elemMatch: {
          role: 'course_advisor',
          userId: user._id,
          status: 'approved'
        }
      }
    }),
    User.countDocuments({
      department: user.department,
      role: 'student',
      isActive: true
    })
  ]);

  return {
    pendingReview,
    totalReviewed,
    assignedStudents,
    reviewRate: (pendingReview + totalReviewed) > 0 ?
      Math.round((totalReviewed / (pendingReview + totalReviewed)) * 100) : 0
  };
}

async function getSchoolOfficerStats(user) {
  const [
    pendingRequests,
    totalProcessed,
    allDepartments
  ] = await Promise.all([
    ResultRequest.countDocuments({ status: 'submitted' }),
    ResultRequest.countDocuments({
      'approvals': {
        $elemMatch: {
          role: 'school_officer',
          userId: user._id
        }
      }
    }),
    User.distinct('department', { role: 'student', isActive: true })
  ]);

  return {
    pendingRequests,
    totalProcessed,
    totalDepartments: allDepartments.length,
    departments: allDepartments
  };
}

async function getAdminStats(user) {
  const [
    totalRequests,
    pendingRequests,
    completedRequests,
    rejectedRequests,
    totalStudents,
    totalLecturers,
    totalHODs,
    totalCourses,
    activeDepartments
  ] = await Promise.all([
    ResultRequest.countDocuments({}),
    ResultRequest.countDocuments({ 
      status: { $in: ['submitted', 'department_review', 'lecturer_grading', 'hod_review', 'advisor_review'] }
    }),
    ResultRequest.countDocuments({ status: 'completed' }),
    ResultRequest.countDocuments({ status: 'rejected' }),
    User.countDocuments({ role: 'student', isActive: true }),
    User.countDocuments({ role: 'lecturer', isActive: true }),
    User.countDocuments({ role: 'hod', isActive: true }),
    Course.countDocuments({ isActive: true }),
    User.distinct('department', { role: 'student', isActive: true })
  ]);

  return {
    totalRequests,
    pendingRequests,
    completedRequests,
    rejectedRequests,
    totalStudents,
    totalLecturers,
    totalHODs,
    totalCourses,
    activeDepartments: activeDepartments.length,
    completionRate: totalRequests > 0 ? 
      Math.round((completedRequests / totalRequests) * 100) : 0
  };
}

// Get recent activities
router.get('/activities', auth, async (req, res) => {
  try {
    const user = req.user;
    let activities = [];

    switch (user.role) {
      case 'student':
        activities = await ResultRequest.find({ student: user._id })
          .select('status createdAt updatedAt')
          .sort({ updatedAt: -1 })
          .limit(10);
        break;
      case 'lecturer':
        activities = await ResultRequest.find({ 
          'courses.lecturer.userId': user._id,
          'courses.status': 'graded'
        })
          .select('matricNumber studentName courses.status updatedAt')
          .sort({ updatedAt: -1 })
          .limit(10);
        break;
      case 'hod':
      case 'admin':
        activities = await ResultRequest.find({ department: user.department })
          .select('matricNumber studentName status updatedAt')
          .sort({ updatedAt: -1 })
          .limit(10);
        break;
    }

    res.json({
      activities: activities.map(activity => ({
        id: activity._id,
        matricNumber: activity.matricNumber,
        studentName: activity.studentName,
        status: activity.status,
        updatedAt: activity.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error fetching activities' });
  }
});

module.exports = router;