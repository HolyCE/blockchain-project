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

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const features = [
    { title: 'Secure & Immutable', description: 'Academic records stored on blockchain technology ensure tamper-proof data integrity and permanent verification.', icon: '🔒', color: '#3b82f6' },
    { title: 'Fast & Efficient', description: 'Streamlined result upload and verification process with multi-stage approval workflow reducing delays.', icon: '⚡', color: '#8b5cf6' },
    { title: 'Role-Based Access', description: 'Separate portals for students, lecturers, course advisors, HOD, and administrators with custom dashboards.', icon: '👥', color: '#10b981' },
    { title: 'Real-Time Tracking', description: 'Monitor your result request progress through every approval stage with live status updates.', icon: '📊', color: '#f59e0b' },
    { title: 'Transparent Process', description: 'Complete visibility into the result verification and approval workflow for all stakeholders.', icon: '👁️', color: '#ec4899' },
    { title: 'Blockchain Verified', description: 'Every published result is cryptographically hashed and stored on private Ethereum network via Ganache.', icon: '⛓️', color: '#06b6d4' }
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

  const stats = [
    { value: '100%', label: 'Immutable Records', icon: '🔒', trend: 'Tamper-proof' },
    { value: '8', label: 'Approval Stages', icon: '📊', trend: 'Complete Workflow' },
    { value: '6', label: 'User Roles', icon: '👥', trend: 'All Covered' },
    { value: 'SHA-256', label: 'Hash Algorithm', icon: '🔐', trend: 'Military Grade' }
  ];

  return (
    <div className="lp-landing-page">
      {/* Navigation */}
      <nav className={`lp-nav ${scrolled ? 'lp-scrolled' : ''}`}>
        <div className="lp-nav-container">
          <div className="lp-nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="lp-logo-icon">🎓</span>
            <strong>EDU</strong>CHAIN
          </div>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <div className="lp-nav-buttons">
              <button className="lp-nav-register-btn" onClick={() => navigate('/register')}>Register</button>
              <button className="lp-nav-login-btn" onClick={() => navigate('/login')}>Login <span className="lp-btn-arrow">→</span></button>
            </div>
          </div>
          <button className={`lp-mobile-menu-btn ${mobileMenuOpen ? 'lp-active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <span className="lp-hamburger-line"></span>
            <span className="lp-hamburger-line"></span>
            <span className="lp-hamburger-line"></span>
          </button>
        </div>
        <div className={`lp-mobile-menu ${mobileMenuOpen ? 'lp-open' : ''}`}>
          <div className="lp-mobile-menu-content">
            <a href="#features" onClick={handleNavClick}>Features</a>
            <a href="#workflow" onClick={handleNavClick}>Workflow</a>
            <div className="lp-mobile-menu-buttons">
              <button className="lp-mobile-register-btn" onClick={() => { navigate('/register'); handleNavClick(); }}>Register</button>
              <button className="lp-mobile-login-btn" onClick={() => { navigate('/login'); handleNavClick(); }}>Login</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="lp-hero-section">
        <div className="lp-hero-background">
          <div className="lp-gradient-sphere lp-sphere-1"></div>
          <div className="lp-gradient-sphere lp-sphere-2"></div>
          <div className="lp-gradient-sphere lp-sphere-3"></div>
        </div>
        <div className="lp-hero-content">
          <div className="lp-hero-badge"><span className="lp-badge-icon">⛓️</span> Blockchain-Powered Academic Records</div>
          <h1 className="lp-hero-title">Secure Academic Results<span className="lp-hero-highlight"> On The Blockchain</span></h1>
          <p className="lp-hero-subtitle">Transform your institution's result management with blockchain technology. EduChain provides tamper-proof, verifiable academic records through a transparent multi-stage approval workflow.</p>
          <div className="lp-hero-buttons">
            <button className="lp-btn-primary" onClick={() => navigate('/register')}>Get Started Free <span className="lp-btn-arrow">→</span></button>
            <button className="lp-btn-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>Learn More</button>
          </div>
          <div className="lp-stats-bar">
            {stats.map((stat, index) => (
              <div key={index} className="lp-stat-item">
                <div className="lp-stat-icon">{stat.icon}</div>
                <div className="lp-stat-value">{stat.value}</div>
                <div className="lp-stat-label">{stat.label}</div>
                <div className="lp-stat-trend">{stat.trend}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="lp-hero-visual">
          <div className="lp-blockchain-animation">
            <div className="lp-block lp-block-1"><div className="lp-block-header"><span className="lp-block-icon">📝</span><span>Block #1245</span></div><div className="lp-block-content"><div className="lp-block-title">Alice Johnson</div><div className="lp-block-detail">CSC301 • Data Structures</div><div className="lp-block-grade">Grade: A | Score: 85</div></div><div className="lp-block-hash">Hash: 0x7a8b9c...d4e5f6</div></div>
            <div className="lp-block-connector"><div className="lp-connector-line"></div><div className="lp-connector-dot"></div></div>
            <div className="lp-block lp-block-2"><div className="lp-block-header"><span className="lp-block-icon">✓</span><span>Block #1246</span></div><div className="lp-block-content"><div className="lp-block-title">HOD Approval</div><div className="lp-block-detail">Verified & Signed</div><div className="lp-block-grade">Status: Approved</div></div><div className="lp-block-hash">Hash: 0x4e5f6g...h7i8j9</div></div>
            <div className="lp-block-connector"><div className="lp-connector-line"></div><div className="lp-connector-dot"></div></div>
            <div className="lp-block lp-block-3"><div className="lp-block-header"><span className="lp-block-icon">⛓️</span><span>Block #1247</span></div><div className="lp-block-content"><div className="lp-block-title">Immutable Record</div><div className="lp-block-detail">Blockchain Secured</div><div className="lp-block-grade">Verified ✓</div></div><div className="lp-block-hash">Hash: 0x1h2i3j...k4l5m6</div></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="lp-features-section">
        <div className="lp-section-container">
          <div className="lp-section-header">
            <span className="lp-section-badge">Why Choose Us</span>
            <h2 className="lp-section-title">Built For Academic Excellence</h2>
            <p className="lp-section-subtitle">Cutting-edge technology meets educational integrity</p>
          </div>
          <div className="lp-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="lp-feature-card">
                <div className="lp-feature-icon-wrapper"><div className="lp-feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>{feature.icon}</div></div>
                <h3 className="lp-feature-title">{feature.title}</h3>
                <p className="lp-feature-description">{feature.description}</p>
                <div className="lp-feature-link">Learn more →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="lp-workflow-section">
        <div className="lp-section-container">
          <div className="lp-section-header">
            <span className="lp-section-badge">How It Works</span>
            <h2 className="lp-section-title">8-Step Approval Workflow</h2>
            <p className="lp-section-subtitle">Transparent process from submission to blockchain verification</p>
          </div>
          <div className="lp-workflow-timeline">
            {workflow.map((item, index) => (
              <div key={index} className="lp-workflow-item">
                <div className="lp-workflow-icon" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)` }}>{item.icon}</div>
                <div className="lp-workflow-content">
                  <div className="lp-workflow-step">Step {item.step}</div>
                  <div className="lp-workflow-role">{item.role}</div>
                  <div className="lp-workflow-action">{item.action}</div>
                </div>
                {index < workflow.length - 1 && <div className="lp-workflow-arrow">↓</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="lp-cta-section">
        <div className="lp-cta-content">
          <h2 className="lp-cta-title">Ready to Revolutionize Your Institution?</h2>
          <p className="lp-cta-subtitle">Join the future of academic record management with blockchain-verified results</p>
          <div className="lp-cta-buttons">
            <button className="lp-cta-button lp-primary" onClick={() => navigate('/register')}>Create Free Account <span className="lp-btn-arrow">→</span></button>
            <button className="lp-cta-button lp-secondary" onClick={() => navigate('/login')}>Sign In</button>
          </div>
          <p className="lp-cta-note">✓ Free setup assistance ✓ 24/7 Support ✓ Secure & Compliant</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-content">
          <div className="lp-footer-main">
            <div className="lp-footer-brand">
              <div className="lp-footer-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}><span className="lp-logo-icon">🎓</span><strong>EDU</strong>CHAIN</div>
              <p className="lp-footer-tagline">Blockchain-Verified Academic Records</p>
              <p className="lp-footer-description">Transforming education through blockchain technology, ensuring academic integrity and transparency.</p>
            </div>
            <div className="lp-footer-links">
              <div className="lp-footer-column"><h4>Product</h4><a href="#features">Features</a><a href="#workflow">Workflow</a><a href="#">Technology</a></div>
              <div className="lp-footer-column"><h4>Resources</h4><a href="#">Documentation</a><a href="#">API Reference</a><a href="#">Support</a></div>
              <div className="lp-footer-column"><h4>Company</h4><a href="#">About Us</a><a href="#">Contact</a><a href="#">Privacy Policy</a></div>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <p className="lp-footer-copy">© 2026 EduChain. All rights reserved.</p>
            <div className="lp-footer-tech"><span>Powered by</span><span className="lp-tech-badge">React</span><span className="lp-tech-badge">Node.js</span><span className="lp-tech-badge">Ethereum</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
