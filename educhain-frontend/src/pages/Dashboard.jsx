import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import ResultTable from '../components/ResultTable';
import RequestManagement from '../components/RequestManagement';
import StudentDashboard from '../components/StudentDashboard';
import API from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadDashboardData();
    loadNotifications();
  }, []);

  const loadDashboardData = async () => {
    try {
      const statsData = await API.getDashboardStats();
      setStats(statsData);
      
      // Load course data based on role
      if (user.role === 'lecturer') {
        const courses = await API.getLecturerCourses();
        if (courses.length > 0) {
          // Load first course's results
          const results = await API.getCourseResults(courses[0].code);
          setCourseData(results);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await API.getNotifications(true);
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleCommitToBlockchain = async (results) => {
    const confirmed = window.confirm('Commit these results to the blockchain? This action cannot be undone.');
    if (confirmed) {
      try {
        const result = await API.commitToBlockchain(courseData.courseCode, results);
        alert(`Successfully committed to blockchain!\nBlock: ${result.blockHash}`);
        loadDashboardData();
      } catch (error) {
        alert('Failed to commit to blockchain');
      }
    }
  };

  const handleLogout = () => {
    API.logout();
    onLogout();
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={user.role} />
      
      <div className="main-content">
        <div className="header">
          <h1>
            {activeTab === 'dashboard' ? 'Dashboard Overview' :
             activeTab === 'requests' ? 'Request Management' :
             activeTab === 'courses' ? 'Course Management' :
             activeTab === 'students' ? 'Student Management' :
             activeTab === 'results' ? 'Results Management' : 'Dashboard'}
          </h1>
          
          <div className="header-right">
            {notifications.length > 0 && (
              <button className="notification-btn" onClick={() => setActiveTab('notifications')}>
                🔔 {notifications.length}
              </button>
            )}
            
            <div className="user-profile">
              <img 
                src={user.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt="User" 
              />
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-role" style={{ textTransform: 'capitalize' }}>
                  {user.role === 'hod' ? 'Head of Department' : 
                   user.role === 'course_advisor' ? 'Course Advisor' : user.role}
                </div>
              </div>
            </div>
            
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && stats && (
          <>
            {user.role === 'student' ? (
              <StudentDashboard 
                user={user} 
                stats={stats.stats} 
                onRequestSubmitted={loadDashboardData}
              />
            ) : (
              <>
                <div className="stats-grid">
                  <StatCard 
                    label="Total Students" 
                    value={stats.stats?.totalStudents || 0} 
                    subtext="Active enrollments"
                    color="#3b82f6"
                  />
                  <StatCard 
                    label="Active Courses" 
                    value={stats.stats?.totalCourses || 0} 
                    subtext="Current semester"
                    color="#8b5cf6"
                  />
                  <StatCard 
                    label="Results Published" 
                    value={stats.stats?.completedRequests || 0} 
                    subtext="This semester"
                    color="#10b981"
                  />
                  <StatCard 
                    label="Pending Requests" 
                    value={stats.stats?.pendingRequests || 0} 
                    subtext="Awaiting action"
                    color="#f59e0b"
                  />
                </div>

                {user.role === 'lecturer' && courseData && (
                  <div className="content-grid" style={{ gridTemplateColumns: '1fr', padding: '0 32px' }}>
                    <div className="content-main">
                      <ResultTable 
                        courseData={courseData} 
                        userRole={user.role}
                        requestId="current"
                        onGradesSubmitted={loadDashboardData}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <RequestManagement userRole={user.role} userId={user.id} />
        )}

        {activeTab === 'courses' && (
          <div className="page-placeholder">
            <h2>Course Management</h2>
            <p>Course listing and management interface coming soon.</p>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="page-placeholder">
            <h2>Student Management</h2>
            <p>Student directory and management tools coming soon.</p>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="page-placeholder">
            <h2>Results Management</h2>
            <p>Full results management interface coming soon.</p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications-panel" style={{ padding: '32px' }}>
            <h2>Notifications</h2>
            {notifications.map(notif => (
              <div key={notif.id} className="notification-card" style={{
                padding: '16px',
                marginBottom: '12px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <h4>{notif.title}</h4>
                <p>{notif.message}</p>
                <small>{new Date(notif.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
