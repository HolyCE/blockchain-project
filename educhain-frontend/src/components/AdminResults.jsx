import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { ToastContainer } from './Toast';
import './AdminResults.css';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [publishing, setPublishing] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchAllResults = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.getCompletedRequests();
      setResults(response.requests || []);
    } catch (error) {
      addToast('Failed to load results', 'error');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllResults();
  }, [fetchAllResults]);

  const publishToBlockchain = async (resultId) => {
    if (!window.confirm('Publish this result to the blockchain?')) return;
    
    setPublishing(resultId);
    try {
      const response = await API.publishResultToBlockchain(resultId);
      addToast('Result published successfully!', 'success');
      fetchAllResults();
    } catch (error) {
      addToast('Failed to publish', 'error');
    } finally {
      setPublishing(null);
    }
  };

  const exportToCSV = () => {
    if (results.length === 0) {
      addToast('No results to export', 'warning');
      return;
    }
    
    const headers = ['Student Name', 'Matric Number', 'Department', 'Session', 'GPA', 'Status'];
    const rows = results.map(r => [
      r.studentName,
      r.matricNumber,
      r.department,
      `${r.academicSession} - ${r.semester}`,
      r.finalResult?.gpa || 'N/A',
      r.blockchainHash ? 'Published' : 'Pending'
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Exported successfully', 'success');
  };

  const getGPAColor = (gpa) => {
    if (gpa >= 4.5) return '#10b981';
    if (gpa >= 3.5) return '#3b82f6';
    if (gpa >= 2.5) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="admin-results-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-results-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="results-header">
        <div>
          <h2>Published Results</h2>
          <p>Manage and publish academic results to the blockchain</p>
        </div>
        <div className="header-buttons">
          <button onClick={exportToCSV} className="btn-export">Export CSV</button>
          <button onClick={fetchAllResults} className="btn-refresh">Refresh</button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <div>
            <div className="stat-label">Total Results</div>
            <div className="stat-value">{results.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div>
            <div className="stat-label">Published</div>
            <div className="stat-value">{results.filter(r => r.blockchainHash).length}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div>
            <div className="stat-label">Pending</div>
            <div className="stat-value">{results.filter(r => !r.blockchainHash).length}</div>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <div>📭</div>
          <h3>No Results Found</h3>
          <p>Completed results will appear here</p>
        </div>
      ) : (
        <div className="results-list">
          {results.map(result => (
            <div key={result._id} className="result-card">
              <div className="result-header">
                <div className="student-info">
                  <div className="student-avatar">{result.studentName?.charAt(0) || 'S'}</div>
                  <div>
                    <div className="student-name">{result.studentName}</div>
                    <div className="student-matric">{result.matricNumber}</div>
                  </div>
                </div>
                <div className="gpa-chip" style={{ background: getGPAColor(result.finalResult?.gpa) }}>
                  GPA: {result.finalResult?.gpa || 'N/A'}
                </div>
              </div>
              
              <div className="result-details">
                <div className="detail-row">
                  <span className="detail-label">Department:</span>
                  <span>{result.department}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Session:</span>
                  <span>{result.academicSession} - {result.semester}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={result.blockchainHash ? 'status-published' : 'status-pending'}>
                    {result.blockchainHash ? '✅ Published' : '⏳ Pending'}
                  </span>
                </div>
              </div>
              
              <div className="result-actions">
                <button className="btn-view" onClick={() => setSelectedResult(result)}>
                  View Details
                </button>
                {!result.blockchainHash && (
                  <button 
                    className="btn-publish"
                    onClick={() => publishToBlockchain(result._id)}
                    disabled={publishing === result._id}
                  >
                    {publishing === result._id ? 'Publishing...' : 'Publish'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal Design */}
      {selectedResult && (
        <div className="modal-overlay" onClick={() => setSelectedResult(null)}>
          <div className="modern-modal" onClick={e => e.stopPropagation()}>
            {/* Modal Header with Gradient */}
            <div className="modal-gradient-header">
              <div className="modal-header-content">
                <div className="modal-icon">🎓</div>
                <div>
                  <h2>Academic Transcript</h2>
                  <p>Student Result Details</p>
                </div>
                <button className="modal-close-btn" onClick={() => setSelectedResult(null)}>×</button>
              </div>
            </div>

            <div className="modal-body-modern">
              {/* Student Profile Card */}
              <div className="student-profile-card">
                <div className="profile-avatar">{selectedResult.studentName?.charAt(0) || 'S'}</div>
                <div className="profile-info">
                  <h3>{selectedResult.studentName}</h3>
                  <div className="profile-details">
                    <span className="profile-badge">📋 {selectedResult.matricNumber}</span>
                    <span className="profile-badge">🏛️ {selectedResult.department}</span>
                    <span className="profile-badge">📅 {selectedResult.academicSession}</span>
                    <span className="profile-badge">📖 {selectedResult.semester} Semester</span>
                  </div>
                </div>
                <div className="gpa-large-card" style={{ background: getGPAColor(selectedResult.finalResult?.gpa) }}>
                  <span className="gpa-label">GPA</span>
                  <span className="gpa-value">{selectedResult.finalResult?.gpa || 'N/A'}</span>
                </div>
              </div>

              {/* Courses Section */}
              <div className="courses-section-modern">
                <div className="section-title">
                  <span className="title-icon">📚</span>
                  <h3>Course Results</h3>
                  <span className="course-count">{selectedResult.courses?.length || 0} courses</span>
                </div>
                
                <div className="courses-grid-modern">
                  {selectedResult.courses?.map((c, i) => (
                    <div key={i} className="course-card-modern">
                      <div className="course-header">
                        <span className="course-code">{c.courseCode}</span>
                        <span className={`grade-badge-modern grade-${c.grade?.toLowerCase() || 'pending'}`}>
                          {c.grade || 'PENDING'}
                        </span>
                      </div>
                      <div className="course-title-modern">{c.courseTitle}</div>
                      <div className="course-stats">
                        <div className="stat-item">
                          <span className="stat-label-small">Credits</span>
                          <span className="stat-value-small">{c.creditUnits}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label-small">Score</span>
                          <span className="stat-value-small">{c.score || 'N/A'}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label-small">Grade Point</span>
                          <span className="stat-value-small">{c.gradePoint || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Card */}
                <div className="summary-card">
                  <div className="summary-item">
                    <span className="summary-label">Total Credits</span>
                    <span className="summary-value">{selectedResult.finalResult?.totalCredits || 0}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-item">
                    <span className="summary-label">Total Points</span>
                    <span className="summary-value">{selectedResult.finalResult?.totalPoints || 0}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-item">
                    <span className="summary-label">GPA</span>
                    <span className="summary-value highlight" style={{ color: getGPAColor(selectedResult.finalResult?.gpa) }}>
                      {selectedResult.finalResult?.gpa || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Blockchain Verification Section */}
              {selectedResult.blockchainHash && (
                <div className="blockchain-section-modern">
                  <div className="section-title">
                    <span className="title-icon">🔗</span>
                    <h3>Blockchain Verification</h3>
                    <span className="verified-badge-modern">✓ Verified</span>
                  </div>
                  <div className="blockchain-details-modern">
                    <div className="hash-container">
                      <span className="hash-label">Transaction Hash</span>
                      <code className="hash-code-modern">{selectedResult.blockchainHash}</code>
                    </div>
                    <div className="verification-date">
                      <span>📅 Published: {new Date(selectedResult.verificationDate).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer-modern">
              <button className="btn-close-modern" onClick={() => setSelectedResult(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResults;
