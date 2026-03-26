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
      addToast('Failed to load results: ' + (error.response?.data?.message || error.message), 'error');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllResults();
  }, [fetchAllResults]);

  const publishToBlockchain = async (resultId) => {
    if (!window.confirm('📤 Publish this result to the blockchain?\n\nThis action is permanent and cannot be undone.')) {
      return;
    }
    
    setPublishing(resultId);
    try {
      const response = await API.publishResultToBlockchain(resultId);
      addToast(`✅ Result published! Hash: ${response.transactionHash.slice(0, 20)}...`, 'success');
      fetchAllResults();
    } catch (error) {
      addToast(`❌ Failed: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setPublishing(null);
    }
  };

  const exportToCSV = () => {
    if (results.length === 0) {
      addToast('No results to export', 'warning');
      return;
    }
    
    const headers = ['Student Name', 'Matric Number', 'Department', 'Session', 'Semester', 'GPA', 'Blockchain Status'];
    const rows = results.map(r => [
      r.studentName,
      r.matricNumber,
      r.department,
      r.academicSession,
      r.semester,
      r.finalResult?.gpa || 'N/A',
      r.blockchainHash ? 'Published' : 'Not Published'
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `published_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`📥 Exported ${results.length} results`, 'success');
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
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-results-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="results-header">
        <div className="header-title">
          <h2>📊 Published Results Management</h2>
          <p>Manage and publish academic results to the blockchain for permanent verification</p>
        </div>
        <div className="header-actions">
          <button onClick={exportToCSV} className="btn-export">📥 Export CSV</button>
          <button onClick={fetchAllResults} className="btn-refresh">🔄 Refresh</button>
        </div>
      </div>

      <div className="stats-grid-enhanced">
        <div className="stat-card-enhanced">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Total Results</h3>
            <p className="stat-number">{results.length}</p>
          </div>
        </div>
        <div className="stat-card-enhanced success">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Blockchain Published</h3>
            <p className="stat-number">{results.filter(r => r.blockchainHash).length}</p>
          </div>
        </div>
        <div className="stat-card-enhanced warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending Publication</h3>
            <p className="stat-number">{results.filter(r => !r.blockchainHash).length}</p>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Results Found</h3>
          <p>Completed results will appear here once the workflow is complete.</p>
        </div>
      ) : (
        <div className="results-table-wrapper">
          <table className="results-table-enhanced">
            <thead>
              <tr><th>Student</th><th>Matric Number</th><th>Department</th><th>Session</th><th>GPA</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result._id}>
                  <td><div className="student-cell"><div className="student-avatar">{result.studentName?.charAt(0) || 'S'}</div><div className="student-name">{result.studentName}</div></div></td>
                  <td className="matric">{result.matricNumber}</td>
                  <td>{result.department}</td>
                  <td>{result.academicSession}<br/><small>{result.semester} Semester</small></td>
                  <td><span className="gpa-badge-enhanced" style={{ background: getGPAColor(result.finalResult?.gpa) }}>{result.finalResult?.gpa || 'N/A'}</span></td>
                  <td>{result.blockchainHash ? <span className="status-badge published">✅ Published</span> : <span className="status-badge pending">⏳ Pending</span>}</td>
                  <td><div className="action-buttons"><button className="btn-view" onClick={() => setSelectedResult(result)}>👁️ View</button>{!result.blockchainHash && <button className="btn-publish" onClick={() => publishToBlockchain(result._id)} disabled={publishing === result._id}>{publishing === result._id ? '⏳ Publishing...' : '📤 Publish'}</button>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedResult && (
        <div className="modal-overlay" onClick={() => setSelectedResult(null)}>
          <div className="modal-content-enhanced" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>📄 Result Details</h3><button className="modal-close" onClick={() => setSelectedResult(null)}>×</button></div>
            <div className="modal-body">
              <div className="student-info-card"><div className="info-row"><span className="info-label">Student:</span><span className="info-value">{selectedResult.studentName}</span></div><div className="info-row"><span className="info-label">Matric Number:</span><span className="info-value">{selectedResult.matricNumber}</span></div><div className="info-row"><span className="info-label">Department:</span><span className="info-value">{selectedResult.department}</span></div><div className="info-row"><span className="info-label">Session:</span><span className="info-value">{selectedResult.academicSession} - {selectedResult.semester} Semester</span></div></div>
              <h4>📚 Course Results</h4>
              <table className="courses-table-enhanced"><thead><tr><th>Course Code</th><th>Course Title</th><th>Credits</th><th>Score</th><th>Grade</th><th>GP</th></tr></thead><tbody>{selectedResult.courses?.map((c, i) => (<tr key={i}><td><strong>{c.courseCode}</strong></td><td>{c.courseTitle}</td><td>{c.creditUnits}</td><td>{c.score || 'N/A'}</td><td><span className="grade-badge">{c.grade || 'N/A'}</span></td><td>{c.gradePoint || 'N/A'}</td></tr>))}</tbody><tfoot><tr className="total-row"><td colSpan="2"><strong>Total Credits:</strong></td><td><strong>{selectedResult.finalResult?.totalCredits}</strong></td><td colSpan="2"><strong>GPA:</strong></td><td><strong className="gpa-large">{selectedResult.finalResult?.gpa}</strong></td></tr></tfoot></table>
              {selectedResult.blockchainHash && (<div className="blockchain-info-card"><div className="blockchain-header">🔗 Blockchain Verification</div><div className="blockchain-details"><p><strong>Transaction Hash:</strong></p><code className="hash-code">{selectedResult.blockchainHash}</code><p><strong>Published:</strong> {new Date(selectedResult.verificationDate).toLocaleString()}</p></div></div>)}
            </div>
            <div className="modal-footer"><button className="btn-close-modal" onClick={() => setSelectedResult(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResults;
