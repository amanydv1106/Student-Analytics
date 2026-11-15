const BASE_URL = import.meta.env.VITE_API_URL || '';

const TOKEN_KEY = 'student_portal_token';
const USER_KEY = 'student_portal_user';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: () => {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch (_) {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
};

async function fetchJson(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = authStorage.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errData = await response.json();
      if (errData && errData.detail) errMessage = errData.detail;
    } catch (_) {}
    throw new Error(errMessage);
  }

  return response.json();
}

export const api = {
  checkHealth: () => fetchJson('/health'),
  
  // Student Authentication
  register: (studentData) =>
    fetchJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),
  login: (credentials) =>
    fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => fetchJson('/api/auth/me'),

  // Student Portal Diagnostics
  generateStudentReport: (reportInput) =>
    fetchJson('/api/student/report', {
      method: 'POST',
      body: JSON.stringify(reportInput),
    }),
  getStudentHistory: () => fetchJson('/api/student/history'),
  getReportById: (reportId) => fetchJson(`/api/student/report/${reportId}`),

  // ML Platform APIs
  predictStudent: (studentData) =>
    fetchJson('/api/predict', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),
  getSampleStudents: () => fetchJson('/api/sample-students'),
  batchPredict: (studentsList) =>
    fetchJson('/api/batch-predict', {
      method: 'POST',
      body: JSON.stringify(studentsList),
    }),
  simulateScenario: (baseStudent, simulatedChanges) =>
    fetchJson('/api/simulate', {
      method: 'POST',
      body: JSON.stringify({
        base_student: baseStudent,
        simulated_changes: simulatedChanges,
      }),
    }),
  getLeaderboard: () => fetchJson('/api/models/leaderboard'),
  getAnalyticsSummary: () => fetchJson('/api/analytics/summary'),
  getFigureUrl: (filename) => `${BASE_URL}/api/analytics/figures/${filename}`,
};
