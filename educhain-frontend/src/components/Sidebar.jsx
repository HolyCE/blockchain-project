import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, userRole }) => {
  const getNavItems = () => {
    if (userRole === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'requests', label: 'All Requests', icon: '📋' },
        { id: 'students', label: 'All Students', icon: '👥' },
        { id: 'courses', label: 'All Courses', icon: '📚' },
        { id: 'published-results', label: 'Published Results', icon: '📊' },
        { id: 'blockchain', label: 'Blockchain Console', icon: '⛓️' }
      ];
    }
    
    if (userRole === 'student') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'uploaded', label: 'My Results', icon: '📄' }
      ];
    }
    
    if (userRole === 'lecturer') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'grading', label: 'Grading Tasks', icon: '✏️' },
        { id: 'courses', label: 'My Courses', icon: '📚' }
      ];
    }
    
    if (userRole === 'hod') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'requests', label: 'Department Requests', icon: '📋' },
        { id: 'students', label: 'Department Students', icon: '👥' },
        { id: 'courses', label: 'Department Courses', icon: '📚' }
      ];
    }
    
    if (userRole === 'course_advisor') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'requests', label: 'Pending Reviews', icon: '📋' },
        { id: 'courses', label: 'Department Courses', icon: '📚' }
      ];
    }
    
    if (userRole === 'school_officer') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'requests', label: 'Pending Approvals', icon: '📋' }
      ];
    }
    
    return [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }];
  };
  
  const navItems = getNavItems();
  
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🎓</span>
        <span className="logo-text">EDUCHAIN</span>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-version">v1.0.0</div>
      </div>
    </div>
  );
};

export default Sidebar;
