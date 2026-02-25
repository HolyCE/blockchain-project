import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import '../styles/RequestManagement.css';
import RequestStatusTracker from './RequestStatusTracker';

const RequestManagement = ({ userRole, userId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [comment, setComment] = useState('');

useEffect(() => {
  loadRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [userRole, userId]);

  const loadRequests = useCallback(async () => {
  setLoading(true);
  try {
    let data;
    if (userRole === 'student') {
      data = await API.getStudentRequests(userId);
    } else if (userRole === 'lecturer') {
      data = await API.getLecturerRequests(userId);
    } else if (userRole === 'course_advisor') {
      data = await API.getCourseAdvisorRequests(userId);
    } else if (userRole === 'hod') {
      data = await API.getHODRequests(userId);
    } else if (userRole === 'admin') {
      data = await API.getAdminRequests();
    }
    setRequests(data);
  } catch (error) {
    console.error('Error loading requests:', error);
  }
  setLoading(false);
}, [userRole, userId]);


  const handleActionClick = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setShowModal(true);
    setComment('');
  };

  const handleSubmitAction = async () => {
    if (!selectedRequest) return;

    try {
      let result;
      if (actionType === 'approve') {
        result = await API.approveRequest(selectedRequest.id, userRole, comment);
        alert(`Request approved!\nNew status: ${result.newStatus}`);
      } else if (actionType === 'reject') {
        if (!comment.trim()) {
          alert('Please provide a reason for rejection');
          return;
        }
        result = await API.rejectRequest(selectedRequest.id, comment);
        alert('Request rejected');
      }
      
      setShowModal(false);
      setSelectedRequest(null);
      loadRequests(); // Reload to show updated status
    } catch (error) {
      console.error('Error processing request:', error);
      alert('Failed to process request');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending Lecturer Review': '#fbbf24',
      'Approved by Lecturer - Awaiting Admin': '#3b82f6',
      'Approved by Admin - Ready for Blockchain': '#10b981',
      'Committed to Blockchain': '#059669',
      'Rejected': '#ef4444'
    };
    return colors[status] || '#94a3b8';
  };

 const canTakeAction = (request) => {
  if (userRole === 'lecturer' && request.status.includes('Pending Lecturer')) {
    return true;
  }
  if (userRole === 'course_advisor' && request.status.includes('Awaiting Course Advisor')) {
    return true;
  }
  if (userRole === 'hod' && request.status.includes('Awaiting HOD')) {
    return true;
  }
  if (userRole === 'admin' && request.status.includes('Awaiting Admin')) {
    return true;
  }
  return false;
};

  if (loading) return <div className="loading">Loading requests...</div>;

  return (
    <div className="request-management">
      <div className="section-header">
       <h3>
        {userRole === 'student' ? 'My Requests' : 
        userRole === 'lecturer' ? 'Pending Lecturer Approval' : 
        userRole === 'course_advisor' ? 'Pending Course Advisor Approval' :
   userRole === 'hod' ? 'Pending HOD Approval' :
   'Pending Admin Verification'}
       </h3>
        <p>
          {userRole === 'student' ? 'Track your result upload and correction requests' :
           userRole === 'lecturer' ? 'Review and approve student requests' :
           'Verify and commit approved requests to blockchain'}
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="no-requests">
          <p> No {userRole === 'student' ? 'active' : 'pending'} requests</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map(req => (
            <div key={req.id} className="request-card">
              <div className="request-card-header">
                <div>
                  <div className="request-course">
                    <strong>{req.courseCode}:</strong> {req.courseName}
                  </div>
                  {userRole === 'student' && (
    <div style={{ marginTop: '16px' }}>
    <RequestStatusTracker request={req} />
  </div>
)}
                </div>
                <span 
                  className="status-badge"
                  style={{ background: getStatusColor(req.status) }}
                >
                  {req.status}
                </span>
              </div>

              <div className="request-type-badge">
                {req.requestType === 'upload' ? '📤 Upload Request' : '✏️ Correction Request'}
              </div>

              <div className="request-message">
                <strong>Message:</strong>
                <p>{req.message}</p>
              </div>

              <div className="request-footer">
                <span className="request-time">
                  Created: {req.createdAt}
                </span>
                
                {canTakeAction(req) && (
                  <div className="request-actions">
                    <button 
                      className="btn-approve"
                      onClick={() => handleActionClick(req, 'approve')}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleActionClick(req, 'reject')}
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{actionType === 'approve' ? 'Approve Request' : 'Reject Request'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="selected-request-info">
                <strong>{selectedRequest?.courseCode}:</strong> {selectedRequest?.courseName}
                <div className="info-detail">Student: {selectedRequest?.studentName}</div>
                <div className="info-detail">Request: {selectedRequest?.message}</div>
              </div>
              
              <div className="form-group">
                <label>
                  {actionType === 'approve' ? 'Comment (Optional)' : 'Reason for Rejection *'}
                </label>
                <textarea
                  placeholder={
                    actionType === 'approve' 
                      ? 'Add any notes about this approval...' 
                      : 'Explain why this request is being rejected...'
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button 
                className={actionType === 'approve' ? 'btn-submit-approve' : 'btn-submit-reject'}
                onClick={handleSubmitAction}
              >
                {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestManagement;