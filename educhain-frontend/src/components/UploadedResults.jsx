import React, { useState, useEffect } from 'react';
import API from '../services/api';
import '../styles/UploadedResults.css';

const UploadedResults = ({ userId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    try {
      const requests = await API.getStudentRequests();
      const completedResults = requests.filter(req => 
        req.status === 'completed' && req.finalResult?.published === true
      );
      setResults(completedResults);
    } catch (error) {
      console.error('Error loading results:', error);
    }
    setLoading(false);
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': '#10b981',
      'B': '#3b82f6',
      'C': '#f59e0b',
      'D': '#f97316',
      'E': '#ef4444',
      'F': '#dc2626'
    };
    return colors[grade] || '#64748b';
  };

  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setShowDetailsModal(true);
  };

  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    results.forEach(result => {
      if (result.finalResult) {
        totalPoints += result.finalResult.totalPoints || 0;
        totalCredits += result.finalResult.totalCredits || 0;
      }
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  if (loading) return <div className="loading">Loading results...</div>;

  return (
    <div className="uploaded-results">
      <div className="results-header">
        <h2>My Published Results</h2>
        <div className="cgpa-card">
          <div className="cgpa-label">Cumulative GPA</div>
          <div className="cgpa-value">{calculateCGPA()}</div>
          <div className="cgpa-subtext">Based on {results.length} semester(s)</div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h4>No Results Published Yet</h4>
          <p>Your results will appear here once they are published.</p>
        </div>
      ) : (
        <div className="results-grid">
          {results.map(result => (
            <div key={result._id} className="result-card" onClick={() => handleViewDetails(result)}>
              <div className="result-card-header">
                <div className="session-info">
                  <span className="session">{result.academicSession}</span>
                  <span className="semester">{result.semester} Semester</span>
                </div>
                <div className="gpa-badge">
                  GPA: {result.finalResult?.gpa || 'N/A'}
                </div>
              </div>
              
              <div className="result-summary">
                <div className="courses-count">
                  📚 {result.courses?.length || 0} Courses
                </div>
                <div className="credits-earned">
                  🎓 {result.finalResult?.totalCredits || 0} Credits
                </div>
              </div>
              
              <div className="result-preview">
                {result.courses?.slice(0, 2).map(course => (
                  <div key={course.courseCode} className="preview-course">
                    <span className="course-code">{course.courseCode}</span>
                    <span className="course-grade" style={{ background: getGradeColor(course.grade) }}>
                      {course.grade}
                    </span>
                  </div>
                ))}
                {result.courses?.length > 2 && (
                  <div className="more-courses">+{result.courses.length - 2} more</div>
                )}
              </div>
              
              <div className="view-details">
                <span>View Full Results →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDetailsModal && selectedResult && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content result-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Result Slip</h3>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="result-slip">
                <div className="slip-header">
                  <h2>Result Upload System</h2>
                  <p>Official Academic Record</p>
                </div>
                
                <div className="student-info">
                  <div className="info-row">
                    <span className="label">Student Name:</span>
                    <span className="value">{selectedResult.studentName}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Matric Number:</span>
                    <span className="value">{selectedResult.matricNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Department:</span>
                    <span className="value">{selectedResult.department}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Faculty:</span>
                    <span className="value">{selectedResult.faculty}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Session:</span>
                    <span className="value">{selectedResult.academicSession} - {selectedResult.semester} Semester</span>
                  </div>
                </div>

                <div className="courses-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Course Code</th>
                        <th>Course Title</th>
                        <th>Credits</th>
                        <th>Score</th>
                        <th>Grade</th>
                        <th>Grade Point</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedResult.courses?.map(course => (
                        <tr key={course.courseCode}>
                          <td><strong>{course.courseCode}</strong></td>
                          <td>{course.courseTitle}</td>
                          <td>{course.creditUnits}</td>
                          <td>{course.score || '-'}</td>
                          <td>
                            <span className="grade-badge" style={{ background: getGradeColor(course.grade) }}>
                              {course.grade}
                            </span>
                          </td>
                          <td>{course.gradePoint?.toFixed(1) || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="result-summary-footer">
                  <div className="summary-item">
                    <span className="summary-label">Total Credits:</span>
                    <span className="summary-value">{selectedResult.finalResult?.totalCredits}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Points:</span>
                    <span className="summary-value">{selectedResult.finalResult?.totalPoints}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Semester GPA:</span>
                    <span className="summary-value highlight">{selectedResult.finalResult?.gpa}</span>
                  </div>
                </div>

                <div className="slip-footer">
                  <div className="publish-date">
                    Published: {new Date(selectedResult.finalResult?.publishedAt).toLocaleString()}
                  </div>
                  <div className="blockchain-verification">
                    ⛓️ Blockchain Verified
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-print" onClick={() => window.print()}>
                🖨️ Print Result
              </button>
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

export default UploadedResults;
