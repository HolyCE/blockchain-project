// ==================== REAL BACKEND API SERVICE ====================
import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const API = {
  // ========== AUTHENTICATION ==========
  login: async (identifier, password) => {
    try {
      console.log('🔐 Login attempt with:', { identifier, password });
      
      // Determine if identifier is email or matric number
      const isEmail = identifier.includes('@');
      
      // Prepare the request body based on what the backend expects
      const requestBody = isEmail 
        ? { email: identifier, password }  // Email login
        : { matricNumber: identifier, password };  // Matric number login
      
      console.log('📤 Sending request body:', requestBody);
      
      const response = await apiClient.post('/auth/login', requestBody);
      
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      
      return {
        success: true,
        token,
        user: {
          id: user._id,
          name: user.fullName,
          email: user.email,
          role: user.role,
          department: user.department,
          faculty: user.faculty,
          matricNumber: user.matricNumber,
          level: user.level,
          profilePicture: user.profilePicture
        }
      };
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors
      };
    }
  },

  register: async (userData) => {
    try {
      console.log('📝 Registering user:', userData);
      
      const response = await apiClient.post('/auth/register', userData);
      
      console.log('✅ Registration response:', response.data);
      
      return {
        success: true,
        message: 'Registration successful',
        data: response.data
      };
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error.message);
      
      let errorMessage = 'Registration failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(e => e.msg).join(', ');
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  // ========== DASHBOARD STATS ==========
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // ========== STUDENT SPECIFIC ==========
  getStudentRequests: async () => {
    try {
      const response = await apiClient.get('/result-requests/student/my-requests');
      return response.data.requests;
    } catch (error) {
      console.error('Error fetching student requests:', error);
      return [];
    }
  },

  createResultRequestDraft: async () => {
    try {
      const response = await apiClient.post('/result-requests/create');
      return response.data;
    } catch (error) {
      console.error('Error creating draft:', error);
      throw error;
    }
  },

  addCoursesToRequest: async (requestId, courses) => {
    try {
      const response = await apiClient.post(`/result-requests/${requestId}/courses`, {
        courses: courses.map(code => ({ courseCode: code }))
      });
      return response.data;
    } catch (error) {
      console.error('Error adding courses:', error);
      throw error;
    }
  },

  submitResultRequest: async (requestId, data) => {
    try {
      const response = await apiClient.post(`/result-requests/${requestId}/submit`, {
        academicSession: data.academicSession,
        semester: data.semester,
        resultLevel: data.resultLevel
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting request:', error);
      throw error;
    }
  },

  // ========== LECTURER SPECIFIC ==========
  getLecturerRequests: async () => {
    try {
      const response = await apiClient.get('/result-requests/lecturer/pending-grading');
      return response.data.requests;
    } catch (error) {
      console.error('Error fetching lecturer requests:', error);
      return [];
    }
  },

  submitGrades: async (requestId, grades) => {
    try {
      const response = await apiClient.post(`/result-requests/${requestId}/submit-grades`, {
        grades
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting grades:', error);
      throw error;
    }
  },

  // ========== COURSE ADVISOR SPECIFIC ==========
  getCourseAdvisorRequests: async () => {
    try {
      const response = await apiClient.get('/result-requests/advisor/pending');
      return response.data.requests;
    } catch (error) {
      console.error('Error fetching advisor requests:', error);
      return [];
    }
  },

  assignToLecturers: async (requestId, comment = '') => {
    try {
      const response = await apiClient.post(`/result-requests/${requestId}/advisor-action`, {
        comment
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning to lecturers:', error);
      throw error;
    }
  },

  // ========== HOD SPECIFIC ==========
  getHODRequests: async () => {
    try {
      const response = await apiClient.get('/result-requests/hod/pending');
      return response.data.requests;
    } catch (error) {
      console.error('Error fetching HOD requests:', error);
      return [];
    }
  },

  forwardToAdvisor: async (requestId, courseAdvisorId, comment = '') => {
    try {
      const response = await apiClient.post(`/result-requests/${requestId}/hod-action`, {
        courseAdvisorId,
        comment
      });
      return response.data;
    } catch (error) {
      console.error('Error forwarding to advisor:', error);
      throw error;
    }
  },

  getFinalApprovalRequests: async () => {
    try {
      const response = await apiClient.get('/result-requests/hod/final-approval');
      return response.data.requests;
    } catch (error) {
      console.error('Error fetching final approval requests:', error);
      return [];
    }
  },

  finalApprove: async (requestId, comment = '', publishToStudent = true) => {
    try {
      const response = await apiClient.post(`/result-requests/${requestId}/final-approve`, {
        comment,
        publishToStudent
      });
      return response.data;
    } catch (error) {
      console.error('Error in final approval:', error);
      throw error;
    }
  },

  // ========== SCHOOL OFFICER SPECIFIC ==========
  getSchoolOfficerRequests: async () => {
    try {
      const response = await apiClient.get('/result-requests/school-officer/pending');
      return response.data.requests;
    } catch (error) {
      console.error('Error fetching school officer requests:', error);
      return [];
    }
  },

  schoolOfficerAction: async (requestId, action, comment = '') => {
    try {
      const response = await apiClient.post(`/result-requests/${requestId}/school-officer-action`, {
        action,
        comment
      });
      return response.data;
    } catch (error) {
      console.error('Error processing school officer action:', error);
      throw error;
    }
  },

  // ========== ADMIN SPECIFIC ==========
  getAdminRequests: async () => {
    try {
      const response = await apiClient.get('/result-requests/admin/all');
      return response.data.requests;
    } catch (error) {
      console.error('Error fetching admin requests:', error);
      return [];
    }
  },

  // ========== COURSES ==========
  getAllCourses: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/courses${params ? '?' + params : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      return { courses: [], total: 0 };
    }
  },

  getCoursesByDepartment: async (department, level = null) => {
    try {
      const params = {};
      if (level) params.level = level;
      const response = await apiClient.get(`/courses/department/${department}`, { params });
      return response.data.courses;
    } catch (error) {
      console.error('Error fetching department courses:', error);
      return [];
    }
  },

  getLecturerCourses: async () => {
    try {
      const response = await apiClient.get('/courses/lecturer/my-courses');
      return response.data.courses;
    } catch (error) {
      console.error('Error fetching lecturer courses:', error);
      return [];
    }
  },

  // ========== NOTIFICATIONS ==========
  getNotifications: async (unreadOnly = false) => {
    try {
      const response = await apiClient.get('/notifications', {
        params: { unread: unreadOnly }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { notifications: [], unreadCount: 0 };
    }
  },

  markNotificationRead: async (notificationId) => {
    try {
      const response = await apiClient.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification read:', error);
      throw error;
    }
  },

  markAllNotificationsRead: async () => {
    try {
      const response = await apiClient.post('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications read:', error);
      throw error;
    }
  },

  // ========== HELPER FUNCTIONS ==========
  mapStatusToDisplay: (backendStatus) => {
    const statusMap = {
      'draft': { display: 'Draft', color: '#94a3b8', progress: 10 },
      'submitted': { display: 'Pending School Officer', color: '#fbbf24', progress: 20 },
      'department_review': { display: 'Department Review', color: '#f97316', progress: 30 },
      'advisor_review': { display: 'Course Advisor Review', color: '#8b5cf6', progress: 40 },
      'lecturer_grading': { display: 'Lecturer Grading', color: '#3b82f6', progress: 60 },
      'hod_review': { display: 'HOD Final Review', color: '#ec4899', progress: 80 },
      'approved': { display: 'Approved', color: '#10b981', progress: 90 },
      'rejected': { display: 'Rejected', color: '#ef4444', progress: 0 },
      'completed': { display: 'Published', color: '#059669', progress: 100 }
    };
    return statusMap[backendStatus] || { display: backendStatus, color: '#64748b', progress: 0 };
  },

  getNextApprover: (status) => {
    const approverMap = {
      'submitted': 'School Officer',
      'department_review': 'HOD',
      'advisor_review': 'Course Advisor',
      'lecturer_grading': 'Lecturer',
      'hod_review': 'HOD (Final)',
      'approved': 'Ready to Publish'
    };
    return approverMap[status] || 'Unknown';
  },

  getProgressPercentage: (status) => {
    return API.mapStatusToDisplay(status).progress;
  }
};

export default API;
