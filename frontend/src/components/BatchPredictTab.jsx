import React, { useState } from 'react';
import { Users, Play, Download, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

const SAMPLE_BATCH = [
  { institution_id: 1, program: 'Computer Science', semester: 4, age: 21, study_hours_per_day: 6.0, attendance_pct: 95.0, previous_gpa: 8.9, assignment_completion_pct: 98.0, internal_marks: 92.0, sleep_hours: 8.0, commute_minutes: 15.0, internet_access: 'Reliable', parental_education: 'Postgraduate', extracurricular_level: 'High', financial_pressure: 'Low', part_time_job: 'No', lms_logins: 42, missed_deadlines: 0 },
  { institution_id: 2, program: 'Science', semester: 3, age: 22, study_hours_per_day: 4.0, attendance_pct: 82.0, previous_gpa: 7.4, assignment_completion_pct: 85.0, internal_marks: 78.0, sleep_hours: 7.0, commute_minutes: 30.0, internet_access: 'Reliable', parental_education: 'Undergraduate', extracurricular_level: 'Medium', financial_pressure: 'Low', part_time_job: 'No', lms_logins: 24, missed_deadlines: 1 },
  { institution_id: 3, program: 'Commerce', semester: 2, age: 23, study_hours_per_day: 1.5, attendance_pct: 54.0, previous_gpa: 4.8, assignment_completion_pct: 50.0, internal_marks: 44.0, sleep_hours: 5.0, commute_minutes: 75.0, internet_access: 'Limited', parental_education: 'School', extracurricular_level: 'Low', financial_pressure: 'High', part_time_job: 'Yes', lms_logins: 5, missed_deadlines: 4 },
  { institution_id: 4, program: 'Management', semester: 5, age: 24, study_hours_per_day: 3.5, attendance_pct: 76.0, previous_gpa: 6.9, assignment_completion_pct: 74.0, internal_marks: 66.0, sleep_hours: 6.5, commute_minutes: 40.0, internet_access: 'Reliable', parental_education: 'Undergraduate', extracurricular_level: 'Medium', financial_pressure: 'Medium', part_time_job: 'No', lms_logins: 16, missed_deadlines: 2 },
  { institution_id: 5, program: 'Arts', semester: 1, age: 19, study_hours_per_day: 2.0, attendance_pct: 62.0, previous_gpa: 5.8, assignment_completion_pct: 60.0, internal_marks: 52.0, sleep_hours: 6.0, commute_minutes: 60.0, internet_access: 'Limited', parental_education: 'School', extracurricular_level: 'Low', financial_pressure: 'High', part_time_job: 'No', lms_logins: 8, missed_deadlines: 3 },
  { institution_id: 6, program: 'Computer Science', semester: 6, age: 22, study_hours_per_day: 5.5, attendance_pct: 91.0, previous_gpa: 8.3, assignment_completion_pct: 94.0, internal_marks: 86.0, sleep_hours: 7.5, commute_minutes: 25.0, internet_access: 'Reliable', parental_education: 'Postgraduate', extracurricular_level: 'High', financial_pressure: 'Low', part_time_job: 'No', lms_logins: 38, missed_deadlines: 0 },
  { institution_id: 7, program: 'Science', semester: 4, age: 21, study_hours_per_day: 1.0, attendance_pct: 48.0, previous_gpa: 4.2, assignment_completion_pct: 42.0, internal_marks: 38.0, sleep_hours: 4.5, commute_minutes: 90.0, internet_access: 'No access', parental_education: 'School', extracurricular_level: 'Low', financial_pressure: 'High', part_time_job: 'Yes', lms_logins: 3, missed_deadlines: 6 },
  { institution_id: 8, program: 'Commerce', semester: 3, age: 22, study_hours_per_day: 4.5, attendance_pct: 88.0, previous_gpa: 7.9, assignment_completion_pct: 86.0, internal_marks: 80.0, sleep_hours: 7.0, commute_minutes: 35.0, internet_access: 'Reliable', parental_education: 'Undergraduate', extracurricular_level: 'Medium', financial_pressure: 'Low', part_time_job: 'No', lms_logins: 28, missed_deadlines: 1 },
];

export default function BatchPredictTab() {
  const [batchData, setBatchData] = useState(SAMPLE_BATCH);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runBatch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.batchPredict(batchData);
      setResponse(res);
    } catch (err) {
      setError(err.message || 'Batch prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!response || !response.results) return;
    const headers = ['StudentID', 'Program', 'Semester', 'Attendance%', 'StudyHours', 'InternalMarks', 'PredictedScore', 'Grade', 'HybridRisk%', 'RiskStatus'];
    const rows = response.results.map((r) => [
      r.student_id,
      r.input.program,
      r.input.semester,
      r.input.attendance_pct,
      r.input.study_hours_per_day,
      r.input.internal_marks,
      r.result.predicted_score,
      r.result.score_grade,
      (r.result.hybrid_risk_index * 100).toFixed(1) + '%',
      r.result.risk_status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'student_batch_predictions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={22} color="#38bdf8" />
            Cohort Batch Prediction & Export
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Process cohorts of students in one pass to generate institutional early-warning rosters and risk reports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={runBatch} disabled={loading}>
            {loading ? <RefreshCw className="animate-spin" size={17} /> : <Play size={17} />}
            {loading ? 'Evaluating Cohort...' : 'Run Batch Analysis'}
          </button>
          {response && (
            <button className="btn btn-secondary" onClick={exportCSV}>
              <Download size={17} />
              Export CSV Report
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.85rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Cohort Summary Metrics */}
      {response && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Students</span>
            <strong style={{ fontSize: '1.5rem', color: '#f8fafc', display: 'block' }}>{response.total_students}</strong>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Predicted Score</span>
            <strong style={{ fontSize: '1.5rem', color: '#38bdf8', display: 'block' }}>{response.average_predicted_score}</strong>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Flagged At-Risk</span>
            <strong style={{ fontSize: '1.5rem', color: response.at_risk_count > 0 ? '#f87171' : '#34d399', display: 'block' }}>
              {response.at_risk_count}
            </strong>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safe Students</span>
            <strong style={{ fontSize: '1.5rem', color: '#34d399', display: 'block' }}>{response.safe_count}</strong>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-card)', background: 'var(--bg-card-subtle)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
            Cohort Student Predictions Roster
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Program</th>
                <th>Sem</th>
                <th>Attendance</th>
                <th>Study Hrs</th>
                <th>Internal</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Risk Index</th>
                <th>Early Warning Flag</th>
              </tr>
            </thead>
            <tbody>
              {response ? (
                response.results.map((item) => (
                  <tr key={item.student_id}>
                    <td style={{ fontWeight: 700, color: '#93c5fd' }}>{item.student_id}</td>
                    <td>{item.input.program}</td>
                    <td>{item.input.semester}</td>
                    <td>{item.input.attendance_pct}%</td>
                    <td>{item.input.study_hours_per_day}h</td>
                    <td>{item.input.internal_marks}</td>
                    <td style={{ fontWeight: 700 }}>{item.result.predicted_score}</td>
                    <td>{item.result.score_grade}</td>
                    <td>{(item.result.hybrid_risk_index * 100).toFixed(1)}%</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: `${item.result.risk_color}22`,
                          color: item.result.risk_color,
                          border: `1px solid ${item.result.risk_color}55`,
                          fontSize: '0.65rem',
                        }}
                      >
                        {item.result.risk_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Click 'Run Batch Analysis' to process the cohort.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
