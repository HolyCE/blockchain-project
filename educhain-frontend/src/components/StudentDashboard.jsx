import React from 'react';
import StatCard from './StatCard';
import StudentRequestButton from './StudentRequestButton';
import '../styles/StudentDashboard.css';

const StudentDashboard = ({ user, stats, courses, onRequestSubmitted }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Verified': '#10b981',
      'Pending Verification': '#fbbf24',
      'Not Uploaded': '#94a3b8'
    };
    return colors[status] || '#94a3b8';
  };

  return (
    <div className="student-dashboard">
      {/* Stats Summary */}
      <div className="stats-grid">
        <StatCard 
          label="My Courses" 
          value={stats.totalCourses} 
          subtext={stats.coursesInfo}
          color="#8b5cf6"
        />
        <StatCard 
          label="Completed" 
          value={stats.completedCourses} 
          subtext={stats.completedInfo}
          color="#10b981"
        />
        <StatCard 
          label="Average Grade" 
          value={stats.averageGrade} 
          subtext={stats.gradeInfo}
          color="#3b82f6"
        />
        <StatCard 
          label="Pending Requests" 
          value={stats.uploadRequests} 
          subtext={stats.requestStatus}
          color="#f59e0b"
        />
      </div>

      {/* Request Button */}
      <div className="action-section">
        <StudentRequestButton userId={user.id} onRequestSubmitted={onRequestSubmitted} />
      </div>

      {/* Course Results Table */}
      <div className="results-section">
        <h3>My Course Results</h3>
        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Lecturer</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses && courses.map(course => (
                <tr key={course.id}>
                  <td><strong>{course.code}</strong></td>
                  <td>{course.name}</td>
                  <td>{course.lecturer}</td>
                  <td>
                    {course.score !== null ? (
                      <span className="score-value">{course.score}</span>
                    ) : (
                      <span className="score-pending">-</span>
                    )}
                  </td>
                  <td>
                    {course.grade !== '-' ? (
                      <span className="grade-badge">{course.grade}</span>
                    ) : (
                      <span className="grade-pending">-</span>
                    )}
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ background: getStatusColor(course.status) }}
                    >
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;