import React, { useState, useEffect } from 'react';
import { Sliders, ArrowRight, TrendingUp, TrendingDown, RefreshCw, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
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
      {/* Top Card */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E152A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={22} color="#501E7E" />
            Score Simulator
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#68597A', margin: '0.25rem 0 0' }}>
            Explore how improving attendance, daily study hours, and assignment deadlines impacts academic score and risk.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-purple">Interactive Simulation</span>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FDE8E7', border: '1px solid #FCA5A5', color: '#D9383A', padding: '0.85rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* Sliders Card (Left) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EFE6F8', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E152A', margin: 0 }}>
              Adjust Factors
            </h3>
            <span className="badge badge-red">CRITICAL AT RISK</span>
          </div>

          {/* Attendance slider */}
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <div className="form-label" style={{ marginBottom: '0.4rem' }}>
              <span style={{ color: '#1E152A', fontWeight: 700 }}>Attendance Rate</span>
              <strong style={{ color: '#501E7E', fontSize: '1rem' }}>{simChanges.attendance_pct}%</strong>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="1"
              value={simChanges.attendance_pct}
              onChange={(e) => handleSliderChange('attendance_pct', e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8C7C9E', marginTop: '0.25rem' }}>
              <span>85%</span>
              <span>85%</span>
            </div>
          </div>

          {/* Study hours slider */}
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <div className="form-label" style={{ marginBottom: '0.4rem' }}>
              <span style={{ color: '#1E152A', fontWeight: 700 }}>Daily Study Hours</span>
              <strong style={{ color: '#501E7E', fontSize: '1rem' }}>{simChanges.study_hours_per_day} hrs/day</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="12"
              step="0.5"
              value={simChanges.study_hours_per_day}
              onChange={(e) => handleSliderChange('study_hours_per_day', e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8C7C9E', marginTop: '0.25rem' }}>
              <span>5 hrs</span>
              <span>high</span>
            </div>
          </div>

          {/* Missed Deadlines slider */}
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <div className="form-label" style={{ marginBottom: '0.4rem' }}>
              <span style={{ color: '#1E152A', fontWeight: 700 }}>Missed Deadlines</span>
              <strong style={{ color: simChanges.missed_deadlines === 0 ? '#16A34A' : '#D9383A', fontSize: '1rem' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8C7C9E', marginTop: '0.25rem' }}>
              <span>0 missed</span>
              <span>left</span>
            </div>
          </div>

          {/* Internal Marks slider */}
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <div className="form-label" style={{ marginBottom: '0.4rem' }}>
              <span style={{ color: '#1E152A', fontWeight: 700 }}>Internal Marks</span>
              <strong style={{ color: '#501E7E', fontSize: '1rem' }}>{simChanges.internal_marks} / 100</strong>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="1"
              value={simChanges.internal_marks}
              onChange={(e) => handleSliderChange('internal_marks', e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8C7C9E', marginTop: '0.25rem' }}>
              <span>0</span>
              <span>75%</span>
            </div>
          </div>

          {/* Summary Strip (matching image 1 bottom left) */}
          <div style={{ 
            marginTop: '0.5rem', 
            paddingTop: '0.85rem', 
            borderTop: '1px solid #EFE6F8', 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: '0.5rem', 
            fontSize: '0.8125rem', 
            color: '#5F5070' 
          }}>
            <span>Attendance Rate: <strong>{simChanges.attendance_pct}%</strong></span>
            <span>Daily Study Hours: <strong>{simChanges.study_hours_per_day} hrs/day</strong></span>
            <span>Internal Marks: <strong>{simChanges.internal_marks}/100</strong></span>
          </div>
        </div>

        {/* Dynamic Simulation Comparison Right Side (matching image 1 right side) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {simResult && (
            <>
              {/* Score Simulator Card */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E152A', margin: 0 }}>
                    Score Simulator
                  </h3>
                  <span className="badge badge-red">CRITICAL AT RISK</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '0.5rem' }}>
                  <div style={{ background: '#FAF6FD', padding: '1rem', borderRadius: '12px', border: '1px solid #EADBFA' }}>
                    <span style={{ fontSize: '0.75rem', color: '#68597A', display: 'block', fontWeight: 600 }}>Summary</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.25rem' }}>
                      <strong style={{ fontSize: '1.6rem', color: '#1E152A', fontWeight: 800 }}>{simResult.simulated_score}</strong>
                      <span style={{ color: '#D9383A', fontSize: '1rem', fontWeight: 700 }}>↗</span>
                    </div>
                  </div>

                  <div style={{ background: '#FAF6FD', padding: '1rem', borderRadius: '12px', border: '1px solid #EADBFA' }}>
                    <span style={{ fontSize: '0.75rem', color: '#68597A', display: 'block', fontWeight: 600 }}>Risk Index</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.25rem' }}>
                      <strong style={{ fontSize: '1.6rem', color: '#1E152A', fontWeight: 800 }}>{(simResult.simulated_risk * 10).toFixed(2)}</strong>
                      <span style={{ color: '#16A34A', fontSize: '1rem', fontWeight: 700 }}>↗</span>
                    </div>
                  </div>

                  <div style={{ background: '#FAF6FD', padding: '1rem', borderRadius: '12px', border: '1px solid #EADBFA' }}>
                    <span style={{ fontSize: '0.75rem', color: '#68597A', display: 'block', fontWeight: 600 }}>Score Gain</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.25rem' }}>
                      <strong style={{ fontSize: '1.6rem', color: '#1E152A', fontWeight: 800 }}>
                        {simResult.score_diff >= 0 ? `+${simResult.score_diff}` : simResult.score_diff}
                      </strong>
                      <span style={{ color: '#16A34A', fontSize: '1rem', fontWeight: 700 }}>→</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulated Impact Projection Card (matching image 1 middle card) */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E152A', margin: 0 }}>
                    Simulated Impact Projection
                  </h3>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <span className="badge badge-red">CRITICAL</span>
                    <span className="badge badge-green">SAFE</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '0.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#68597A', display: 'block' }}>Attendance Rate</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <strong style={{ fontSize: '1.35rem', color: '#1E152A' }}>{simChanges.attendance_pct}%</strong>
                      <span style={{ color: '#D9383A', fontWeight: 700 }}>→</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#68597A', display: 'block' }}>Daily Study Hours</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <strong style={{ fontSize: '1.35rem', color: '#1E152A' }}>{simChanges.study_hours_per_day}h</strong>
                      <span style={{ color: '#D9383A', fontWeight: 700 }}>→</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#68597A', display: 'block' }}>Internal Marks</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <strong style={{ fontSize: '1.35rem', color: '#1E152A' }}>{simChanges.internal_marks}/100</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intervention Analysis Card (matching image 1 bottom card) */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E152A', margin: 0 }}>
                    Intervention Analysis
                  </h4>
                  <span className="badge badge-red">CRITICAL AT RISK</span>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#5F5070', margin: 0, lineHeight: 1.6 }}>
                  {simResult.feedback || 'The intervention analysis shows proactive adjustment in attendance and study routines moves the student firmly towards academic safety.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#3A2E47' }}>
                    <ChevronRight size={14} color="#501E7E" />
                    <span>Target consistent daily study schedule of at least {simChanges.study_hours_per_day} hours.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#3A2E47' }}>
                    <ChevronRight size={14} color="#501E7E" />
                    <span>Eliminate overdue submissions to maintain peak assignment score.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <span className="badge badge-green">SAFE</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
