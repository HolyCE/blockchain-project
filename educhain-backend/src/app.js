const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const usersRoutes = require('./routes/users.routes');
const blockchainRoutes = require('./routes/blockchain.routes');
const authRoutes = require('./routes/auth.routes');
const resultRequestRoutes = require('./routes/resultRequest.routes');
const notificationRoutes = require('./routes/notification.routes');
const courseRoutes = require('./routes/course.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/result-requests', resultRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Result Upload System API is running' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;
