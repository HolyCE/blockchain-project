const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  matricNumber: {
    type: String,
    uppercase: true,
    sparse: true
  },
  password: {
    type: String,
    required: true
  },
  
  // Role and Permissions
  role: {
    type: String,
    enum: ['student', 'lecturer', 'hod', 'course_advisor', 'school_officer', 'admin'],
    default: 'student'
  },
  
  // Academic Information (for students)
  department: String,
  faculty: String,
  level: Number,
  program: String, // e.g., B.Sc Computer Science
  
  // Staff Information (for lecturers/staff)
  staffId: String,
  designation: String,
  courses: [{
    code: String,
    title: String,
    department: String
  }],
  
  // Contact Information
  phone: String,
  
  // Settings
  emailNotifications: {
    type: Boolean,
    default: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  
  // Profile
  profilePicture: String,
  
  // Verification
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user by matric number (for students)
userSchema.statics.findByMatric = function(matricNumber) {
  return this.findOne({ matricNumber, role: 'student' });
};

module.exports = mongoose.model('User', userSchema);