import React from 'react';
import '../styles/RequestStatusTracker.css';

const RequestStatusTracker = ({ request }) => {
  const stages = [
    { id: 'submitted', label: 'Submitted', role: 'student' },
    { id: 'lecturer', label: 'Lecturer Review', role: 'lecturer' },
    { id: 'course_advisor', label: 'Course Advisor', role: 'course_advisor' },
    { id: 'hod', label: 'HOD Approval', role: 'hod' },
    { id: 'admin', label: 'Admin Verification', role: 'admin' },
    { id: 'blockchain', label: 'Blockchain', role: 'admin' }
  ];

  const getCurrentStage = (status) => {
    if (!status) return 0;
    
    if (status.includes('Pending Lecturer') || status.includes('Awaiting Lecturer')) return 1;
    if (status.includes('Approved by Lecturer') || status.includes('Awaiting Course Advisor')) return 2;
    if (status.includes('Approved by Course Advisor') || status.includes('Awaiting HOD')) return 3;
    if (status.includes('Approved by HOD') || status.includes('Awaiting Admin')) return 4;
    if (status.includes('Approved by Admin') || status.includes('Ready for Blockchain')) return 5;
    if (status.includes('Committed to Blockchain')) return 6;
    
    return 0;
  };

  const currentStage = request ? getCurrentStage(request.status) : 0;

  return (
    <div className="request-status-tracker">
      <h4>Request Progress</h4>
      <div className="tracker-timeline">
        {stages.map((stage, index) => (
          <div 
            key={stage.id} 
            className={`tracker-stage ${index < currentStage ? 'completed' : ''} ${index === currentStage ? 'active' : ''} ${index > currentStage ? 'pending' : ''}`}
          >
            <div className="stage-indicator">
              {index < currentStage ? '✓' : index + 1}
            </div>
            <div className="stage-label">{stage.label}</div>
            {index < stages.length - 1 && (
              <div className={`stage-connector ${index < currentStage ? 'completed' : ''}`}></div>
            )}
          </div>
        ))}
      </div>
      
      {request && (
        <div className="current-status">
          <strong>Current Status:</strong> {request.status}
        </div>
      )}
    </div>
  );
};

export default RequestStatusTracker;