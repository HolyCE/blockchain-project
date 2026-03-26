import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    matricNumber: '',
    department: 'Computer Science',
    faculty: 'Science',
    level: '100',
    password: '',
    confirmPassword: ''
  });

  const handleSignUpChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await API.login(identifier, password);
    setLoading(false);
    
    if (result.success) {
      onLogin(result.user);
    } else {
      setError(result.message || 'Invalid credentials');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const userData = {
      firstName: signUpData.firstName,
      lastName: signUpData.lastName,
      email: signUpData.email,
      password: signUpData.password,
      role: 'student',
      matricNumber: signUpData.matricNumber,
      department: signUpData.department,
      faculty: signUpData.faculty,
      level: parseInt(signUpData.level)
    };

    const result = await API.register(userData);
    setLoading(false);

    if (result.success) {
      alert('Registration successful! Please login.');
      setIsLoginMode(true);
      setSignUpData({
        firstName: '',
        lastName: '',
        email: '',
        matricNumber: '',
        department: 'Computer Science',
        faculty: 'Science',
        level: '100',
        password: '',
        confirmPassword: ''
      });
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h1>Result Upload System</h1>
          <p>{isLoginMode ? 'Secure Academic Records Management' : 'Create a Student Account'}</p>
        </div>
        <div className="login-footer">© 2026 University System</div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="role-tabs">
            <button 
              className={`role-tab ${isLoginMode ? 'active' : ''}`}
              onClick={() => setIsLoginMode(true)}
            >
              Sign In
            </button>
            <button 
              className={`role-tab ${!isLoginMode ? 'active' : ''}`}
              onClick={() => setIsLoginMode(false)}
            >
              Sign Up
            </button>
          </div>

          <h2>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="login-subtitle">
            {isLoginMode 
              ? 'Sign in with your email or matric number' 
              : 'Register as a new student'}
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {isLoginMode ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Email or Matric Number</label>
                <input
                  type="text"
                  placeholder="email@university.edu or COM/22/1234"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="signin-btn" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit}>
              <div className="two-column">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={signUpData.firstName}
                    onChange={handleSignUpChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={signUpData.lastName}
                    onChange={handleSignUpChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john.doe@student.university.edu"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Matric Number *</label>
                <input
                  type="text"
                  name="matricNumber"
                  placeholder="COM/22/1234"
                  value={signUpData.matricNumber}
                  onChange={handleSignUpChange}
                  required
                />
              </div>

              <div className="two-column">
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="department"
                    value={signUpData.department}
                    onChange={handleSignUpChange}
                    required
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Level *</label>
                  <select
                    name="level"
                    value={signUpData.level}
                    onChange={handleSignUpChange}
                    required
                  >
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                    <option value="600">600 Level</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Faculty *</label>
                <select
                  name="faculty"
                  value={signUpData.faculty}
                  onChange={handleSignUpChange}
                  required
                >
                  <option value="Science">Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Arts">Arts</option>
                  <option value="Social Sciences">Social Sciences</option>
                  <option value="Medicine">Medicine</option>
                </select>
              </div>

              <div className="two-column">
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={handleSignUpChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={signUpData.confirmPassword}
                    onChange={handleSignUpChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="signin-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
              ← Back to Home
            </button>
          </div>

          {/* Test Accounts - Uncomment if needed */}
          {/* {isLoginMode && (
            <div className="test-accounts">
              <p>Test Accounts</p>
              <ul>
                <li>👑 Admin: admin@university.edu / admin123</li>
                <li>🎓 Student: COM/22/1234 / student123</li>
                <li>👨‍🏫 Lecturer: jane.smith@cs.university.edu / lecturer123</li>
                <li>📚 HOD: hod@cs.university.edu / hod123</li>
              </ul>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Login;