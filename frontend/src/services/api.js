const BASE_URL = import.meta.env.VITE_API_URL || '';

async function fetchJson(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
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
