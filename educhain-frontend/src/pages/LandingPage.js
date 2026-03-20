import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Secure & Immutable',
      description: 'Academic records stored on blockchain technology ensure tamper-proof data integrity and permanent verification.',
      color: '#3b82f6'
    },
    {
      title: 'Fast & Efficient',
      description: 'Streamlined result upload and verification process with multi-stage approval workflow reducing delays.',
      color: '#8b5cf6'
    },
    {
      title: 'Role-Based Access',
      description: 'Separate portals for students, lecturers, course advisors, HOD, and administrators with custom dashboards.',
      color: '#10b981'
    },
    {
      title: 'Real-Time Tracking',
      description: 'Monitor your result request progress through every approval stage with live status updates.',
      color: '#f59e0b'
    },
    {
      title: 'Transparent Process',
      description: 'Complete visibility into the result verification and approval workflow for all stakeholders.',
      color: '#ec4899'
    },
    {
      title: 'Blockchain Verified',
      description: 'Every published result is cryptographically hashed and stored on private Ethereum network via Ganache.',
      color: '#06b6d4'
    }
  ];

  const workflow = [
    { step: 1, role: 'Student', action: 'Submit result request with course selection' },
    { step: 2, role: 'School Officer', action: 'Initial review and validation' },
    { step: 3, role: 'HOD', action: 'Assign to course advisor' },
    { step: 4, role: 'Course Advisor', action: 'Assign courses to lecturers' },
    { step: 5, role: 'Lecturer', action: 'Enter student grades' },
    { step: 6, role: 'HOD', action: 'Final approval' },
    { step: 7, role: 'Admin', action: 'Hash and store on Ethereum (Ganache)' },
    { step: 8, role: 'Student', action: 'View verified results' }
  ];

  const techStack = [
    { name: 'React.js', description: 'Dynamic Frontend', color: '#61dafb' },
    { name: 'Node.js + Express', description: 'Robust Backend', color: '#68a063' },
    { name: 'Python + Web3.py', description: 'Blockchain Service', color: '#3776ab' },
    { name: 'Ganache', description: 'Private Ethereum', color: '#e4a663' }
  ];

  const stats = [
    { value: '100%', label: 'Immutable Records' },
    { value: '6', label: 'Approval Stages' },
    { value: '5', label: 'User Roles' },
    { value: 'SHA-256', label: 'Hash Algorithm' }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <strong>EDU</strong>CHAIN
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#technology">Technology</a>
            <button className="nav-login-btn" onClick={() => navigate('/login')}>
              Login →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>Blockchain-Powered Academic Records</span>
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
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Get Started
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
          
          {/* Stats Bar */}
          <div className="stats-bar">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="blockchain-animation">
            <div className="block block-1">
              <div className="block-header">
                <span>Block #1</span>
              </div>
              <div className="block-content">
                <div className="block-title">Student Results</div>
                <div className="block-detail">CS301 • Grade: A</div>
              </div>
              <div className="block-hash">Hash: 0x7a8b9c...</div>
            </div>
            <div className="block-connector">
              <div className="connector-line"></div>
              <div className="connector-dot"></div>
            </div>
            <div className="block block-2">
              <div className="block-header">
                <span>Block #2</span>
              </div>
              <div className="block-content">
                <div className="block-title">HOD Approval</div>
                <div className="block-detail">Verified • Signed</div>
              </div>
              <div className="block-hash">Hash: 0x4e5f6g...</div>
            </div>
            <div className="block-connector">
              <div className="connector-line"></div>
              <div className="connector-dot"></div>
            </div>
            <div className="block block-3">
              <div className="block-header">
                <span>Block #3</span>
              </div>
              <div className="block-content">
                <div className="block-title">Immutable Record</div>
                <div className="block-detail">Blockchain Secured</div>
              </div>
              <div className="block-hash">Hash: 0x1h2i3j...</div>
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
                <div className="feature-indicator" style={{ background: feature.color }}></div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
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
                <div className="workflow-number">{item.step}</div>
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

      {/* Technology Section */}
      <section id="technology" className="tech-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Technology</span>
            <h2 className="section-title">Powered By Modern Tech Stack</h2>
            <p className="section-subtitle">
              Enterprise-grade technologies for reliability and security
            </p>
          </div>
          
          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div key={index} className="tech-card">
                <div className="tech-color-indicator" style={{ background: tech.color }}></div>
                <div className="tech-name">{tech.name}</div>
                <div className="tech-desc">{tech.description}</div>
              </div>
            ))}
          </div>

          <div className="tech-details">
            <div className="tech-detail-card">
              <h3>Frontend Layer</h3>
              <p>React.js with modern hooks, React Router for navigation, and responsive CSS design</p>
            </div>
            <div className="tech-detail-card">
              <h3>Backend Layer</h3>
              <p>Node.js + Express REST API with MongoDB database and JWT authentication</p>
            </div>
            <div className="tech-detail-card">
              <h3>Blockchain Layer</h3>
              <p>Python + Web3.py for Ethereum interaction with SHA-256 hashing and Ganache private network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Explanation Section */}
      <section className="blockchain-explain-section">
        <div className="section-container">
          <div className="blockchain-explain-grid">
            <div className="blockchain-explain-content">
              <span className="section-badge">Blockchain Technology</span>
              <h2 className="section-title">Why Blockchain Matters</h2>
              <div className="explain-points">
                <div className="explain-point">
                  <div className="point-indicator" style={{ background: '#3b82f6' }}></div>
                  <div className="point-content">
                    <h4>Immutability</h4>
                    <p>Once results are committed to the blockchain, they cannot be altered or deleted, ensuring permanent academic integrity.</p>
                  </div>
                </div>
                <div className="explain-point">
                  <div className="point-indicator" style={{ background: '#8b5cf6' }}></div>
                  <div className="point-content">
                    <h4>Transparency</h4>
                    <p>Every transaction is recorded with a timestamp and hash, creating a complete audit trail visible to authorized users.</p>
                  </div>
                </div>
                <div className="explain-point">
                  <div className="point-indicator" style={{ background: '#10b981' }}></div>
                  <div className="point-content">
                    <h4>Verification</h4>
                    <p>Anyone can verify the authenticity of a result using the transaction hash, eliminating forgery and fraud.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="blockchain-explain-visual">
              <div className="hash-demo">
                <div className="hash-input">
                  <div className="hash-label">Student Result Data</div>
                  <div className="hash-data">
                    <div className="data-line">Student: Alice Johnson</div>
                    <div className="data-line">Course: CS301 (Data Structures)</div>
                    <div className="data-line">Score: 85 • Grade: A</div>
                    <div className="data-line">Session: 2023/2024</div>
                  </div>
                </div>
                <div className="hash-arrow">
                  <span>SHA-256 Hash</span>
                  ↓
                </div>
                <div className="hash-output">
                  <div className="hash-label">Blockchain Hash</div>
                  <div className="hash-value">
                    a3b4c5d6e7f8901234567890abcdef...
                  </div>
                </div>
                <div className="hash-arrow">
                  <span>Stored in Block</span>
                  ↓
                </div>
                <div className="hash-block">
                  <div className="hash-label">Ethereum Transaction</div>
                  <div className="hash-details">
                    <div>Block: #1234</div>
                    <div>TX: 0x1a2b3c...</div>
                    <div>Status: ✓ Confirmed</div>
                  </div>
                </div>
              </div>
            </div>
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
          <button className="cta-button" onClick={() => navigate('/login')}>
            Access Portal
            <span className="btn-arrow">→</span>
          </button>
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
              <div className="footer-logo">
                <strong>EDU</strong>CHAIN
              </div>
              <p className="footer-tagline">
                Blockchain-Verified Academic Records
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
                <a href="#documentation">Documentation</a>
                <a href="#api">API Reference</a>
                <a href="#support">Support</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About Us</a>
                <a href="#contact">Contact</a>
                <a href="#privacy">Privacy Policy</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-copy">
              © 2025 EduChain. All rights reserved.
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
