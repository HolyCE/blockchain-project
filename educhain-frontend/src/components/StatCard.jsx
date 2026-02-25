import React from 'react';
import '../styles/StatCard.css';

const StatCard = ({ label, value, subtext, color }) => (
  <div className="stat-card">
    <div className="stat-content">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-subtext" style={{ color: color }}>{subtext}</div>
    </div>
  </div>
);

export default StatCard;
