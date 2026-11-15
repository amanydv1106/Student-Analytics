import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Award, AlertTriangle, CheckCircle, TrendingUp,
  BookOpen, Clock, Calendar, CheckSquare, Sparkles, Printer,
  RefreshCw, LogIn, ChevronRight, User, Shield, BarChart3, HelpCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function StudentPortalTab({ currentUser, onOpenAuthModal }) {
  // Input marks form state
  const [internalMarks, setInternalMarks] = useState(78.0);
  const [attendancePct, setAttendancePct] = useState(84.0);
  const [assignmentCompletionPct, setAssignmentCompletionPct] = useState(88.0);
  const [studyHoursPerDay, setStudyHoursPerDay] = useState(4.5);
  const [previousGpa, setPreviousGpa] = useState(7.5);
  const [lmsLogins, setLmsLogins] = useState(25);
  const [missedDeadlines, setMissedDeadlines] = useState(0);
  const [sleepHours, setSleepHours] = useState(7.0);
  const [commuteMinutes, setCommuteMinutes] = useState(30.0);

  // Report state
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  // Load history on mount or when currentUser changes
  useEffect(() => {
    if (currentUser) {
      loadHistory();
      // Auto-generate report for immediate preview
      handleGenerateReport();
    }
  }, [currentUser]);

  async function loadHistory() {
    try {
      const hist = await api.getStudentHistory();
      if (Array.isArray(hist)) setHistory(hist);
    } catch (_) {}
  }

  async function handleGenerateReport(e) {
    if (e) e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }
    setError('');
    setGenerating(true);
    try {
      const payload = {
        internal_marks: Number(internalMarks),
        attendance_pct: Number(attendancePct),
        assignment_completion_pct: Number(assignmentCompletionPct),
        study_hours_per_day: Number(studyHoursPerDay),
        previous_gpa: Number(previousGpa),
        lms_logins: Number(lmsLogins),
        missed_deadlines: Number(missedDeadlines),
        sleep_hours: Number(sleepHours),
        commute_minutes: Number(commuteMinutes),
        internet_access: 'Reliable',
        financial_pressure: 'Low',
        part_time_job: 'No',
        extracurricular_level: 'Medium',
      };
      const res = await api.generateStudentReport(payload);
      setReport(res);
      loadHistory();
    } catch (err) {
      setError(err.message || 'Failed to generate diagnostic report.');
    } finally {
      setGenerating(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  // Not logged in view
  if (!currentUser) {
    return (
      <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
        <div className="card" style={{
          textAlign: 'center',
          padding: '3.5rem 2rem',
          background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.15) 0%, rgba(17, 29, 49, 0.8) 100%)',
          border: '1px solid #263750',
          borderRadius: '16px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
            color: '#fff',
          }}>
            <GraduationCap size={36} />
          </div>

          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f3f7ff', marginBottom: '0.75rem' }}>
            Student Academic Diagnostic Portal
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '580px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Sign in with your student account to enter your current marks and generate a personalized executive diagnostic report, identify your standout strengths, and receive prioritized preparation steps before semester finals.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenAuthModal}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: '#fff',
                border: 'none',
                padding: '0.875rem 2rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
              }}
            >
              <LogIn size={18} /> Sign In or Create Student Account
            </button>
          </div>

          <div style={{
            marginTop: '3rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            textAlign: 'left',
          }}>
            <div style={{ background: 'rgba(11, 23, 40, 0.6)', border: '1px solid #1f2f47', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ color: '#60a5fa', marginBottom: '0.5rem' }}><Award size={22} /></div>
              <h4 style={{ color: '#f3f7ff', fontSize: '0.9375rem', fontWeight: 600, margin: '0 0 0.25rem' }}>Standout Strengths</h4>
              <p style={{ color: '#8899b5', fontSize: '0.8125rem', margin: 0 }}>Automatically pinpoints where you excel based on attendance, submissions, and tests.</p>
            </div>
            <div style={{ background: 'rgba(11, 23, 40, 0.6)', border: '1px solid #1f2f47', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ color: '#f59e0b', marginBottom: '0.5rem' }}><CheckSquare size={22} /></div>
              <h4 style={{ color: '#f3f7ff', fontSize: '0.9375rem', fontWeight: 600, margin: '0 0 0.25rem' }}>What To Prepare</h4>
              <p style={{ color: '#8899b5', fontSize: '0.8125rem', margin: 0 }}>Actionable guidance tailored to lift your scores before internal and final evaluations.</p>
            </div>
            <div style={{ background: 'rgba(11, 23, 40, 0.6)', border: '1px solid #1f2f47', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ color: '#10b981', marginBottom: '0.5rem' }}><TrendingUp size={22} /></div>
              <h4 style={{ color: '#f3f7ff', fontSize: '0.9375rem', fontWeight: 600, margin: '0 0 0.25rem' }}>ML Score Prediction</h4>
              <p style={{ color: '#8899b5', fontSize: '0.8125rem', margin: 0 }}>Continuous score and academic early-warning index powered by ensemble models.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Student Welcome Banner */}
      <div className="card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem 1.5rem',
        background: 'linear-gradient(135deg, #111d31 0%, #162640 100%)',
        border: '1px solid #263750',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            borderRadius: '12px',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.25rem',
          }}>
            {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f3f7ff' }}>
                {currentUser.full_name}
              </h3>
              {currentUser.student_id && (
                <span style={{ background: '#1e293b', border: '1px solid #334155', color: '#93c5fd', padding: '0.125rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {currentUser.student_id}
                </span>
              )}
            </div>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#94a3b8' }}>
              {currentUser.program} • Semester {currentUser.semester} • {currentUser.email}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {report && (
            <button
              onClick={handlePrint}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                color: '#f8fafc',
                border: '1px solid #334155',
                padding: '0.625rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Printer size={16} /> Print / Save Report
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Input Form (Left) & Live Report (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Marks & Indicators Input */}
        <div className="card" style={{ padding: '1.5rem', background: '#111d31', border: '1px solid #263750' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#f3f7ff' }}>
                Your Academic Marks & Inputs
              </h4>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#8899b5' }}>
                Provide current marks to recalculate your performance diagnostic
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, background: 'rgba(56, 189, 248, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
              ML Ready
            </span>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleGenerateReport} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            
            {/* Internal Marks Slider & Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.8125rem' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Internal Assessment Marks:</span>
                <span style={{ color: '#60a5fa', fontWeight: 700, fontFamily: 'monospace' }}>{internalMarks} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={internalMarks}
                onChange={(e) => setInternalMarks(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#3b82f6' }}
              />
              <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Midterms, quizzes, and continuous class test average</span>
            </div>

            {/* Attendance % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.8125rem' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Lecture & Lab Attendance:</span>
                <span style={{ color: attendancePct >= 75 ? '#34d399' : '#f87171', fontWeight: 700, fontFamily: 'monospace' }}>
                  {attendancePct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={attendancePct}
                onChange={(e) => setAttendancePct(Number(e.target.value))}
                style={{ width: '100%', accentColor: attendancePct >= 75 ? '#10b981' : '#ef4444' }}
              />
              <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Standard university exam eligibility threshold is 75%</span>
            </div>

            {/* Assignment Completion % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.8125rem' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Assignment & Coursework Completion:</span>
                <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>{assignmentCompletionPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={assignmentCompletionPct}
                onChange={(e) => setAssignmentCompletionPct(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            {/* Daily Study Hours */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.8125rem' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Daily Self-Study Routine:</span>
                <span style={{ color: '#a78bfa', fontWeight: 700, fontFamily: 'monospace' }}>{studyHoursPerDay} hrs/day</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.5"
                value={studyHoursPerDay}
                onChange={(e) => setStudyHoursPerDay(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#8b5cf6' }}
              />
            </div>

            {/* GPA & Deadlines in 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                  Cumulative Prior GPA (0-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={previousGpa}
                  onChange={(e) => setPreviousGpa(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.625rem',
                    background: '#091220',
                    border: '1px solid #233550',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontSize: '0.8125rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                  Missed Deadlines
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={missedDeadlines}
                  onChange={(e) => setMissedDeadlines(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.625rem',
                    background: '#091220',
                    border: '1px solid #233550',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontSize: '0.8125rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* LMS Logins & Sleep in 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                  Monthly LMS Portal Logins
                </label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={lmsLogins}
                  onChange={(e) => setLmsLogins(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.625rem',
                    background: '#091220',
                    border: '1px solid #233550',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontSize: '0.8125rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                  Nightly Sleep (Hours)
                </label>
                <input
                  type="number"
                  min="3"
                  max="12"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.625rem',
                    background: '#091220',
                    border: '1px solid #233550',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontSize: '0.8125rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={generating}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.875rem',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: generating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
              }}
            >
              {generating ? (
                <>
                  <RefreshCw className="animate-spin" size={18} /> Analyzing Student Performance...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Generate My Success Report
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Comprehensive Diagnostic Report */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {report ? (
            <>
              {/* Score & Standing Summary Hero Card */}
              <div className="card" style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(17, 29, 49, 0.95), rgba(26, 42, 69, 0.95))',
                border: `1px solid ${report.risk_color}`,
                boxShadow: `0 8px 30px rgba(0,0,0,0.5)`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Predicted Final Exam Standing
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f3f7ff', fontFamily: 'monospace' }}>
                        {report.predicted_score.toFixed(1)}
                      </span>
                      <span style={{ fontSize: '1.125rem', color: '#93c5fd', fontWeight: 600 }}>
                        / 100 ({report.score_grade})
                      </span>
                    </div>
                  </div>

                  <div style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '10px',
                    background: `${report.risk_color}20`,
                    border: `1px solid ${report.risk_color}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    {report.risk_status === 'SAFE' ? (
                      <CheckCircle color={report.risk_color} size={20} />
                    ) : (
                      <AlertTriangle color={report.risk_color} size={20} />
                    )}
                    <div>
                      <div style={{ color: report.risk_color, fontWeight: 800, fontSize: '0.875rem' }}>
                        {report.risk_status}
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '0.6875rem' }}>
                        Risk Index: {(report.hybrid_risk_index * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Executive Summary Narrative */}
                <div style={{
                  marginTop: '1.25rem',
                  padding: '1rem 1.25rem',
                  background: 'rgba(9, 18, 32, 0.6)',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${report.risk_color}`,
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: '#e2e8f0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', color: '#60a5fa', fontWeight: 700 }}>
                    <GraduationCap size={18} /> Executive Academic Summary
                  </div>
                  {report.executive_summary}
                </div>
              </div>

              {/* In Which He Is Best (Strengths) */}
              <div className="card" style={{ padding: '1.25rem 1.5rem', background: '#111d31', border: '1px solid #1f2f47' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Award color="#34d399" size={20} />
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f3f7ff' }}>
                    What You Excel At (Key Strengths)
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {report.best_strengths.map((st, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        borderRadius: '8px',
                        fontSize: '0.8125rem',
                        color: '#d1fae5',
                        lineHeight: 1.5,
                      }}
                    >
                      {st}
                    </div>
                  ))}
                </div>
              </div>

              {/* What He Needs To Prepare */}
              <div className="card" style={{ padding: '1.25rem 1.5rem', background: '#111d31', border: '1px solid #1f2f47' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <CheckSquare color="#f59e0b" size={20} />
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f3f7ff' }}>
                    What You Need To Prepare (Targeted Action Plan)
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {report.preparation_priorities.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        borderRadius: '8px',
                        fontSize: '0.8125rem',
                        color: '#fef3c7',
                        lineHeight: 1.5,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Component Dimensions Breakdown */}
              <div className="card" style={{ padding: '1.25rem 1.5rem', background: '#111d31', border: '1px solid #1f2f47' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <BarChart3 color="#60a5fa" size={20} />
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f3f7ff' }}>
                    5-Dimension Performance Breakdown
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {report.component_breakdown.map((comp, idx) => (
                    <div key={idx} style={{ background: 'rgba(9, 18, 32, 0.5)', padding: '0.75rem', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.8125rem' }}>
                        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{comp.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: comp.color, fontWeight: 700 }}>{comp.status}</span>
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>({comp.grade_label})</span>
                        </div>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, Math.max(5, comp.score))}%`,
                          height: '100%',
                          background: comp.color,
                          borderRadius: '3px',
                          transition: 'width 0.5s ease-out',
                        }}></div>
                      </div>
                      <div style={{ marginTop: '0.25rem', fontSize: '0.6875rem', color: '#94a3b8' }}>
                        {comp.feedback}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', background: '#111d31', border: '1px solid #263750' }}>
              <GraduationCap size={40} style={{ color: '#64748b', margin: '0 auto 1rem' }} />
              <h4 style={{ color: '#f3f7ff', margin: '0 0 0.5rem' }}>No Report Generated Yet</h4>
              <p style={{ color: '#8899b5', fontSize: '0.8125rem', margin: 0 }}>
                Adjust your marks and click "Generate My Success Report" on the left to view your comprehensive diagnostic breakdown.
              </p>
            </div>
          )}

          {/* Past History */}
          {history.length > 0 && (
            <div className="card" style={{ padding: '1.25rem 1.5rem', background: '#111d31', border: '1px solid #1f2f47' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#f3f7ff' }}>
                  Recent Diagnostic Runs
                </h5>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{history.length} saved</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {history.map((h) => (
                  <div
                    key={h.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(9, 18, 32, 0.6)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      borderLeft: `3px solid ${h.risk_color}`,
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: '#f8fafc', marginRight: '0.5rem' }}>
                        Score: {h.predicted_score.toFixed(1)} ({h.score_grade})
                      </span>
                      <span style={{ color: h.risk_color, fontWeight: 600 }}>{h.risk_status}</span>
                    </div>
                    <span style={{ color: '#64748b' }}>{h.created_at}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
