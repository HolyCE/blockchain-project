import LoadingSpinner from "./LoadingSpinner";
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ToastContainer } from './Toast';
import '../styles/LecturerGrading.css';

const LecturerGrading = ({ userId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [grades, setGrades] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [gradedCount, setGradedCount] = useState(0);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    loadGradingTasks();
  }, []);

  const loadGradingTasks = async () => {
    setLoading(true);
    try {
      const tasks = await API.getLecturerPendingRequests();
      setRequests(tasks);
      
      // Count already graded tasks
      let graded = 0;
      tasks.forEach(task => {
        if (task.coursesToGrade?.every(c => c.status === 'graded')) {
          graded++;
        }
      });
      setGradedCount(graded);
    } catch (error) {
      console.error('Error loading grading tasks:', error);
      addToast('Failed to load grading tasks', 'error');
    }
    setLoading(false);
  };

  const handleGradeClick = (request) => {
    // Initialize grades for this request
    const initialGrades = {};
    request.coursesToGrade?.forEach(course => {
      initialGrades[course.courseCode] = {
        score: course.score || '',
        grade: course.grade || '',
        comment: course.lecturerComment || ''
      };
    });
    setGrades(initialGrades);
    setSelectedRequest(request);
    setShowGradeModal(true);
  };

  const handleGradeChange = (courseCode, field, value) => {
    setGrades(prev => ({
      ...prev,
      [courseCode]: {
        ...prev[courseCode],
        [field]: value
      }
    }));
  };

  const calculateGradeFromScore = (score) => {
    const s = parseInt(score);
    if (isNaN(s)) return '';
    if (s >= 70) return 'A';
    if (s >= 60) return 'B';
    if (s >= 50) return 'C';
    if (s >= 45) return 'D';
    if (s >= 40) return 'E';
    return 'F';
  };

  const handleSubmitGrades = async () => {
    setSubmitting(true);
    try {
      const gradeData = Object.entries(grades).map(([courseCode, data]) => ({
        courseCode,
        score: parseInt(data.score),
        grade: data.grade,
        comment: data.comment
      }));
      
      await API.submitGrades(selectedRequest._id, gradeData);
      addToast('Grades submitted successfully!', 'success');
      setShowGradeModal(false);
      loadGradingTasks();
    } catch (error) {
      console.error('Error submitting grades:', error);
      addToast('Failed to submit grades', 'error');
    }
    setSubmitting(false);
  };

  const getStatusColor = (status) => {
    return API.mapStatusToDisplay(status).color;
  };

  const getStatusDisplay = (status) => {
    return API.mapStatusToDisplay(status).display;
  };

  const allCoursesGraded = () => {
    if (!selectedRequest) return false;
    return selectedRequest.coursesToGrade?.every(c => c.status === 'graded');
  };

  if (loading) return <LoadingSpinner message="Loading grading tasks..." />;

  return (
    <div className="lecturer-grading">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="section-header">
        <div>
          <h3>Grading Tasks</h3>
          <p className="request-count">
            {gradedCount} of {requests.length} tasks completed
          </p>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${requests.length ? (gradedCount / requests.length) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h4>No Pending Grading</h4>
          <p>All grading tasks have been completed. Great job!</p>
        </div>
      ) : (
        <div className="grading-grid">
          {requests.map(req => {
            const allGraded = req.coursesToGrade?.every(c => c.status === 'graded');
            return (
              <div key={req._id} className={`grading-card ${allGraded ? 'completed' : ''}`}>
                <div className="grading-card-header">
                  <div className="student-avatar">
                    {req.studentName?.charAt(0) || 'S'}
                  </div>
                  <div className="student-info">
                    <div className="student-name">{req.studentName}</div>
                    <div className="student-matric">{req.matricNumber}</div>
                    <div className="student-dept">{req.department}</div>
                  </div>
                  <span 
                    className="status-badge"
                    style={{ background: getStatusColor(req.status) }}
                  >
                    {getStatusDisplay(req.status)}
                  </span>
                </div>

                <div className="courses-list">
                  <h4>Courses to Grade:</h4>
                  {req.coursesToGrade?.map(course => (
                    <div key={course.courseCode} className={`course-item ${course.status === 'graded' ? 'graded' : ''}`}>
                      <div className="course-code">{course.courseCode}</div>
                      <div className="course-title">{course.courseTitle}</div>
                      <div className="course-credits">{course.creditUnits} credits</div>
                      {course.status === 'graded' && (
                        <div className="course-grade-badge">
                          {course.grade} ({course.score})
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button 
                  className={`grade-btn ${allGraded ? 'completed-btn' : ''}`}
                  onClick={() => handleGradeClick(req)}
                  disabled={allGraded}
                >
                  {allGraded ? '✓ Already Graded' : 'Enter Grades →'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Grade Entry Modal */}
      {showGradeModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowGradeModal(false)}>
          <div className="modal-content grade-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Enter Grades</h3>
              <div className="student-info-summary">
                <strong>{selectedRequest.studentName}</strong>
                <span>{selectedRequest.matricNumber}</span>
              </div>
              <button className="modal-close" onClick={() => setShowGradeModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              {selectedRequest.coursesToGrade?.map(course => (
                <div key={course.courseCode} className="grade-entry">
                  <div className="grade-entry-header">
                    <div className="course-code">{course.courseCode}</div>
                    <div className="course-title">{course.courseTitle}</div>
                    <div className="course-credits">{course.creditUnits} credits</div>
                  </div>
                  <div className="grade-inputs">
                    <div className="input-group">
                      <label>Score (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grades[course.courseCode]?.score || ''}
                        onChange={(e) => {
                          const score = e.target.value;
                          handleGradeChange(course.courseCode, 'score', score);
                          const grade = calculateGradeFromScore(score);
                          if (grade) {
                            handleGradeChange(course.courseCode, 'grade', grade);
                          }
                        }}
                        placeholder="Enter score"
                      />
                    </div>
                    <div className="input-group">
                      <label>Grade</label>
                      <select
                        value={grades[course.courseCode]?.grade || ''}
                        onChange={(e) => handleGradeChange(course.courseCode, 'grade', e.target.value)}
                      >
                        <option value="">Select Grade</option>
                        <option value="A">A (Excellent)</option>
                        <option value="B">B (Very Good)</option>
                        <option value="C">C (Good)</option>
                        <option value="D">D (Satisfactory)</option>
                        <option value="E">E (Pass)</option>
                        <option value="F">F (Fail)</option>
                      </select>
                    </div>
                    <div className="input-group full-width">
                      <label>Comment (Optional)</label>
                      <textarea
                        placeholder="Add any comments about the student's performance..."
                        value={grades[course.courseCode]?.comment || ''}
                        onChange={(e) => handleGradeChange(course.courseCode, 'comment', e.target.value)}
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowGradeModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-submit" 
                onClick={handleSubmitGrades}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit All Grades →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerGrading;
