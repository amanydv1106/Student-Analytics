import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  ShieldAlert, 
  BookOpen, 
  Clock, 
  Award,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function PredictorTab({ presets, initialStudent }) {
  const [formData, setFormData] = useState(
    initialStudent || {
      institution_id: 3,
      program: 'Computer Science',
      semester: 4,
      age: 22,
      study_hours_per_day: 4.5,
      attendance_pct: 82.0,
      previous_gpa: 7.2,
      assignment_completion_pct: 88.0,
      internal_marks: 76.0,
      sleep_hours: 7.0,
      commute_minutes: 35.0,
      internet_access: 'Reliable',
      parental_education: 'Undergraduate',
      extracurricular_level: 'Medium',
      financial_pressure: 'Low',
      part_time_job: 'No',
      lms_logins: 20,
      missed_deadlines: 1,
    }
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const loadPreset = (key) => {
    if (presets && presets[key]) {
      setFormData(presets[key]);
      handlePredict(presets[key]);
    }
  };

  const handlePredict = async (dataToSubmit = formData) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.predictStudent(dataToSubmit);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to generate prediction.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlePredict();
  }, []);

  // Compute SVG circular ring offset
  const circumference = 2 * Math.PI * 52;
  const scorePercent = result ? Math.min(Math.max(result.predicted_score, 0), 100) : 0;
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Presets */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#38bdf8" />
            Student Academic & Risk Predictor
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Enter student characteristics below or choose a pre-configured scenario profile.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => loadPreset('high_performer')}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            🌟 Top Achiever
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => loadPreset('average_student')}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            ⚖️ Average Student
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => loadPreset('at_risk_student')}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}
          >
            ⚠️ Critical At-Risk
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.85rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Main Grid: Form (Left) & Live Results (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Form Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-card)', paddingBottom: '0.75rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} />
            Academic & Behavioral Profile
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Attendance (%)</label>
              <input
                type="number"
                name="attendance_pct"
                value={formData.attendance_pct}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.5"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Study Hours / Day</label>
              <input
                type="number"
                name="study_hours_per_day"
                value={formData.study_hours_per_day}
                onChange={handleChange}
                min="0"
                max="24"
                step="0.5"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Previous GPA (0-10)</label>
              <input
                type="number"
                name="previous_gpa"
                value={formData.previous_gpa}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.1"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Internal Marks (100)</label>
              <input
                type="number"
                name="internal_marks"
                value={formData.internal_marks}
                onChange={handleChange}
                min="0"
                max="100"
                step="1"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assignments (%)</label>
              <input
                type="number"
                name="assignment_completion_pct"
                value={formData.assignment_completion_pct}
                onChange={handleChange}
                min="0"
                max="100"
                step="1"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Missed Deadlines</label>
              <input
                type="number"
                name="missed_deadlines"
                value={formData.missed_deadlines}
                onChange={handleChange}
                min="0"
                max="20"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">LMS Portal Logins</label>
              <input
                type="number"
                name="lms_logins"
                value={formData.lms_logins}
                onChange={handleChange}
                min="0"
                max="150"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nightly Sleep (hrs)</label>
              <input
                type="number"
                name="sleep_hours"
                value={formData.sleep_hours}
                onChange={handleChange}
                min="2"
                max="14"
                step="0.5"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Commute (minutes)</label>
              <input
                type="number"
                name="commute_minutes"
                value={formData.commute_minutes}
                onChange={handleChange}
                min="0"
                max="180"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Program</label>
              <select name="program" value={formData.program} onChange={handleChange} className="form-select">
                <option value="Computer Science">Computer Science</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Semester</label>
              <select name="semester" value={formData.semester} onChange={handleChange} className="form-select">
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Internet Access</label>
              <select name="internet_access" value={formData.internet_access} onChange={handleChange} className="form-select">
                <option value="Reliable">Reliable</option>
                <option value="Limited">Limited</option>
                <option value="No access">No access</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Financial Pressure</label>
              <select name="financial_pressure" value={formData.financial_pressure} onChange={handleChange} className="form-select">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Part-Time Job</label>
              <select name="part_time_job" value={formData.part_time_job} onChange={handleChange} className="form-select">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Institution ID (0-9)</label>
              <input
                type="number"
                name="institution_id"
                value={formData.institution_id}
                onChange={handleChange}
                min="0"
                max="9"
                className="form-input"
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handlePredict()}
            disabled={loading}
            style={{ marginTop: '0.5rem', width: '100%' }}
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
            {loading ? 'Evaluating Model Inference...' : 'Calculate Score & Early-Warning Risk'}
          </button>
        </div>

        {/* Prediction Results Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {result ? (
            <>
              {/* Primary Score Ring & Status Card */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', background: 'linear-gradient(145deg, #0e1a30, #132442)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Model Inference Output
                  </span>
                  <span
                    className="badge"
                    style={{
                      background: `${result.risk_color}22`,
                      color: result.risk_color,
                      border: `1px solid ${result.risk_color}55`,
                    }}
                  >
                    {result.risk_status}
                  </span>
                </div>

                {/* Circular Score Meter */}
                <div className="metric-ring">
                  <svg width="130" height="130">
                    <circle className="bg-circle" cx="65" cy="65" r="52" />
                    <circle
                      className="progress-circle"
                      cx="65"
                      cy="65"
                      r="52"
                      stroke={result.risk_color}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className="ring-label">
                    <span style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
                      {result.predicted_score}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                      / 100 pts
                    </span>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                    Grade: {result.score_grade}
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Regression model + early-warning risk probability ensemble
                  </p>
                </div>

                {/* Sub-Metrics Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%' }}>
                  <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid var(--border-card)', textAlign: 'left' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Classifier At-Risk</span>
                    <strong style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
                      {(result.at_risk_probability * 100).toFixed(1)}%
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>Threshold: 50%</span>
                  </div>

                  <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid var(--border-card)', textAlign: 'left' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Hybrid Risk Index</span>
                    <strong style={{ fontSize: '1.25rem', color: result.risk_color }}>
                      {(result.hybrid_risk_index * 100).toFixed(1)}%
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>0.7×clf + 0.3×(1-score)</span>
                  </div>
                </div>
              </div>

              {/* Strengths & Risks Cards */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} />
                  Academic Strengths Identified
                </h4>
                {result.key_strengths.length > 0 ? (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {result.key_strengths.map((s, i) => (
                      <li key={i} style={{ fontSize: '0.8125rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                        <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span> {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>No standout positive engagement metrics recorded.</p>
                )}

                {result.risk_factors.length > 0 && (
                  <>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                      <AlertTriangle size={16} />
                      Academic Risk Triggers
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {result.risk_factors.map((r, i) => (
                        <li key={i} style={{ fontSize: '0.8125rem', color: '#fca5a5', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                          <span style={{ color: '#f87171', fontWeight: 'bold' }}>!</span> {r}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Actionable Recommendations */}
              <div className="card" style={{ background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  <Lightbulb size={16} />
                  Early-Warning Intervention Advisory
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {result.recommendations.map((rec, i) => (
                    <li key={i} style={{ fontSize: '0.8125rem', color: '#e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', marginTop: 7, flexShrink: 0 }}></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, color: 'var(--text-muted)' }}>
              Click 'Calculate Score' to view prediction analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
