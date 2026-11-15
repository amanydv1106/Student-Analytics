import React, { useState, useEffect } from 'react';
import { Sliders, ArrowRight, TrendingUp, TrendingDown, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function SimulatorTab({ initialStudent }) {
  const [baseStudent, setBaseStudent] = useState(
    initialStudent || {
      institution_id: 3,
      program: 'Computer Science',
      semester: 4,
      age: 22,
      study_hours_per_day: 2.5,
      attendance_pct: 65.0,
      previous_gpa: 6.2,
      assignment_completion_pct: 68.0,
      internal_marks: 58.0,
      sleep_hours: 6.0,
      commute_minutes: 45.0,
      internet_access: 'Reliable',
      parental_education: 'Undergraduate',
      extracurricular_level: 'Medium',
      financial_pressure: 'Medium',
      part_time_job: 'No',
      lms_logins: 12,
      missed_deadlines: 3,
    }
  );

  const [simChanges, setSimChanges] = useState({
    attendance_pct: 85.0,
    study_hours_per_day: 5.0,
    missed_deadlines: 0,
    internal_marks: 75.0,
  });

  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [error, setError] = useState('');

  const runSimulation = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.simulateScenario(baseStudent, simChanges);
      setSimResult(res);
    } catch (err) {
      setError(err.message || 'Simulation execution failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [simChanges]);

  const handleSliderChange = (feature, value) => {
    setSimChanges((prev) => ({
      ...prev,
      [feature]: parseFloat(value),
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={20} color="#38bdf8" />
          Interactive "What-If" Academic Simulator
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Model how targeted interventions (such as raising attendance, dedicating study hours, or eliminating missed deadlines) will alter student success and lower at-risk early warning probabilities.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.85rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* Sliders Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#93c5fd', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.75rem' }}>
            Adjustable Intervention Levers
          </h3>

          {/* Attendance slider */}
          <div className="form-group">
            <div className="form-label">
              <span>Attendance Rate</span>
              <strong style={{ color: '#38bdf8' }}>{simChanges.attendance_pct}%</strong>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="1"
              value={simChanges.attendance_pct}
              onChange={(e) => handleSliderChange('attendance_pct', e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Baseline: {baseStudent.attendance_pct}%
            </span>
          </div>

          {/* Study hours slider */}
          <div className="form-group">
            <div className="form-label">
              <span>Daily Study Hours</span>
              <strong style={{ color: '#38bdf8' }}>{simChanges.study_hours_per_day} hrs/day</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="12"
              step="0.5"
              value={simChanges.study_hours_per_day}
              onChange={(e) => handleSliderChange('study_hours_per_day', e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Baseline: {baseStudent.study_hours_per_day} hrs/day
            </span>
          </div>

          {/* Missed Deadlines slider */}
          <div className="form-group">
            <div className="form-label">
              <span>Missed Deadlines</span>
              <strong style={{ color: simChanges.missed_deadlines === 0 ? '#34d399' : '#f87171' }}>
                {simChanges.missed_deadlines} missed
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={simChanges.missed_deadlines}
              onChange={(e) => handleSliderChange('missed_deadlines', e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Baseline: {baseStudent.missed_deadlines} missed
            </span>
          </div>

          {/* Internal Marks slider */}
          <div className="form-group">
            <div className="form-label">
              <span>Internal Marks</span>
              <strong style={{ color: '#38bdf8' }}>{simChanges.internal_marks} / 100</strong>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="1"
              value={simChanges.internal_marks}
              onChange={(e) => handleSliderChange('internal_marks', e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Baseline: {baseStudent.internal_marks}
            </span>
          </div>
        </div>

        {/* Dynamic Simulation Comparison Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {simResult && (
            <>
              <div className="card" style={{ background: 'linear-gradient(145deg, #0e1a30, #132442)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
                  Simulated Impact Projection
                </h3>

                {/* Score projection comparison */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: '0.75rem', border: '1px solid var(--border-card)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Baseline Score</span>
                    <strong style={{ fontSize: '1.4rem', color: '#94a3b8' }}>{simResult.original_score}</strong>
                  </div>

                  <ArrowRight size={24} color="#38bdf8" />

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Projected Score</span>
                    <strong style={{ fontSize: '1.6rem', color: '#38bdf8' }}>{simResult.simulated_score}</strong>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.5rem', fontSize: '0.85rem', color: simResult.score_diff >= 0 ? '#34d399' : '#f87171', fontWeight: 700 }}>
                      {simResult.score_diff >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {simResult.score_diff >= 0 ? `+${simResult.score_diff}` : simResult.score_diff} pts
                    </div>
                  </div>
                </div>

                {/* Risk projection comparison */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: '0.75rem', border: '1px solid var(--border-card)', marginTop: '0.85rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Baseline Risk Index</span>
                    <strong style={{ fontSize: '1.3rem', color: '#94a3b8' }}>
                      {(simResult.original_risk * 100).toFixed(1)}%
                    </strong>
                    <span className="badge badge-amber" style={{ display: 'block', width: 'fit-content', marginTop: 4, fontSize: '0.65rem' }}>
                      {simResult.original_status}
                    </span>
                  </div>

                  <ArrowRight size={24} color="#10b981" />

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Projected Risk Index</span>
                    <strong style={{ fontSize: '1.4rem', color: '#10b981' }}>
                      {(simResult.simulated_risk * 100).toFixed(1)}%
                    </strong>
                    <span className="badge badge-green" style={{ display: 'block', width: 'fit-content', marginTop: 4, fontSize: '0.65rem' }}>
                      {simResult.simulated_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Impact Feedback Advice */}
              <div className="card" style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={18} />
                  Intervention Analysis
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>
                  {simResult.feedback}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
