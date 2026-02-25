const mongoose = require('mongoose');

const resultRequestSchema = new mongoose.Schema({
  // Student Information
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matricNumber: {
    type: String,
    required: true,
    uppercase: true
  },
  studentName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  faculty: {
    type: String,
    required: true
  },
  
  // Academic Information
  currentLevel: {
    type: Number,
    required: true
  },
  resultLevel: {
    type: Number,
    required: true
  },
  semester: {
    type: String,
    enum: ['First', 'Second', 'Rain'],
    required: true
  },
  academicSession: {
    type: String,
    required: true,
    match: [/^\d{4}\/\d{4}$/, 'Please enter session in format: YYYY/YYYY']
  },
  
  // Course Information
  courses: [{
    courseCode: {
      type: String,
      required: true,
      uppercase: true
    },
    courseTitle: {
      type: String,
      required: true
    },
    creditUnits: {
      type: Number,
      required: true,
      min: 1,
      max: 6
    },
    lecturer: {
      name: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    // Grade details (to be filled by lecturer)
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F', 'P', null],
      default: null
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    gradePoint: {
      type: Number,
      min: 0,
      max: 5,
      default: null
    },
    // Status per course
    status: {
      type: String,
      enum: ['pending', 'graded', 'approved', 'rejected'],
      default: 'pending'
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    gradedAt: Date,
    lecturerComment: String
  }],
  
  // Supporting Documents
  attachments: [{
    filename: String,
    originalName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Workflow Status
  status: {
    type: String,
    enum: ['draft', 'submitted', 'department_review', 'lecturer_grading', 'hod_review', 'advisor_review', 'approved', 'rejected', 'completed'],
    default: 'draft'
  },
  
  // Approvals
  approvals: [{
    role: {
      type: String,
      enum: ['school_officer', 'hod', 'course_advisor', 'lecturer']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'reviewed']
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Rejection Information
  rejectionReason: String,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: Date,
  
  // Final Result
  finalResult: {
    totalCredits: Number,
    totalPoints: Number,
    gpa: Number,
    cgpa: Number,
    published: {
      type: Boolean,
      default: false
    },
    publishedAt: Date,
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Timestamps
  submittedAt: Date,
  completedAt: Date,
  
  // Audit Trail
  history: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for faster queries
resultRequestSchema.index({ matricNumber: 1, status: 1 });
resultRequestSchema.index({ department: 1, status: 1 });
resultRequestSchema.index({ 'courses.lecturer.userId': 1, status: 1 });

module.exports = mongoose.model('ResultRequest', resultRequestSchema);