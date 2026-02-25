import React, { useState, useEffect } from 'react';
import '../styles/ResultTable.css';

const ResultTable = ({ courseData, onCommit, userRole }) => {
  const [editMode, setEditMode] = useState({});
  const [localData, setLocalData] = useState(courseData?.students || []);

  useEffect(() => {
    setLocalData(courseData?.students || []);
  }, [courseData]);

  const handleScoreChange = (studentId, newScore) => {
    setLocalData(prev => prev.map(student => 
      student.id === studentId ? { ...student, score: parseInt(newScore) || 0 } : student
    ));
  };

  const toggleEdit = (studentId) => {
    setEditMode(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#fbbf24',
      'Verified': '#10b981',
      'Draft': '#94a3b8'
    };
    return colors[status] || '#94a3b8';
  };

  if (!courseData) return <div className="loading">Loading course data...</div>;

  return (
    <div className="result-section">
      <div className="result-header">
        <div>
          <h3>{courseData.courseCode}: {courseData.courseName}</h3>
          <p>{courseData.semester} • {courseData.department}</p>
        </div>
        {userRole === 'admin' && (
          <button className="commit-btn" onClick={() => onCommit(localData)}>
            ⛓️ Commit to Blockchain
          </button>
        )}
      </div>

      <table className="result-table">
        <thead>
          <tr>
            <th>STUDENT ID</th>
            <th>NAME</th>
            <th>SCORE</th>
            <th>GRADE</th>
            <th>STATUS</th>
            {userRole === 'admin' && <th>ACTION</th>}
          </tr>
        </thead>
        <tbody>
          {localData.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>
                {userRole === 'lecturer' && editMode[student.id] ? (
                  <input
                    type="number"
                    className="score-input"
                    value={student.score}
                    onChange={(e) => handleScoreChange(student.id, e.target.value)}
                    min="0"
                    max="100"
                  />
                ) : (
                  <span className="score-display">{student.score}</span>
                )}
              </td>
              <td><span className="grade-badge">{student.grade}</span></td>
              <td>
                <span 
                  className="status-badge"
                  style={{ background: getStatusColor(student.status) }}
                >
                  {student.status}
                </span>
              </td>
              {userRole === 'lecturer' && (
                <td>
                  <button 
                    className="edit-btn"
                    onClick={() => toggleEdit(student.id)}
                  >
                    {editMode[student.id] ? '✓' : '✏️'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
