import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const features = [
    {
      title: 'Secure & Immutable',
      description: 'Academic records stored on blockchain technology ensure tamper-proof data integrity and permanent verification.',
      icon: '🔒',
      color: '#3b82f6'
    },
    {
      title: 'Fast & Efficient',
      description: 'Streamlined result upload and verification process with multi-stage approval workflow reducing delays.',
      icon: '⚡',
      color: '#8b5cf6'
    },
    {
      title: 'Role-Based Access',
      description: 'Separate portals for students, lecturers, course advisors, HOD, and administrators with custom dashboards.',
      icon: '👥',
      color: '#10b981'
    },
    {
      title: 'Real-Time Tracking',
      description: 'Monitor your result request progress through every approval stage with live status updates.',
      icon: '📊',
      color: '#f59e0b'
    },
    {
      title: 'Transparent Process',
      description: 'Complete visibility into the result verification and approval workflow for all stakeholders.',
      icon: '👁️',
      color: '#ec4899'
    },
    {
      title: 'Blockchain Verified',
      description: 'Every published result is cryptographically hashed and stored on private Ethereum network via Ganache.',
      icon: '⛓️',
      color: '#06b6d4'
    }
  ];

  const workflow = [
    { step: 1, role: 'Student', action: 'Submit result request with course selection', icon: '🎓', color: '#3b82f6' },
    { step: 2, role: 'School Officer', action: 'Initial review and validation', icon: '✓', color: '#8b5cf6' },
    { step: 3, role: 'HOD', action: 'Assign to course advisor', icon: '📋', color: '#10b981' },
    { step: 4, role: 'Course Advisor', action: 'Assign courses to lecturers', icon: '📚', color: '#f59e0b' },
    { step: 5, role: 'Lecturer', action: 'Enter student grades', icon: '✏️', color: '#ec4899' },
    { step: 6, role: 'HOD', action: 'Final approval', icon: '✅', color: '#06b6d4' },
    { step: 7, role: 'Admin', action: 'Hash and store on Ethereum (Ganache)', icon: '⛓️', color: '#3b82f6' },
    { step: 8, role: 'Student', action: 'View verified results', icon: '👀', color: '#10b981' }
  ];

  const techStack = [
    { name: 'React.js', description: 'Dynamic Frontend', color: '#61dafb', icon: '⚛️' },
    { name: 'Node.js + Express', description: 'Robust Backend', color: '#68a063', icon: '🚀' },
    { name: 'MongoDB', description: 'Flexible Database', color: '#47a248', icon: '🍃' },
    { name: 'Ganache', description: 'Private Ethereum', color: '#e4a663', icon: '⛓️' }
  ];

  const stats = [
    { value: '100%', label: 'Immutable Records', icon: '🔒', trend: 'Tamper-proof' },
    { value: '8', label: 'Approval Stages', icon: '📊', trend: 'Complete Workflow' },
    { value: '6', label: 'User Roles', icon: '👥', trend: 'All Covered' },
    { value: 'SHA-256', label: 'Hash Algorithm', icon: '🔐', trend: 'Military Grade' }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">🎓</span>
            <strong>EDU</strong>CHAIN
          </div>
          
          {/* Desktop Navigation */}
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <div className="nav-buttons">
              <button className="nav-register-btn" onClick={() => navigate('/register')}>
                Register
              </button>
              <button className="nav-login-btn" onClick={() => navigate('/login')}>
                Login
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button 
            className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <a href="#features" onClick={handleNavClick}>Features</a>
            <a href="#workflow" onClick={handleNavClick}>Workflow</a>
            <div className="mobile-menu-buttons">
              <button className="mobile-register-btn" onClick={() => { navigate('/register'); handleNavClick(); }}>
                Register
              </button>
              <button className="mobile-login-btn" onClick={() => { navigate('/login'); handleNavClick(); }}>
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-sphere sphere-1"></div>
          <div className="gradient-sphere sphere-2"></div>
          <div className="gradient-sphere sphere-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">⛓️</span>
            Blockchain-Powered Academic Records
          </div>
          <h1 className="hero-title">
            Secure Academic Results
            <span className="hero-highlight"> On The Blockchain</span>
          </h1>
          <p className="hero-subtitle">
            Transform your institution's result management with blockchain technology. 
            EduChain provides tamper-proof, verifiable academic records through a 
            transparent multi-stage approval workflow.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Get Started Free
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
          
          <div className="stats-bar">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-trend">{stat.trend}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="blockchain-animation">
            <div className="block block-1">
              <div className="block-header">
                <span className="block-icon">📝</span>
                <span>Block #1245</span>
              </div>
              <div className="block-content">
                <div className="block-title">Alice Johnson</div>
                <div className="block-detail">CSC301 • Data Structures</div>
                <div className="block-grade">Grade: A | Score: 85</div>
              </div>
              <div className="block-hash">Hash: 0x7a8b9c...d4e5f6</div>
            </div>
            <div className="block-connector">
              <div className="connector-line"></div>
              <div className="connector-dot"></div>
            </div>
            <div className="block block-2">
              <div className="block-header">
                <span className="block-icon">✓</span>
                <span>Block #1246</span>
              </div>
              <div className="block-content">
                <div className="block-title">HOD Approval</div>
                <div className="block-detail">Verified & Signed</div>
                <div className="block-grade">Status: Approved</div>
              </div>
              <div className="block-hash">Hash: 0x4e5f6g...h7i8j9</div>
            </div>
            <div className="block-connector">
              <div className="connector-line"></div>
              <div className="connector-dot"></div>
            </div>
            <div className="block block-3">
              <div className="block-header">
                <span className="block-icon">⛓️</span>
                <span>Block #1247</span>
              </div>
              <div className="block-content">
                <div className="block-title">Immutable Record</div>
                <div className="block-detail">Blockchain Secured</div>
                <div className="block-grade">Verified ✓</div>
              </div>
              <div className="block-hash">Hash: 0x1h2i3j...k4l5m6</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-title">Built For Academic Excellence</h2>
            <p className="section-subtitle">
              Cutting-edge technology meets educational integrity
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-link">Learn more →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="workflow-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">8-Step Approval Workflow</h2>
            <p className="section-subtitle">
              Transparent process from submission to blockchain verification
            </p>
          </div>
          
          <div className="workflow-timeline">
            {workflow.map((item, index) => (
              <div key={index} className="workflow-item">
                <div className="workflow-icon" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)` }}>
                  {item.icon}
                </div>
                <div className="workflow-content">
                  <div className="workflow-step">Step {item.step}</div>
                  <div className="workflow-role">{item.role}</div>
                  <div className="workflow-action">{item.action}</div>
                </div>
                {index < workflow.length - 1 && (
                  <div className="workflow-arrow">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Revolutionize Your Institution?</h2>
          <p className="cta-subtitle">
            Join the future of academic record management with blockchain-verified results
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary" onClick={() => navigate('/register')}>
              Create Free Account
              <span className="btn-arrow">→</span>
            </button>
            <button className="cta-button secondary" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
          <p className="cta-note">
            ✓ Free setup assistance  ✓ 24/7 Support  ✓ Secure & Compliant
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <span className="logo-icon">🎓</span>
                <strong>EDU</strong>CHAIN
              </div>
              <p className="footer-tagline">
                Blockchain-Verified Academic Records
              </p>
              <p className="footer-description">
                Transforming education through blockchain technology, ensuring academic integrity and transparency.
              </p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#workflow">Workflow</a>
                <a href="#technology">Technology</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#">Documentation</a>
                <a href="#">API Reference</a>
                <a href="#">Support</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Contact</a>
                <a href="#">Privacy Policy</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-copy">
              © 2026 EduChain. All rights reserved.
            </p>
            <div className="footer-tech">
              <span>Powered by</span>
              <span className="tech-badge">React</span>
              <span className="tech-badge">Node.js</span>
              <span className="tech-badge">Ethereum</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;