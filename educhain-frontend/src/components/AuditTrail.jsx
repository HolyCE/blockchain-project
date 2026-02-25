import React from 'react';
import '../styles/AuditTrail.css';

const AuditTrail = ({ events }) => {
  const getIcon = (type) => {
    const icons = {
      upload: '📤',
      blockchain: '✓',
      admin: '🔐'
    };
    return icons[type] || '📋';
  };

  const getColor = (type) => {
    const colors = {
      upload: '#3b82f6',
      blockchain: '#10b981',
      admin: '#8b5cf6'
    };
    return colors[type] || '#64748b';
  };

  return (
    <div className="audit-trail">
      <h3>Audit Trail</h3>
      <div className="trail-events">
        {events.map((event, idx) => (
          <div key={idx} className="trail-event">
            <div 
              className="event-icon"
              style={{ background: getColor(event.type) }}
            >
              {getIcon(event.type)}
            </div>
            <div className="event-content">
              <div className="event-title">{event.message}</div>
              <div className="event-detail">{event.detail}</div>
              <div className="event-time">{event.time}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="view-full-log">View Full Log</button>
    </div>
  );
};

export default AuditTrail;
