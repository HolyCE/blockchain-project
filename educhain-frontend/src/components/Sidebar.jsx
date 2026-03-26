import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, userRole }) => {
  const menuItems = {
    lecturer: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      { id: 'grading', icon: '✏️', label: 'Grading Tasks' }
    ],
    student: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      { id: 'uploaded', icon: '📄', label: 'Uploaded Results' },
      { id: 'courses', icon: '📚', label: 'My Courses' },
      { id: 'requests', icon: '📋', label: 'My Requests' }
    ],
    course_advisor: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      { id: 'requests', icon: '📋', label: 'Pending Approvals' },
      { id: 'courses', icon: '📚', label: 'Department Courses' }
    ],
    hod: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      { id: 'requests', icon: '📋', label: 'Pending Approvals' },
      { id: 'courses', icon: '📚', label: 'All Courses' },
      { id: 'students', icon: '👥', label: 'Students' }
    ],
    school_officer: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      { id: 'requests', icon: '📋', label: 'Pending Requests' }
    ],
    admin: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      { id: 'requests', icon: '📋', label: 'All Requests' },
      { id: 'courses', icon: '📚', label: 'All Courses' },
      { id: 'students', icon: '👥', label: 'Students' },
      { id: 'blockchain', icon: '⛓️', label: 'Blockchain' }
    ]
  };

  const items = menuItems[userRole] || menuItems.lecturer;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <strong>EDU</strong>CHAIN
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-label">MAIN MENU</div>
          {items.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon && <span className="nav-icon">{item.icon}</span>}
              <span className="nav-text">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;