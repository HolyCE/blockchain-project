const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');

// Get all users with optional filters
router.get('/', auth, async (req, res) => {
  try {
    const { role, department, level, isActive } = req.query;
    
    // Build query
    const query = {};
    if (role) query.role = role;
    if (department) query.department = department;
    if (level) query.level = parseInt(level);
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    console.log('Fetching users with query:', query);
    
    // Get users
    const users = await User.find(query)
      .select('-password') // Exclude password
      .sort({ createdAt: -1 });
    
    console.log(`Found ${users.length} users`);
    
    res.json({
      success: true,
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update user
router.put('/:id', auth, async (req, res) => {
  try {
    // Check permissions
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Remove sensitive fields that shouldn't be updated directly
    const updateData = { ...req.body };
    delete updateData.password;
    delete updateData._id;
    delete updateData.__v;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
