// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import '../styles/Login.css'; // Reuse existing styles

const Signup = () => {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    matricNumber: '',
    department: 'Computer Science',
    faculty: 'Science',
    level: '100',
    role: 'student',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const userData = {
      firstName: signUpData.firstName,
      lastName: signUpData.lastName,
      email: signUpData.email,
      matricNumber: signUpData.matricNumber,
      department: signUpData.department,
      faculty: signUpData.faculty,
      level: parseInt(signUpData.level),
      role: signUpData.role,
      password: signUpData.password
    };

    // ✅ Debug: Log the data being sent
    console.log('Submitting user data:', userData);

    try {
      setLoading(true);
      const result = await API.register(userData);
      setLoading(false);

      console.log('Registration result:', result); // ✅ Debug

      if (result.success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setLoading(false);
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-right">
        <div className="login-form-container">
          <h2>Create Account</h2>
          <p className="login-subtitle">Register as a new user</p>

          {error && (
            <div style={{ color: 'red', marginBottom: '12px', fontWeight: 'bold' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="two-column">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={signUpData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={signUpData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={signUpData.email}
                onChange={handleChange}
                placeholder="john.doe@student.university.edu"
                required
              />
            </div>

            <div className="form-group">
              <label>Matric Number *</label>
              <input
                type="text"
                name="matricNumber"
                value={signUpData.matricNumber}
                onChange={handleChange}
                placeholder="COM/26/9999"
                required
              />
            </div>

            <div className="two-column">
              <div className="form-group">
                <label>Department *</label>
                <select
                  name="department"
                  value={signUpData.department}
                  onChange={handleChange}
                  required
                  style={{ padding: '8px', borderRadius: '6px' }}
                >
                  <option value="">Select Department</option>
                  <optgroup label="Sciences">
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </optgroup>
                  <optgroup label="Engineering">
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </optgroup>
                </select>
              </div>

              <div className="form-group">
                <label>Level *</label>
                <select
                  name="level"
                  value={signUpData.level}
                  onChange={handleChange}
                  required
                  style={{ padding: '8px', borderRadius: '6px' }}
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
                onChange={handleChange}
                required
                style={{ padding: '8px', borderRadius: '6px' }}
              >
                <option value="Science">Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Arts">Arts</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Medicine">Medicine</option>
              </select>
            </div>

            <div className="form-group">
              <label>Role *</label>
              <select
                name="role"
                value={signUpData.role}
                onChange={handleChange}
                required
                style={{ padding: '8px', borderRadius: '6px' }}
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="hod">HOD</option>
                <option value="course_advisor">Course Advisor</option>
                <option value="school_officer">School Officer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="two-column">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={signUpData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={signUpData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p style={{ marginTop: '12px', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#3b82f6',
                fontWeight: 'bold',
                textDecoration: 'underline',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#2563eb'}
              onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;