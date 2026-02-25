import React, { useState } from 'react';
import API from '../services/api';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up form state
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
      console.log('✅ Login successful! Token stored');
      onLogin(result.user);
    } else {
      console.error('❌ Login failed:', result);
      
      // Show more detailed error message
      if (result.errors) {
        const errorMessages = result.errors.map(err => err.msg).join(', ');
        setError(errorMessages);
      } else {
        setError(result.message || 'Invalid credentials');
      }
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
        <div className="login-brand">
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
              ? 'Sign in with your email address' 
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
                <label>Email address</label>
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
                    <option value="">Select Department</option>
                    {/* Sciences */}
                    <optgroup label="Sciences">
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Biochemistry">Biochemistry</option>
                      <option value="Microbiology">Microbiology</option>
                      <option value="Geology">Geology</option>
                      <option value="Statistics">Statistics</option>
                      <option value="Industrial Chemistry">Industrial Chemistry</option>
                      <option value="Environmental Science">Environmental Science</option>
                      <option value="Food Science">Food Science</option>
                      <option value="Biotechnology">Biotechnology</option>
                    </optgroup>
                    
                    {/* Engineering */}
                    <optgroup label="Engineering">
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Electronic Engineering">Electronic Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Chemical Engineering">Chemical Engineering</option>
                      <option value="Biomedical Engineering">Biomedical Engineering</option>
                      <option value="Aerospace Engineering">Aerospace Engineering</option>
                      <option value="Petroleum Engineering">Petroleum Engineering</option>
                      <option value="Agricultural Engineering">Agricultural Engineering</option>
                      <option value="Industrial Engineering">Industrial Engineering</option>
                      <option value="Materials Engineering">Materials Engineering</option>
                      <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                      <option value="Structural Engineering">Structural Engineering</option>
                      <option value="Telecommunication Engineering">Telecommunication Engineering</option>
                    </optgroup>
                    
                    {/* Medical Sciences */}
                    <optgroup label="Medical Sciences">
                      <option value="Medicine and Surgery">Medicine and Surgery</option>
                      <option value="Nursing">Nursing</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Dentistry">Dentistry</option>
                      <option value="Medical Laboratory Science">Medical Laboratory Science</option>
                      <option value="Physiotherapy">Physiotherapy</option>
                      <option value="Radiography">Radiography</option>
                      <option value="Public Health">Public Health</option>
                      <option value="Anatomy">Anatomy</option>
                      <option value="Physiology">Physiology</option>
                      <option value="Pharmacology">Pharmacology</option>
                      <option value="Optometry">Optometry</option>
                      <option value="Veterinary Medicine">Veterinary Medicine</option>
                      <option value="Health Information Management">Health Information Management</option>
                    </optgroup>
                    
                    {/* Arts and Humanities */}
                    <optgroup label="Arts and Humanities">
                      <option value="English">English</option>
                      <option value="History">History</option>
                      <option value="Philosophy">Philosophy</option>
                      <option value="Linguistics">Linguistics</option>
                      <option value="Religious Studies">Religious Studies</option>
                      <option value="Theatre Arts">Theatre Arts</option>
                      <option value="Fine Arts">Fine Arts</option>
                      <option value="Music">Music</option>
                      <option value="French">French</option>
                      <option value="Arabic">Arabic</option>
                    </optgroup>
                    
                    {/* Social Sciences */}
                    <optgroup label="Social Sciences">
                      <option value="Economics">Economics</option>
                      <option value="Political Science">Political Science</option>
                      <option value="Sociology">Sociology</option>
                      <option value="Psychology">Psychology</option>
                      <option value="Geography">Geography</option>
                      <option value="Anthropology">Anthropology</option>
                      <option value="International Relations">International Relations</option>
                      <option value="Mass Communication">Mass Communication</option>
                      <option value="Criminology">Criminology</option>
                      <option value="Social Work">Social Work</option>
                    </optgroup>
                    
                    {/* Business and Management */}
                    <optgroup label="Business and Management">
                      <option value="Business Administration">Business Administration</option>
                      <option value="Accounting">Accounting</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Human Resource Management">Human Resource Management</option>
                      <option value="Banking and Finance">Banking and Finance</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Actuarial Science">Actuarial Science</option>
                    </optgroup>
                    
                    {/* Law */}
                    <optgroup label="Law">
                      <option value="Law">Law</option>
                      <option value="International Law">International Law</option>
                      <option value="Corporate Law">Corporate Law</option>
                    </optgroup>
                    
                    {/* Education */}
                    <optgroup label="Education">
                      <option value="Education">Education</option>
                      <option value="Early Childhood Education">Early Childhood Education</option>
                      <option value="Special Education">Special Education</option>
                      <option value="Educational Administration">Educational Administration</option>
                      <option value="Guidance and Counseling">Guidance and Counseling</option>
                    </optgroup>
                    
                    {/* Agriculture */}
                    <optgroup label="Agriculture">
                      <option value="Agriculture">Agriculture</option>
                      <option value="Agricultural Economics">Agricultural Economics</option>
                      <option value="Animal Science">Animal Science</option>
                      <option value="Crop Science">Crop Science</option>
                      <option value="Soil Science">Soil Science</option>
                      <option value="Fisheries">Fisheries</option>
                      <option value="Forestry">Forestry</option>
                    </optgroup>
                    
                    {/* Environmental */}
                    <optgroup label="Environmental">
                      <option value="Architecture">Architecture</option>
                      <option value="Urban Planning">Urban Planning</option>
                      <option value="Estate Management">Estate Management</option>
                      <option value="Surveying">Surveying</option>
                      <option value="Quantity Surveying">Quantity Surveying</option>
                    </optgroup>
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