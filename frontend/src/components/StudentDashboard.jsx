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
  onLogout 
}) {
  const [sidebarTab, setSidebarTab] = useState('summary'); // 'summary' | 'history'

  const isDemo = currentUser?.email === 'demo@student.edu';

  // Subject-wise marks state: clean starter inputs for regular students, demo values for demo account
  const [subjects, setSubjects] = useState(
    isDemo ? [
      { id: 1, name: 'Core Subject 1 (Theory)', gained: 42, total: 50 },
      { id: 2, name: 'Core Subject 2 (Algorithms)', gained: 44, total: 50 },
      { id: 3, name: 'Practical Lab / Coursework', gained: 45, total: 50 },
    ] : [
      { id: 1, name: 'Subject 1', gained: '', total: 50 },
      { id: 2, name: 'Subject 2', gained: '', total: 50 },
      { id: 3, name: 'Subject 3', gained: '', total: 50 },
    ]
  );

  // Overall component inputs with gained and out-of fields
  const [attendanceAttended, setAttendanceAttended] = useState(isDemo ? 42 : '');
  const [attendanceTotal, setAttendanceTotal] = useState(50);

  const [assignmentSubmitted, setAssignmentSubmitted] = useState(isDemo ? 9 : '');
  const [assignmentTotal, setAssignmentTotal] = useState(10);

  const [studyHoursPerDay, setStudyHoursPerDay] = useState(isDemo ? 4.5 : '');
  const [gpaGained, setGpaGained] = useState(isDemo ? 7.8 : '');
  const [lmsLogins, setLmsLogins] = useState(isDemo ? 25 : '');
  const [missedDeadlines, setMissedDeadlines] = useState(0);
  const [sleepHours, setSleepHours] = useState(7.0);
  const [commuteMinutes, setCommuteMinutes] = useState(30.0);

  // Report state: ALWAYS starts as null for fresh session so no dummy report is shown
  const [calculating, setCalculating] = useState(false);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  // Load ONLY past history on mount (NEVER automatically calculate report)
  useEffect(() => {
    if (currentUser) {
      loadHistory();
    }
  }, [currentUser]);

  async function loadHistory() {
    try {
      const hist = await api.getStudentHistory();
      if (Array.isArray(hist)) setHistory(hist);
    } catch (_) {}
  }

  // Populate sample values for 1-click preview
  const handleFillSampleData = () => {
    setSubjects([
      { id: 1, name: 'Core Subject 1 (Theory)', gained: 42, total: 50 },
      { id: 2, name: 'Core Subject 2 (Algorithms)', gained: 44, total: 50 },
      { id: 3, name: 'Practical Lab / Coursework', gained: 45, total: 50 },
    ]);
    setAttendanceAttended(42);
    setAttendanceTotal(50);
    setAssignmentSubmitted(9);
    setAssignmentTotal(10);
    setStudyHoursPerDay(4.5);
    setGpaGained(7.8);
    setLmsLogins(25);
    setMissedDeadlines(0);
    setError('');
  };

  // Reset form to blank
  const handleClearForm = () => {
    setSubjects([
      { id: 1, name: 'Subject 1', gained: '', total: 50 },
      { id: 2, name: 'Subject 2', gained: '', total: 50 },
      { id: 3, name: 'Subject 3', gained: '', total: 50 },
    ]);
    setAttendanceAttended('');
    setAttendanceTotal(50);
    setAssignmentSubmitted('');
    setAssignmentTotal(10);
    setStudyHoursPerDay('');
    setGpaGained('');
    setLmsLogins('');
    setMissedDeadlines(0);
    setReport(null);
    setError('');
  };

  // Subject helpers
  const handleAddSubject = () => {
    setSubjects((prev) => [
      ...prev,
      { id: Date.now(), name: `Subject ${prev.length + 1}`, gained: '', total: 50 },
    ]);
  };

  const handleRemoveSubject = (id) => {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubjectChange = (id, field, value) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Computed percentages
  const totalSubjectGained = subjects.reduce((sum, s) => sum + (Number(s.gained) || 0), 0);
  const totalSubjectMax = subjects.reduce((sum, s) => sum + (Number(s.total) || 50), 0);
  const computedInternalMarks = totalSubjectMax > 0 ? (totalSubjectGained / totalSubjectMax) * 100 : 0;

  const computedAttendancePct = Number(attendanceTotal) > 0 
    ? (Number(attendanceAttended || 0) / Number(attendanceTotal)) * 100 
    : 0;

  const computedAssignmentPct = Number(assignmentTotal) > 0 
    ? (Number(assignmentSubmitted || 0) / Number(assignmentTotal)) * 100 
    : 0;

  async function handleCalculate(e) {
    if (e) e.preventDefault();
    setError('');
    setCalculating(true);
    try {
      const payload = {
        subjects: subjects.map((s) => ({
          name: s.name,
          marks_obtained: Number(s.gained || 0),
          marks_out_of: Number(s.total || 50),
        })),
        lectures_attended: Number(attendanceAttended || 0),
        total_lectures: Number(attendanceTotal || 50),
        assignment_completed: Number(assignmentSubmitted || 0),
        total_assignments: Number(assignmentTotal || 10),
        study_hours_per_day: Number(studyHoursPerDay || 3.5),
        previous_gpa: Number(gpaGained || 7.0),
        lms_logins: Number(lmsLogins || 20),
        missed_deadlines: Number(missedDeadlines || 0),
        sleep_hours: Number(sleepHours || 7.0),
        commute_minutes: Number(commuteMinutes || 30.0),
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

  async function handleDeleteReport(e, reportId) {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this report from history?')) return;
    try {
      await api.deleteStudentReport(reportId);
      if (report && report.report_id === reportId) {
        setReport(null);
      }
      loadHistory();
    } catch (_) {}
  }

  async function handleClearAllHistory() {
    if (!window.confirm('Are you sure you want to clear all report history?')) return;
    try {
      await api.clearStudentHistory();
      setReport(null);
      loadHistory();
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
        background: '#FFFFFF',
        border: '1px solid #E2D4F0',
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 10px 25px -5px rgba(78, 36, 115, 0.07)',
      }}>
        {/* Student Profile Card */}
        <div style={{
          padding: '1.25rem 1rem',
          background: '#FAF6FD',
          border: '1px solid #EADBFA',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: '#1c2e4a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.4rem',
            boxShadow: '0 3px 10px rgba(28, 46, 74, 0.25)',
          }}>
            {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'S'}
          </div>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 800, color: '#1E152A' }}>
            {currentUser.full_name}
          </h3>
          <span style={{
            display: 'inline-block',
            background: '#F1E8F9',
            border: '1px solid #DDCDEE',
            color: '#501E7E',
            padding: '0.15rem 0.55rem',
            borderRadius: '6px',
            fontSize: '0.6875rem',
            fontWeight: 700,
            marginBottom: '0.35rem',
          }}>
            {currentUser.student_id || 'STU-' + currentUser.id}
          </span>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#68597A', fontWeight: 500 }}>
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
              border: sidebarTab === 'summary' ? '1px solid #D8C7EB' : '1px solid transparent',
              background: sidebarTab === 'summary' ? '#F3EBF9' : 'transparent',
              color: sidebarTab === 'summary' ? '#3B185F' : '#68597A',
              fontWeight: sidebarTab === 'summary' ? 700 : 500,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <FileText size={16} color={sidebarTab === 'summary' ? '#501E7E' : '#8C7C9E'} />
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
              border: sidebarTab === 'history' ? '1px solid #D8C7EB' : '1px solid transparent',
              background: sidebarTab === 'history' ? '#F3EBF9' : 'transparent',
              color: sidebarTab === 'history' ? '#3B185F' : '#68597A',
              fontWeight: sidebarTab === 'history' ? 700 : 500,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Clock size={16} color={sidebarTab === 'history' ? '#501E7E' : '#8C7C9E'} />
              <span>Report History</span>
            </div>
            {history.length > 0 && (
              <span style={{ background: '#EADBFA', color: '#501E7E', fontSize: '0.6875rem', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 800 }}>
                {history.length}
              </span>
            )}
          </button>
        </div>

        {/* Quick History List in Sidebar */}
        {history.length > 0 && (
          <div style={{ marginTop: 'auto', borderTop: '1px solid #EFE6F8', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.6875rem', color: '#8C7C9E', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
              Recent Scores
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto' }}>
              {history.slice(0, 3).map((h) => (
                <div
                  key={h.id}
                  onClick={() => handleViewHistoryReport(h.id)}
                  style={{
                    padding: '0.45rem 0.65rem',
                    background: '#FAF6FD',
                    border: '1px solid #EADBFA',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    borderLeft: `3px solid ${h.risk_color}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#1E152A' }}>
                    {h.predicted_score.toFixed(1)}/100
                  </span>
                  <span style={{ color: h.risk_status === 'SAFE' ? '#16A34A' : '#D9383A', fontSize: '0.6875rem', fontWeight: 700 }}>
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
            background: '#FDE8E7',
            border: '1px solid #FCA5A5',
            color: '#D9383A',
            padding: '0.625rem',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background 0.2s',
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
              background: '#FFFFFF',
              border: '1px solid #E2D4F0',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 4px 12px rgba(78, 36, 115, 0.04)'
            }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E152A', margin: 0 }}>
                  Performance Report
                </h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#68597A' }}>
                  Enter your marks and academic details to generate your diagnostic performance report
                </p>
              </div>

              {report && (
                <button
                  onClick={handlePrint}
                  style={{
                    background: '#F3ECF9',
                    color: '#3B185F',
                    border: '1px solid #D8C7EB',
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
                background: '#FFFFFF',
                border: '1px solid #E2D4F0',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(78, 36, 115, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E152A', margin: 0 }}>
                    Subject Marks & Indicators (Obtained / Out Of)
                  </h3>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={handleFillSampleData}
                      style={{
                        background: '#FEF3C7',
                        border: '1px solid #FDE68A',
                        color: '#92400E',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      title="Quickly fill sample marks to test"
                    >
                      Fill Example Marks
                    </button>
                    <button
                      type="button"
                      onClick={handleClearForm}
                      style={{
                        background: '#FDE8E7',
                        border: '1px solid #FECDD3',
                        color: '#D9383A',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      title="Clear all fields"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {error && (
                  <div style={{ background: '#FDE8E7', border: '1px solid #FCA5A5', color: '#D9383A', padding: '0.625rem', borderRadius: '8px', fontSize: '0.75rem', marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* --- Section A: Subject-wise Internal Marks --- */}
                  <div style={{ background: '#FAF6FD', border: '1px solid #EADBFA', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E152A' }}>
                        1. Subject-Wise Internal Marks
                      </span>
                      <button
                        type="button"
                        onClick={handleAddSubject}
                        style={{
                          background: '#F1E8F9',
                          color: '#501E7E',
                          border: '1px solid #DDCDEE',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
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
                              background: '#FFFFFF',
                              border: '1px solid #D8C8EA',
                              borderRadius: '6px',
                              color: '#1E152A',
                              fontSize: '0.75rem',
                              outline: 'none',
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
                                background: '#FFFFFF',
                                border: '1px solid #D8C8EA',
                                borderRadius: '6px',
                                color: '#1E152A',
                                fontSize: '0.75rem',
                                textAlign: 'center',
                                outline: 'none',
                              }}
                            />
                            <span style={{ color: '#68597A', fontSize: '0.75rem' }}>/</span>
                            <input
                              type="number"
                              min="1"
                              placeholder="Out Of"
                              value={sub.total}
                              onChange={(e) => handleSubjectChange(sub.id, 'total', Number(e.target.value))}
                              style={{
                                width: '50px',
                                padding: '0.45rem 0.4rem',
                                background: '#FFFFFF',
                                border: '1px solid #D8C8EA',
                                borderRadius: '6px',
                                color: '#1E152A',
                                fontSize: '0.75rem',
                                textAlign: 'center',
                                outline: 'none',
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
                                color: '#D9383A',
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
                      background: '#F3EBF9',
                      border: '1px solid #D8C7EB',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                    }}>
                      <span style={{ color: '#501E7E' }}>
                        Total Gained: <strong>{totalSubjectGained} / {totalSubjectMax}</strong>
                      </span>
                      <span style={{ color: '#3B185F', fontWeight: 800 }}>
                        Computed Internal: {computedInternalMarks.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* --- Section B: Attendance (Attended / Out Of Total) --- */}
                  <div style={{ background: '#FAF6FD', border: '1px solid #EADBFA', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E152A' }}>
                        2. Classroom Lecture Attendance
                      </span>
                      <span style={{ color: computedAttendancePct >= 75 ? '#16A34A' : '#D9383A', fontWeight: 800, fontSize: '0.8125rem' }}>
                        {computedAttendancePct.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.6875rem', color: '#68597A', marginBottom: '0.2rem' }}>
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
                            background: '#FFFFFF',
                            border: '1px solid #D8C8EA',
                            borderRadius: '6px',
                            color: '#1E152A',
                            fontSize: '0.75rem',
                            boxSizing: 'border-box',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <span style={{ color: '#68597A', fontSize: '1rem', marginTop: '1rem' }}>/</span>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.6875rem', color: '#68597A', marginBottom: '0.2rem' }}>
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
                            background: '#FFFFFF',
                            border: '1px solid #D8C8EA',
                            borderRadius: '6px',
                            color: '#1E152A',
                            fontSize: '0.75rem',
                            boxSizing: 'border-box',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#EADBFA', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${computedAttendancePct}%`,
                        height: '100%',
                        background: computedAttendancePct >= 75 ? '#16A34A' : '#D9383A',
                        transition: 'width 0.3s ease',
                      }}></div>
                    </div>
                  </div>

                  {/* --- Section C: Assignments Completed / Total --- */}
                  <div style={{ background: '#FAF6FD', border: '1px solid #EADBFA', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E152A' }}>
                        3. Assignments & Lab Deliverables
                      </span>
                      <span style={{ color: '#501E7E', fontWeight: 800, fontSize: '0.8125rem' }}>
                        {computedAssignmentPct.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.6875rem', color: '#68597A', marginBottom: '0.2rem' }}>
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
                            background: '#FFFFFF',
                            border: '1px solid #D8C8EA',
                            borderRadius: '6px',
                            color: '#1E152A',
                            fontSize: '0.75rem',
                            boxSizing: 'border-box',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <span style={{ color: '#68597A', fontSize: '1rem', marginTop: '1rem' }}>/</span>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.6875rem', color: '#68597A', marginBottom: '0.2rem' }}>
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
                            background: '#FFFFFF',
                            border: '1px solid #D8C8EA',
                            borderRadius: '6px',
                            color: '#1E152A',
                            fontSize: '0.75rem',
                            boxSizing: 'border-box',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- Section D: Study Routine & Academic Context --- */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#1E152A', marginBottom: '0.25rem', fontWeight: 600 }}>
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
                          background: '#FAF6FD',
                          border: '1px solid #D8C8EA',
                          borderRadius: '6px',
                          color: '#1E152A',
                          fontSize: '0.75rem',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                      <span style={{ fontSize: '0.6875rem', color: '#8C7C9E' }}>Hours per day</span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#1E152A', marginBottom: '0.25rem', fontWeight: 600 }}>
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
                          background: '#FAF6FD',
                          border: '1px solid #D8C8EA',
                          borderRadius: '6px',
                          color: '#1E152A',
                          fontSize: '0.75rem',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                      <span style={{ fontSize: '0.6875rem', color: '#8C7C9E' }}>Out of 10.0</span>
                    </div>
                  </div>

                  {/* LMS & Deadlines */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#1E152A', marginBottom: '0.25rem', fontWeight: 600 }}>
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
                          background: '#FAF6FD',
                          border: '1px solid #D8C8EA',
                          borderRadius: '6px',
                          color: '#1E152A',
                          fontSize: '0.75rem',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#1E152A', marginBottom: '0.25rem', fontWeight: 600 }}>
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
                          background: '#FAF6FD',
                          border: '1px solid #D8C8EA',
                          borderRadius: '6px',
                          color: '#1E152A',
                          fontSize: '0.75rem',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={calculating}
                    style={{
                      background: 'linear-gradient(135deg, #3B185F, #501E7E)',
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
                      boxShadow: '0 4px 14px rgba(59, 24, 95, 0.3)',
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
                      background: '#FFFFFF',
                      border: '1px solid #E2D4F0',
                      borderRadius: '12px',
                      padding: '1.25rem 1.5rem',
                      boxShadow: '0 4px 12px rgba(78, 36, 115, 0.04)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#68597A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                            PREDICTED FINAL SCORE
                          </span>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1E152A', lineHeight: 1 }}>
                              {report.predicted_score.toFixed(1)}
                            </span>
                            <span style={{ fontSize: '1rem', color: '#501E7E', fontWeight: 700 }}>
                              / 100 ({report.score_grade})
                            </span>
                          </div>
                        </div>

                        <div style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '8px',
                          background: report.risk_status === 'SAFE' ? '#E6F8EE' : '#FDE8E7',
                          border: `1px solid ${report.risk_status === 'SAFE' ? 'rgba(22, 163, 74, 0.25)' : 'rgba(217, 56, 58, 0.25)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}>
                          {report.risk_status === 'SAFE' ? (
                            <CheckCircle color="#16A34A" size={18} />
                          ) : (
                            <AlertTriangle color="#D9383A" size={18} />
                          )}
                          <span style={{ color: report.risk_status === 'SAFE' ? '#16A34A' : '#D9383A', fontWeight: 800, fontSize: '0.8125rem' }}>
                            {report.risk_status}
                          </span>
                        </div>
                      </div>

                      {/* Performance Summary Report */}
                      <div style={{
                        marginTop: '1.15rem',
                        padding: '1rem',
                        background: '#FAF6FD',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${report.risk_status === 'SAFE' ? '#16A34A' : '#501E7E'}`,
                        fontSize: '0.8125rem',
                        lineHeight: 1.6,
                        color: '#3A2E47',
                      }}>
                        <strong style={{ color: '#501E7E', display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                          Performance Summary:
                        </strong>
                        {report.executive_summary}
                      </div>
                    </div>

                    {/* What He Is Best At */}
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2D4F0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      boxShadow: '0 4px 12px rgba(78, 36, 115, 0.04)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Award color="#16A34A" size={18} />
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: '#1E152A' }}>
                          In Which You Are Best (Top Strengths)
                        </h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {report.best_strengths.map((st, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '0.625rem 0.875rem',
                              background: '#E6F8EE',
                              border: '1px solid rgba(22, 163, 74, 0.25)',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              color: '#15803D',
                              lineHeight: 1.5,
                              fontWeight: 500,
                            }}
                          >
                            ✓ {st}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* What He Needs To Prepare */}
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2D4F0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      boxShadow: '0 4px 12px rgba(78, 36, 115, 0.04)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <CheckSquare color="#D97706" size={18} />
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: '#1E152A' }}>
                          What You Need To Prepare (Focus Areas)
                        </h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {report.preparation_priorities.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '0.625rem 0.875rem',
                              background: '#FEF3C7',
                              border: '1px solid rgba(217, 119, 6, 0.25)',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              color: '#92400E',
                              lineHeight: 1.5,
                              fontWeight: 500,
                            }}
                          >
                            ! {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Component Breakdown */}
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2D4F0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      boxShadow: '0 4px 12px rgba(78, 36, 115, 0.04)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <BarChart3 color="#501E7E" size={18} />
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: '#1E152A' }}>
                          Evaluation Dimension Ratings
                        </h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {report.component_breakdown.map((comp, idx) => (
                          <div key={idx} style={{ background: '#FAF6FD', border: '1px solid #EADBFA', padding: '0.625rem', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
                              <span style={{ fontWeight: 700, color: '#1E152A' }}>{comp.name}</span>
                              <span style={{ color: comp.color, fontWeight: 700 }}>{comp.status} ({comp.grade_label})</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#EADBFA', borderRadius: '3px', overflow: 'hidden' }}>
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
                    padding: '3.5rem 2rem',
                    textAlign: 'center',
                    background: '#FFFFFF',
                    border: '1px solid #E2D4F0',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 4px 12px rgba(78, 36, 115, 0.04)'
                  }}>
                    <div style={{
                      width: 54,
                      height: 54,
                      borderRadius: '50%',
                      background: '#F1E8F9',
                      border: '1px solid #DDCDEE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#501E7E',
                      marginBottom: '0.25rem'
                    }}>
                      <GraduationCap size={28} />
                    </div>
                    <h4 style={{ color: '#1E152A', margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                      Ready to Calculate Your Performance
                    </h4>
                    <p style={{ color: '#68597A', fontSize: '0.8125rem', margin: 0, maxWidth: '380px', lineHeight: 1.5 }}>
                      Enter your marks on the left and click <strong>"Calculate Score"</strong> to generate your personalized diagnostic report.
                    </p>
                    <button
                      type="button"
                      onClick={handleFillSampleData}
                      style={{
                        marginTop: '0.5rem',
                        background: '#F1E8F9',
                        border: '1px solid #D8C7EB',
                        color: '#501E7E',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Sparkles size={14} /> Fill Example Marks & Preview
                    </button>
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
            background: '#FFFFFF',
            border: '1px solid #E2D4F0',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(78, 36, 115, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E152A', margin: 0 }}>
                  Your Report History
                </h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#68597A' }}>
                  Review your past academic evaluations and track your score progression over time
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {history.length > 0 && (
                  <button
                    onClick={handleClearAllHistory}
                    style={{
                      background: '#FDE8E7',
                      border: '1px solid #FCA5A5',
                      color: '#D9383A',
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
                    <Trash2 size={13} /> Clear All History
                  </button>
                )}
                <button
                  onClick={() => setSidebarTab('summary')}
                  style={{
                    background: 'linear-gradient(135deg, #3B185F, #501E7E)',
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
            </div>

            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#8C7C9E' }}>
                <Clock size={36} style={{ margin: '0 auto 0.75rem', color: '#B39CCA' }} />
                <p style={{ margin: 0, fontSize: '0.875rem' }}>No past reports found. Enter your marks and calculate your first report!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {history.map((h) => (
                  <div
                    key={h.id}
                    style={{
                      background: '#FAF6FD',
                      border: '1px solid #EADBFA',
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
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E152A' }}>
                          {h.predicted_score.toFixed(1)}/100
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: '#501E7E', fontWeight: 600 }}>
                          ({h.score_grade})
                        </span>
                        <span style={{
                          background: h.risk_status === 'SAFE' ? '#E6F8EE' : '#FDE8E7',
                          color: h.risk_status === 'SAFE' ? '#16A34A' : '#D9383A',
                          border: `1px solid ${h.risk_status === 'SAFE' ? 'rgba(22, 163, 74, 0.25)' : 'rgba(217, 56, 58, 0.25)'}`,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                        }}>
                          {h.risk_status}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.6875rem', color: '#8C7C9E', marginTop: '0.25rem', display: 'block' }}>
                        Generated on: {h.created_at}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        onClick={() => handleViewHistoryReport(h.id)}
                        style={{
                          background: '#F1E8F9',
                          border: '1px solid #D8C7EB',
                          color: '#501E7E',
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
                        <FileText size={14} /> View Report
                      </button>
                      <button
                        onClick={(e) => handleDeleteReport(e, h.id)}
                        title="Delete this report"
                        style={{
                          background: '#FDE8E7',
                          border: '1px solid #FCA5A5',
                          color: '#D9383A',
                          padding: '0.45rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
