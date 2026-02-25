const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  title: {
    type: String,
    required: true
  },
  creditUnits: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  department: {
    type: String,
    required: true
  },
  faculty: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  semester: {
    type: String,
    enum: ['First', 'Second', 'Rain'],
    required: true
  },
  lecturers: [{
    lecturerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lecturerName: String,
    isPrimary: {
      type: Boolean,
      default: true
    }
  }],
  courseAdvisor: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);