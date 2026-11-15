import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Award, CheckSquare, Sparkles, Printer,
  RefreshCw, LogIn, UserPlus, CheckCircle, AlertTriangle,
  BarChart3, User, BookOpen
} from 'lucide-react';
import { api, authStorage } from '../services/api';

export default function StudentPortalTab({ currentUser, onOpenAuthModal, onLoginSuccess }) {
  // Input form state
  const [internalMarks, setInternalMarks] = useState(78.0);
  const [attendancePct, setAttendancePct] = useState(84.0);
  const [assignmentCompletionPct, setAssignmentCompletionPct] = useState(88.0);
  const [studyHoursPerDay, setStudyHoursPerDay] = useState(4.5);
  const [previousGpa, setPreviousGpa] = useState(7.5);
  const [lmsLogins, setLmsLogins] = useState(25);
  const [missedDeadlines, setMissedDeadlines] = useState(0);

  // Report state
  const [calculating, setCalculating] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  // Inline auth state for logged-out view
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [program, setProgram] = useState('Computer Science');
  const [semester, setSemester] = useState(4);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // When user logs in, calculate initial report
  useEffect(() => {
    if (currentUser) {
      handleCalculate();
    } else {
      setReport(null);
    }
  }, [currentUser]);

  async function handleCalculate(e) {
    if (e) e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }
    setError('');
    setCalculating(true);
    try {
      const payload = {
        internal_marks: Number(internalMarks),
        attendance_pct: Number(attendancePct),
        assignment_completion_pct: Number(assignmentCompletionPct),
        study_hours_per_day: Number(studyHoursPerDay),
        previous_gpa: Number(previousGpa),
        lms_logins: Number(lmsLogins),
        missed_deadlines: Number(missedDeadlines),
        sleep_hours: 7.0,
        commute_minutes: 30.0,
        internet_access: 'Reliable',
        financial_pressure: 'Low',
        part_time_job: 'No',
        extracurricular_level: 'Medium',
      };
      const res = await api.generateStudentReport(payload);
      setReport(res);
    } catch (err) {
      setError(err.message || 'Error generating performance report.');
    } finally {
      setCalculating(false);
    }
  }

  async function handleInlineLogin(e) {
    if (e) e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await api.login({ email, password });
      authStorage.setToken(res.access_token);
      authStorage.setUser(res.user);
      onLoginSuccess(res.user);
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleDemoLogin() {
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await api.login({ email: 'demo@student.edu', password: 'demo1234' });
      authStorage.setToken(res.access_token);
      authStorage.setUser(res.user);
      onLoginSuccess(res.user);
    } catch (err) {
      setAuthError('Demo login failed: ' + err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleInlineRegister(e) {
    if (e) e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await api.register({
        email,
        password,
        full_name: fullName,
        student_id: studentId,
        program,
        semester: Number(semester),
        institution_id: 3,
      });
      authStorage.setToken(res.access_token);
      authStorage.setUser(res.user);
      onLoginSuccess(res.user);
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setAuthLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  // ==========================================
  // 1. NOT LOGGED IN VIEW (Clean, Simple Sign-in)
  // ==========================================
  if (!currentUser) {
    return (
      <div style={{ maxWidth: '440px', margin: '3rem auto' }}>
        <div style={{
          background: '#111d31',
          border: '1px solid #263750',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        }}>
          {/* Top Banner */}
          <div style={{
            padding: '2rem 1.5rem 1.25rem',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.15) 0%, transparent 100%)',
            borderBottom: '1px solid #1f2f47',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#fff',
              boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)',
            }}>
              <GraduationCap size={28} />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.35rem' }}>
              Student Portal
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: 0 }}>
              Sign in to enter your marks and view your performance report
            </p>
          </div>

          {/* Toggle Login / Register */}
          <div style={{ display: 'flex', borderBottom: '1px solid #1f2f47', background: '#0b1626' }}>
            <button
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: authMode === 'login' ? '#111d31' : 'transparent',
                borderBottom: authMode === 'login' ? '2px solid #3b82f6' : '2px solid transparent',
                color: authMode === 'login' ? '#f8fafc' : '#64748b',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setAuthError(''); }}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: authMode === 'register' ? '#111d31' : 'transparent',
                borderBottom: authMode === 'register' ? '2px solid #3b82f6' : '2px solid transparent',
                color: authMode === 'register' ? '#f8fafc' : '#64748b',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <div style={{ padding: '1.5rem' }}>
            {authError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                padding: '0.625rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                marginBottom: '1rem',
              }}>
                {authError}
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleInlineLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      background: '#091220',
                      border: '1px solid #233550',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.8125rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      background: '#091220',
                      border: '1px solid #233550',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.8125rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    marginTop: '0.25rem',
                  }}
                >
                  {authLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <div style={{ position: 'relative', textAlign: 'center', margin: '0.5rem 0' }}>
                  <div style={{ borderTop: '1px solid #1f2f47', position: 'absolute', top: '50%', width: '100%' }}></div>
                  <span style={{ background: '#111d31', padding: '0 0.5rem', position: 'relative', fontSize: '0.6875rem', color: '#64748b' }}>
                    or
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={authLoading}
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    color: '#93c5fd',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '0.625rem',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Sparkles size={14} /> ⚡ One-Click Demo Student Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleInlineRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Student Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.65rem',
                      background: '#091220',
                      border: '1px solid #233550',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.8125rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                      Roll / ID
                    </label>
                    <input
                      type="text"
                      placeholder="STU-2026-01"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.65rem',
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
                      Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.65rem',
                        background: '#091220',
                        border: '1px solid #233550',
                        borderRadius: '6px',
                        color: '#f8fafc',
                        fontSize: '0.8125rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Degree Program
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.65rem',
                      background: '#091220',
                      border: '1px solid #233550',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.8125rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="MCA">Master of Computer Applications (MCA)</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.65rem',
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
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.65rem',
                      background: '#091220',
                      border: '1px solid #233550',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.8125rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    marginTop: '0.25rem',
                  }}
                >
                  {authLoading ? 'Registering...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. LOGGED IN VIEW: ONLY STUDENT FORM & REPORT
  // ==========================================
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Student Profile Overview Card */}
      <div style={{
        background: '#111d31',
        border: '1px solid #263750',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                {currentUser.full_name}
              </h2>
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

        {report && (
          <button
            onClick={handlePrint}
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#f8fafc',
              border: '1px solid #334155',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Printer size={15} /> Print / Save Report
          </button>
        )}
      </div>

      {/* Main Two-Column Layout: Form (Left) & Report (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Marks Entry Form */}
        <div style={{
          background: '#111d31',
          border: '1px solid #263750',
          borderRadius: '12px',
          padding: '1.5rem',
        }}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.25rem' }}>
            Enter Your Academic Marks
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#8899b5', margin: '0 0 1.25rem' }}>
            Enter your assessment scores to generate your performance diagnostic
          </p>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.625rem', borderRadius: '8px', fontSize: '0.75rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            
            {/* Internal Assessment Marks */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8125rem' }}>
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
            </div>

            {/* Attendance % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8125rem' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Classroom Attendance:</span>
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
            </div>

            {/* Assignment Completion % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8125rem' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Assignment & Practical Completion:</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8125rem' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Daily Study Routine:</span>
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

            {/* Cumulative GPA & Deadlines */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                  Cumulative GPA (0-10)
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

            {/* Monthly LMS Logins */}
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

            {/* Calculate Button */}
            <button
              type="submit"
              disabled={calculating}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.8125rem',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: calculating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
              }}
            >
              {calculating ? (
                <>
                  <RefreshCw className="animate-spin" size={16} /> Calculating...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Calculate Score
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Generated Report */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {report ? (
            <>
              {/* Score & Standing Card */}
              <div style={{
                background: '#111d31',
                border: `1px solid ${report.risk_color}`,
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Predicted Final Exam Standing
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'monospace' }}>
                        {report.predicted_score.toFixed(1)}
                      </span>
                      <span style={{ fontSize: '1rem', color: '#93c5fd', fontWeight: 600 }}>
                        / 100 ({report.score_grade})
                      </span>
                    </div>
                  </div>

                  <div style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    background: `${report.risk_color}20`,
                    border: `1px solid ${report.risk_color}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}>
                    {report.risk_status === 'SAFE' ? (
                      <CheckCircle color={report.risk_color} size={18} />
                    ) : (
                      <AlertTriangle color={report.risk_color} size={18} />
                    )}
                    <span style={{ color: report.risk_color, fontWeight: 800, fontSize: '0.8125rem' }}>
                      {report.risk_status}
                    </span>
                  </div>
                </div>

                {/* Short Executive Summary Report */}
                <div style={{
                  marginTop: '1rem',
                  padding: '0.875rem 1rem',
                  background: 'rgba(9, 18, 32, 0.7)',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${report.risk_color}`,
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  color: '#e2e8f0',
                }}>
                  <strong style={{ color: '#60a5fa', display: 'block', marginBottom: '0.25rem' }}>
                    Performance Summary Report:
                  </strong>
                  {report.executive_summary}
                </div>
              </div>

              {/* In Which He Is Best (Strengths) */}
              <div style={{
                background: '#111d31',
                border: '1px solid #1f2f47',
                borderRadius: '12px',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Award color="#34d399" size={18} />
                  <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#f8fafc' }}>
                    What You Are Best At (Top Strengths)
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {report.best_strengths.map((st, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.625rem 0.875rem',
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
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
              <div style={{
                background: '#111d31',
                border: '1px solid #1f2f47',
                borderRadius: '12px',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <CheckSquare color="#f59e0b" size={18} />
                  <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#f8fafc' }}>
                    What You Need To Prepare (Focus Areas)
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {report.preparation_priorities.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.625rem 0.875rem',
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: '#fef3c7',
                        lineHeight: 1.5,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Component Marks Breakdown */}
              <div style={{
                background: '#111d31',
                border: '1px solid #1f2f47',
                borderRadius: '12px',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <BarChart3 color="#60a5fa" size={18} />
                  <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#f8fafc' }}>
                    Marks & Indicators Breakdown
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {report.component_breakdown.map((comp, idx) => (
                    <div key={idx} style={{ background: 'rgba(9, 18, 32, 0.5)', padding: '0.625rem', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
                        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{comp.name}</span>
                        <span style={{ color: comp.color, fontWeight: 700 }}>{comp.status} ({comp.grade_label})</span>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, Math.max(5, comp.score))}%`,
                          height: '100%',
                          background: comp.color,
                          borderRadius: '3px',
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              background: '#111d31',
              border: '1px solid #263750',
              borderRadius: '12px',
            }}>
              <GraduationCap size={36} style={{ color: '#64748b', margin: '0 auto 0.75rem' }} />
              <h4 style={{ color: '#f8fafc', margin: '0 0 0.5rem', fontSize: '1rem' }}>Ready to Calculate</h4>
              <p style={{ color: '#8899b5', fontSize: '0.8125rem', margin: 0 }}>
                Adjust your marks on the left and click "Calculate Performance Report" to generate your detailed diagnostic summary.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
