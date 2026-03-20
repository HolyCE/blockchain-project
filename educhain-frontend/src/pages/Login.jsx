import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await API.login(identifier, password);
    setLoading(false);

    if (result.success) {
      console.log('✅ Login successful');
      onLogin(result.user);
    } else {
      setError(result.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-brand">
          <h1>Result Upload System</h1>
          <p>Secure Academic Records Management</p>
        </div>
        <div className="login-footer">© 2026 University System</div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h2>Welcome Back</h2>
          <p>Sign in with your email or matric number</p>

          {error && <div className="error-message">{error}</div>}

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

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;