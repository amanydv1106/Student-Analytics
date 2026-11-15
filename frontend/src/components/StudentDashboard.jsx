import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Award, CheckSquare, Sparkles, Printer,
  RefreshCw, LogOut, ChevronRight, BarChart3, Plus, Trash2,
  Calendar, CheckCircle, AlertTriangle, BookOpen, Clock, FileText,
  Layers, ArrowLeft
} from 'lucide-react';
import { api } from '../services/api';

export default function StudentDashboard({ 
  currentUser, 
  onLogout,
  onSwitchToPublic 
}) {
  const [sidebarTab, setSidebarTab] = useState('summary'); // 'summary' | 'history'

  // Subject-wise marks state: allows students to add subjects with gained and out-of marks
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Core Subject 1 (Theory)', gained: 42, total: 50 },
    { id: 2, name: 'Core Subject 2 (Algorithms)', gained: 44, total: 50 },
    { id: 3, name: 'Practical Lab / Coursework', gained: 45, total: 50 },
  ]);

  // Overall component inputs with gained and out-of fields
  const [attendanceAttended, setAttendanceAttended] = useState(42);
  const [attendanceTotal, setAttendanceTotal] = useState(50);

  const [assignmentSubmitted, setAssignmentSubmitted] = useState(9);
  const [assignmentTotal, setAssignmentTotal] = useState(10);

  const [studyHoursPerDay, setStudyHoursPerDay] = useState(4.5);
  const [gpaGained, setGpaGained] = useState(7.8);
  const [lmsLogins, setLmsLogins] = useState(25);
  const [missedDeadlines, setMissedDeadlines] = useState(0);
  const [sleepHours, setSleepHours] = useState(7.0);
  const [commuteMinutes, setCommuteMinutes] = useState(30.0);

  // Report state
  const [calculating, setCalculating] = useState(false);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  // Load history on mount
  useEffect(() => {
    if (currentUser) {
      loadHistory();
      handleCalculate();
    }
  }, [currentUser]);

  async function loadHistory() {
    try {
      const hist = await api.getStudentHistory();
      if (Array.isArray(hist)) setHistory(hist);
    } catch (_) {}
  }

  // Calculate internal marks % from subjects
  const totalSubjectGained = subjects.reduce((sum, s) => sum + Number(s.gained || 0), 0);
  const totalSubjectMax = subjects.reduce((sum, s) => sum + Number(s.total || 0), 0);
  const computedInternalMarks = totalSubjectMax > 0 
    ? Math.min(100, Math.max(0, (totalSubjectGained / totalSubjectMax) * 100))
    : 75.0;

  // Calculate attendance %
  const computedAttendancePct = attendanceTotal > 0
    ? Math.min(100, Math.max(0, (attendanceAttended / attendanceTotal) * 100))
    : 80.0;

  // Calculate assignment %
  const computedAssignmentPct = assignmentTotal > 0
    ? Math.min(100, Math.max(0, (assignmentSubmitted / assignmentTotal) * 100))
    : 85.0;

  function handleAddSubject() {
    const nextId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
    setSubjects([...subjects, { id: nextId, name: `Subject ${nextId}`, gained: 40, total: 50 }]);
  }

  function handleRemoveSubject(id) {
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter(s => s.id !== id));
  }

  function handleSubjectChange(id, field, value) {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  async function handleCalculate(e) {
    if (e) e.preventDefault();
    setError('');
    setCalculating(true);
    try {
      const payload = {
        internal_marks: Number(computedInternalMarks.toFixed(1)),
        attendance_pct: Number(computedAttendancePct.toFixed(1)),
        assignment_completion_pct: Number(computedAssignmentPct.toFixed(1)),
        study_hours_per_day: Number(studyHoursPerDay),
        previous_gpa: Number(gpaGained),
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
      setSidebarTab('summary');
      loadHistory();
    } catch (err) {
      setError(err.message || 'Error generating performance report.');
    } finally {
      setCalculating(false);
    }
  }

  async function handleViewHistoryReport(reportId) {
    try {
      const res = await api.getReportById(reportId);
      if (res) {
        setReport(res);
        setSidebarTab('summary');
      }
    } catch (_) {}
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div style={{ display: 'flex', gap: '1.5rem', minHeight: 'calc(100vh - 140px)', flexWrap: 'wrap' }}>
      
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR: Student Profile, Navigation & History */}
      {/* ======================================================== */}
      <aside style={{
        width: '280px',
        flexShrink: 0,
        background: '#111d31',
        border: '1px solid #263750',
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      }}>
        {/* Student Profile Card */}
        <div style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(17, 29, 49, 0.8) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.375rem',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
          }}>
            {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'S'}
          </div>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
            {currentUser.full_name}
          </h3>
          <span style={{
            display: 'inline-block',
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#93c5fd',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.6875rem',
            fontWeight: 600,
            marginBottom: '0.35rem',
          }}>
            {currentUser.student_id || 'STU-' + currentUser.id}
          </span>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
            {currentUser.program} • Sem {currentUser.semester}
          </p>
        </div>

        {/* Sidebar Nav Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => setSidebarTab('summary')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: sidebarTab === 'summary' ? '1px solid #3b82f6' : '1px solid transparent',
              background: sidebarTab === 'summary' ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
              color: sidebarTab === 'summary' ? '#60a5fa' : '#cbd5e1',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <FileText size={16} />
              <span>Calculate Score</span>
            </div>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={() => setSidebarTab('history')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: sidebarTab === 'history' ? '1px solid #3b82f6' : '1px solid transparent',
              background: sidebarTab === 'history' ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
              color: sidebarTab === 'history' ? '#60a5fa' : '#cbd5e1',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Clock size={16} />
              <span>Report History</span>
            </div>
            {history.length > 0 && (
              <span style={{ background: '#1e293b', color: '#93c5fd', fontSize: '0.6875rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                {history.length}
              </span>
            )}
          </button>
        </div>

        {/* Quick History List in Sidebar */}
        {history.length > 0 && (
          <div style={{ marginTop: 'auto', borderTop: '1px solid #1f2f47', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
              Recent Scores
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto' }}>
              {history.slice(0, 3).map((h) => (
                <div
                  key={h.id}
                  onClick={() => handleViewHistoryReport(h.id)}
                  style={{
                    padding: '0.4rem 0.6rem',
                    background: 'rgba(11, 23, 40, 0.6)',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    borderLeft: `3px solid ${h.risk_color}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                    {h.predicted_score.toFixed(1)}/100
                  </span>
                  <span style={{ color: h.risk_color, fontSize: '0.6875rem', fontWeight: 600 }}>
                    {h.risk_status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sign Out at Bottom of Sidebar */}
        <button
          onClick={onLogout}
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#fca5a5',
            padding: '0.625rem',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <LogOut size={15} /> Sign Out
        </button>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT AREA: Summary Generation or History View */}
      {/* ======================================================== */}
      <main style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {sidebarTab === 'summary' ? (
          <>
            {/* Header Action Bar */}
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
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Performance Report
                </h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#94a3b8' }}>
                  Enter your marks and academic details to generate your performance report
                </p>
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

            {/* Two-Column Form & Report */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
              
              {/* Form: Marks Gained / Out Of */}
              <div style={{
                background: '#111d31',
                border: '1px solid #263750',
                borderRadius: '12px',
                padding: '1.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    Subject Marks & Indicators (Obtained / Out Of)
                  </h3>
                  <span style={{ fontSize: '0.6875rem', color: '#60a5fa', background: 'rgba(37, 99, 235, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                    Dynamic % Auto-Sync
                  </span>
                </div>

                {error && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.625rem', borderRadius: '8px', fontSize: '0.75rem', marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* --- Section A: Subject-wise Internal Marks --- */}
                  <div style={{ background: '#0b1626', border: '1px solid #1f2f47', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#e2e8f0' }}>
                        1. Subject-Wise Internal Marks
                      </span>
                      <button
                        type="button"
                        onClick={handleAddSubject}
                        style={{
                          background: 'rgba(37, 99, 235, 0.2)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Plus size={12} /> Add Subject
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {subjects.map((sub, idx) => (
                        <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <input
                            type="text"
                            placeholder="Subject Name"
                            value={sub.name}
                            onChange={(e) => handleSubjectChange(sub.id, 'name', e.target.value)}
                            style={{
                              flex: 2,
                              minWidth: '120px',
                              padding: '0.45rem 0.6rem',
                              background: '#111d31',
                              border: '1px solid #263750',
                              borderRadius: '6px',
                              color: '#f8fafc',
                              fontSize: '0.75rem',
                            }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1.5 }}>
                            <input
                              type="number"
                              min="0"
                              placeholder="Marks"
                              value={sub.gained}
                              onChange={(e) => handleSubjectChange(sub.id, 'gained', Number(e.target.value))}
                              style={{
                                width: '50px',
                                padding: '0.45rem 0.4rem',
                                background: '#111d31',
                                border: '1px solid #263750',
                                borderRadius: '6px',
                                color: '#f8fafc',
                                fontSize: '0.75rem',
                                textAlign: 'center',
                              }}
                            />
                            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>/</span>
                            <input
                              type="number"
                              min="1"
                              placeholder="Out Of"
                              value={sub.total}
                              onChange={(e) => handleSubjectChange(sub.id, 'total', Number(e.target.value))}
                              style={{
                                width: '50px',
                                padding: '0.45rem 0.4rem',
                                background: '#111d31',
                                border: '1px solid #263750',
                                borderRadius: '6px',
                                color: '#f8fafc',
                                fontSize: '0.75rem',
                                textAlign: 'center',
                              }}
                            />
                          </div>

                          {subjects.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSubject(sub.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '0.25rem',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Aggregate Internal % Banner */}
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(37, 99, 235, 0.1)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                    }}>
                      <span style={{ color: '#93c5fd' }}>
                        Total Gained: <strong>{totalSubjectGained} / {totalSubjectMax}</strong>
                      </span>
                      <span style={{ color: '#60a5fa', fontWeight: 800, fontFamily: 'monospace' }}>
                        Computed Internal: {computedInternalMarks.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* --- Section B: Attendance (Attended / Out Of Total) --- */}
                  <div style={{ background: '#0b1626', border: '1px solid #1f2f47', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#e2e8f0' }}>
                        2. Classroom Lecture Attendance
                      </span>
                      <span style={{ color: computedAttendancePct >= 75 ? '#34d399' : '#f87171', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                        {computedAttendancePct.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.6875rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                          Lectures Attended
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={attendanceAttended}
                          onChange={(e) => setAttendanceAttended(Number(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.5rem',
                            background: '#111d31',
                            border: '1px solid #263750',
                            borderRadius: '6px',
                            color: '#f8fafc',
                            fontSize: '0.75rem',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <span style={{ color: '#64748b', fontSize: '1rem', marginTop: '1rem' }}>/</span>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.6875rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                          Total Conducted
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={attendanceTotal}
                          onChange={(e) => setAttendanceTotal(Number(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.5rem',
                            background: '#111d31',
                            border: '1px solid #263750',
                            borderRadius: '6px',
                            color: '#f8fafc',
                            fontSize: '0.75rem',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${computedAttendancePct}%`,
                        height: '100%',
                        background: computedAttendancePct >= 75 ? '#10b981' : '#ef4444',
                        transition: 'width 0.3s ease',
                      }}></div>
                    </div>
                  </div>

                  {/* --- Section C: Assignments Completed / Total --- */}
                  <div style={{ background: '#0b1626', border: '1px solid #1f2f47', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#e2e8f0' }}>
                        3. Assignments & Lab Deliverables
                      </span>
                      <span style={{ color: '#38bdf8', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                        {computedAssignmentPct.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.6875rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                          Completed / Submitted
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={assignmentSubmitted}
                          onChange={(e) => setAssignmentSubmitted(Number(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.5rem',
                            background: '#111d31',
                            border: '1px solid #263750',
                            borderRadius: '6px',
                            color: '#f8fafc',
                            fontSize: '0.75rem',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <span style={{ color: '#64748b', fontSize: '1rem', marginTop: '1rem' }}>/</span>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.6875rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                          Total Assigned
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={assignmentTotal}
                          onChange={(e) => setAssignmentTotal(Number(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.5rem',
                            background: '#111d31',
                            border: '1px solid #263750',
                            borderRadius: '6px',
                            color: '#f8fafc',
                            fontSize: '0.75rem',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- Section D: Study Routine & Academic Context --- */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.25rem', fontWeight: 600 }}>
                        Daily Study Routine
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        max="14"
                        step="0.5"
                        value={studyHoursPerDay}
                        onChange={(e) => setStudyHoursPerDay(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.6rem',
                          background: '#0b1626',
                          border: '1px solid #1f2f47',
                          borderRadius: '6px',
                          color: '#f8fafc',
                          fontSize: '0.75rem',
                          boxSizing: 'border-box',
                        }}
                      />
                      <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Hours per day</span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.25rem', fontWeight: 600 }}>
                        Prior Cumulative GPA
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={gpaGained}
                        onChange={(e) => setGpaGained(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.6rem',
                          background: '#0b1626',
                          border: '1px solid #1f2f47',
                          borderRadius: '6px',
                          color: '#f8fafc',
                          fontSize: '0.75rem',
                          boxSizing: 'border-box',
                        }}
                      />
                      <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Out of 10.0</span>
                    </div>
                  </div>

                  {/* LMS & Deadlines */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.25rem', fontWeight: 600 }}>
                        Monthly LMS Logins
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="150"
                        value={lmsLogins}
                        onChange={(e) => setLmsLogins(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.6rem',
                          background: '#0b1626',
                          border: '1px solid #1f2f47',
                          borderRadius: '6px',
                          color: '#f8fafc',
                          fontSize: '0.75rem',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.25rem', fontWeight: 600 }}>
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
                          padding: '0.5rem 0.6rem',
                          background: '#0b1626',
                          border: '1px solid #1f2f47',
                          borderRadius: '6px',
                          color: '#f8fafc',
                          fontSize: '0.75rem',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={calculating}
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.875rem',
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

              {/* Generated Report Column */}
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
                            Predicted Final Score
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

                      {/* Performance Summary Report */}
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
                          Performance Summary:
                        </strong>
                        {report.executive_summary}
                      </div>
                    </div>

                    {/* What He Is Best At */}
                    <div style={{
                      background: '#111d31',
                      border: '1px solid #1f2f47',
                      borderRadius: '12px',
                      padding: '1.25rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Award color="#34d399" size={18} />
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#f8fafc' }}>
                          In Which You Are Best (Top Strengths)
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

                    {/* Component Breakdown */}
                    <div style={{
                      background: '#111d31',
                      border: '1px solid #1f2f47',
                      borderRadius: '12px',
                      padding: '1.25rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <BarChart3 color="#60a5fa" size={18} />
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#f8fafc' }}>
                          Evaluation Dimension Ratings
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
                      Enter your marks on the left and click "Calculate Score" to view your summary report.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* ======================================================== */
          /* 3. REPORT HISTORY SUBTAB: Full List of Past Evaluations  */
          /* ======================================================== */
          <div style={{
            background: '#111d31',
            border: '1px solid #263750',
            borderRadius: '12px',
            padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Your Report History
                </h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#94a3b8' }}>
                  Review your past academic evaluations and track your score progression over time
                </p>
              </div>
              <button
                onClick={() => setSidebarTab('summary')}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.45rem 0.875rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <ArrowLeft size={14} /> New Evaluation
              </button>
            </div>

            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <Clock size={36} style={{ margin: '0 auto 0.75rem' }} />
                <p style={{ margin: 0, fontSize: '0.875rem' }}>No past reports found. Run your first evaluation!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {history.map((h) => (
                  <div
                    key={h.id}
                    style={{
                      background: '#0b1626',
                      border: '1px solid #1f2f47',
                      borderLeft: `4px solid ${h.risk_color}`,
                      borderRadius: '8px',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'monospace' }}>
                          {h.predicted_score.toFixed(1)}/100
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: '#93c5fd', fontWeight: 600 }}>
                          ({h.score_grade})
                        </span>
                        <span style={{
                          background: `${h.risk_color}20`,
                          color: h.risk_color,
                          border: `1px solid ${h.risk_color}`,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                        }}>
                          {h.risk_status}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                        Generated on: {h.created_at}
                      </span>
                    </div>

                    <button
                      onClick={() => handleViewHistoryReport(h.id)}
                      style={{
                        background: 'rgba(37, 99, 235, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#60a5fa',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <FileText size={14} /> View Full Report
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
