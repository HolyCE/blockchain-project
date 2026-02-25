import React, { useState, useEffect } from 'react';
import API from '../services/api';
import '../styles/StudentRequestButton.css';

const StudentRequestButton = ({ userId, onRequestSubmitted }) => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1); // 1: select courses, 2: submit details
  const [requestId, setRequestId] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    academicSession: '',
    semester: 'First',
    resultLevel: ''
  });

  // Load available courses when modal opens
  useEffect(() => {
    if (showModal && step === 1) {
      loadAvailableCourses();
    }
  }, [showModal, step]);

  const loadAvailableCourses = async () => {
    setLoading(true);
    try {
      // Get user data from localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Fetch courses for student's department and level
        const courses = await API.getCoursesByDepartment(user.department, user.level);
        setAvailableCourses(courses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCourseToggle = (courseCode) => {
    setSelectedCourses(prev => 
      prev.includes(courseCode)
        ? prev.filter(c => c !== courseCode)
        : [...prev, courseCode]
    );
  };

  const handleCreateDraft = async () => {
    if (selectedCourses.length === 0) {
      alert('Please select at least one course');
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Create draft
      const draftResult = await API.createResultRequestDraft();
      const newRequestId = draftResult.requestId;
      setRequestId(newRequestId);

      // Step 2: Add courses to draft
      await API.addCoursesToRequest(newRequestId, selectedCourses);
      
      // Move to next step
      setStep(2);
    } catch (error) {
      console.error('Error creating draft:', error);
      alert('Failed to create request draft');
    }
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.academicSession || !formData.semester || !formData.resultLevel) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate academic session format (YYYY/YYYY)
    const sessionRegex = /^\d{4}\/\d{4}$/;
    if (!sessionRegex.test(formData.academicSession)) {
      alert('Academic session must be in format: YYYY/YYYY (e.g., 2023/2024)');
      return;
    }

    setSubmitting(true);
    try {
      // Step 3: Submit the completed request
      const result = await API.submitResultRequest(requestId, {
        academicSession: formData.academicSession,
        semester: formData.semester,
        resultLevel: parseInt(formData.resultLevel)
      });
      
      if (result) {
        alert('Request submitted successfully! It will now be reviewed by the school officer.');
        resetForm();
        setShowModal(false);
        if (onRequestSubmitted) onRequestSubmitted();
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request');
    }
    setSubmitting(false);
  };

  const resetForm = () => {
    setStep(1);
    setRequestId(null);
    setSelectedCourses([]);
    setFormData({
      academicSession: '',
      semester: 'First',
      resultLevel: ''
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <>
      <button className="request-upload-button" onClick={() => setShowModal(true)}>
        📤 Request Result Upload
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {step === 1 ? 'Select Courses' : 'Request Details'}
                {step === 1 && ' (Step 1 of 2)'}
                {step === 2 && ' (Step 2 of 2)'}
              </h3>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            {step === 1 ? (
              /* Step 1: Course Selection */
              <div className="modal-body">
                {loading ? (
                  <div className="loading-spinner">Loading available courses...</div>
                ) : (
                  <>
                    <p className="step-instruction">
                      Select the courses you want to request results for:
                    </p>
                    
                    <div className="courses-list">
                      {availableCourses.length === 0 ? (
                        <p className="no-courses">No courses available for your department and level</p>
                      ) : (
                        availableCourses.map(course => (
                          <label 
                            key={course.code} 
                            className={`course-item ${selectedCourses.includes(course.code) ? 'selected' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCourses.includes(course.code)}
                              onChange={() => handleCourseToggle(course.code)}
                            />
                            <div className="course-info">
                              <span className="course-code">{course.code}</span>
                              <span className="course-title">{course.title}</span>
                              <span className="course-credits">{course.creditUnits} credits</span>
                            </div>
                          </label>
                        ))
                      )}
                    </div>

                    <div className="selected-count">
                      Selected: {selectedCourses.length} course(s)
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Step 2: Request Details Form */
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <p className="step-instruction">
                    Provide academic session details for your request:
                  </p>

                  <div className="selected-courses-summary">
                    <strong>Selected Courses:</strong>
                    <ul>
                      {selectedCourses.map(code => {
                        const course = availableCourses.find(c => c.code === code);
                        return (
                          <li key={code}>
                            {code} - {course?.title || ''}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="form-group">
                    <label>Academic Session *</label>
                    <input
                      type="text"
                      name="academicSession"
                      placeholder="e.g., 2023/2024"
                      value={formData.academicSession}
                      onChange={handleChange}
                      required
                    />
                    <small className="field-hint">Format: YYYY/YYYY (e.g., 2023/2024)</small>
                  </div>

                  <div className="form-group">
                    <label>Semester *</label>
                    <select 
                      name="semester" 
                      value={formData.semester} 
                      onChange={handleChange}
                      required
                    >
                      <option value="First">First Semester</option>
                      <option value="Second">Second Semester</option>
                      <option value="Rain">Rain Semester</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Result Level *</label>
                    <select
                      name="resultLevel"
                      value={formData.resultLevel}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Level</option>
                      <option value="100">100 Level</option>
                      <option value="200">200 Level</option>
                      <option value="300">300 Level</option>
                      <option value="400">400 Level</option>
                      <option value="500">500 Level</option>
                      <option value="600">600 Level</option>
                    </select>
                  </div>

                  <div className="info-box workflow-info">
                    <strong>📋 Approval Workflow:</strong>
                    <ol>
                      <li>School Officer reviews your request</li>
                      <li>HOD assigns to Course Advisor</li>
                      <li>Course Advisor assigns to Lecturers</li>
                      <li>Lecturers enter grades</li>
                      <li>HOD gives final approval</li>
                      <li>Results published to your dashboard</li>
                    </ol>
                  </div>
                </div>

                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn-back" 
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit" 
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}

            {step === 1 && (
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-next" 
                  onClick={handleCreateDraft}
                  disabled={selectedCourses.length === 0 || submitting}
                >
                  {submitting ? 'Creating...' : 'Next →'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StudentRequestButton;