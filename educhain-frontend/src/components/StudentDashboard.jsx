import React, { useState, useEffect } from 'react';
import API from '../services/api';
import StatCard from './StatCard';
import StudentRequestButton from './StudentRequestButton';
import '../styles/StudentDashboard.css';

const StudentDashboard = ({ user, onRequestSubmitted }) => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const dashboardData = await API.getDashboardStats();
      setStats(dashboardData.stats);
      
      const studentRequests = await API.getStudentRequests();
      setRequests(studentRequests);
      
      const studentCourses = await API.getDepartmentCourses(user.department, user.level);
      setCourses(studentCourses);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': '#94a3b8',
      'submitted': '#fbbf24',
      'department_review': '#f97316',
      'advisor_review': '#8b5cf6',
      'lecturer_grading': '#3b82f6',
      'hod_review': '#ec4899',
      'completed': '#10b981',
      'rejected': '#ef4444'
    };
    return colors[status] || '#64748b';
  };

  const getStatusDisplay = (status) => {
    const displays = {
      'draft': 'Draft',
      'submitted': 'Pending School Officer',
      'department_review': 'Department Review',
      'advisor_review': 'Course Advisor Review',
      'lecturer_grading': 'Lecturer Grading',
      'hod_review': 'HOD Final Review',
      'completed': 'Published',
      'rejected': 'Rejected'
    };
    return displays[status] || status;
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="student-dashboard">
      <div className="stats-grid">
        <StatCard label="My Courses" value={courses.length} subtext="Active courses" color="#8b5cf6" />
        <StatCard label="My Requests" value={stats?.totalRequests || 0} subtext="Total requests" color="#f59e0b" />
        <StatCard label="Published Results" value={stats?.completedRequests || 0} subtext="Completed" color="#10b981" />
        <StatCard label="Current CGPA" value={stats?.academicSummary?.cgpa || 'N/A'} subtext={`Level ${user.level}`} color="#3b82f6" />
      </div>

      <div className="action-section">
        <StudentRequestButton userId={user.id} onRequestSubmitted={loadDashboardData} />
      </div>

      <div className="requests-section">
        <h3>My Result Requests</h3>
        {requests.length === 0 ? (
          <div className="empty-state">
            <p>No result requests yet. Click the button above to create one.</p>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map(req => (
              <div key={req._id} className="request-card" onClick={() => handleRequestClick(req)}>
                <div className="request-card-header">
                  <div className="request-info">
                    <div className="request-session">
                      {req.academicSession || 'N/A'} - {req.semester || 'N/A'} Semester
                    </div>
                    <div className="request-level">
                      Level {req.resultLevel || req.currentLevel}
                    </div>
                  </div>
                  <span className="status-badge" style={{ background: getStatusColor(req.status) }}>
                    {getStatusDisplay(req.status)}
                  </span>
                </div>
                <div className="request-card-footer">
                  <span className="courses-count">{req.courses?.length || 0} course(s)</span>
                  <span className="view-link">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDetailsModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Result Request Details</h3>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="details-section">
                <h4>👤 Student Information</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Full Name</label>
                    <span>{selectedRequest.studentName || user.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Matric Number</label>
                    <span>{selectedRequest.matricNumber || user.matricNumber}</span>
                  </div>
                  <div className="detail-item">
                    <label>Department</label>
                    <span>{selectedRequest.department || user.department}</span>
                  </div>
                  <div className="detail-item">
                    <label>Faculty</label>
                    <span>{selectedRequest.faculty || user.faculty}</span>
                  </div>
                  <div className="detail-item">
                    <label>Current Level</label>
                    <span>Level {selectedRequest.currentLevel || user.level}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h4>📋 Request Information</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Academic Session</label>
                    <span>{selectedRequest.academicSession || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Semester</label>
                    <span>{selectedRequest.semester || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Result Level</label>
                    <span>{selectedRequest.resultLevel || selectedRequest.currentLevel}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <span className="status-text" style={{ color: getStatusColor(selectedRequest.status) }}>
                      {getStatusDisplay(selectedRequest.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Submitted Date</label>
                    <span>{selectedRequest.submittedAt ? new Date(selectedRequest.submittedAt).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h4>📚 Requested Courses ({selectedRequest.courses?.length || 0})</h4>
                <div className="courses-table-container">
                  <table className="courses-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Course Title</th>
                        <th>Credits</th>
                        <th>Current Lecturer</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequest.courses?.map((course, idx) => (
                        <tr key={idx}>
                          <td><strong>{course.courseCode}</strong></td>
                          <td>{course.courseTitle}</td>
                          <td>{course.creditUnits}</td>
                          <td>
                            {course.lecturer?.name ? (
                              <span className="lecturer-name">👨‍🏫 {course.lecturer.name}</span>
                            ) : (
                              <span className="pending-text">Not Assigned</span>
                            )}
                          </td>
                          <td>
                            <span className="course-status" style={{
                              background: course.status === 'graded' ? '#10b981' : '#fbbf24'
                            }}>
                              {course.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedRequest.history && selectedRequest.history.length > 0 && (
                <div className="details-section">
                  <h4>📜 Request History</h4>
                  <div className="history-timeline">
                    {selectedRequest.history.slice(-5).map((event, idx) => (
                      <div key={idx} className="history-item">
                        <div className="history-icon">
                          {event.action === 'Submitted for approval' ? '📤' : 
                           event.action.includes('approved') ? '✅' : 
                           event.action.includes('assigned') ? '👨‍🏫' : '📋'}
                        </div>
                        <div className="history-content">
                          <div className="history-action">{event.action}</div>
                          {event.comment && <div className="history-comment">{event.comment}</div>}
                          <div className="history-time">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-close" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
