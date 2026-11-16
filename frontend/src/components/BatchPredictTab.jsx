import React, { useState, useRef } from 'react';
import { 
  Users, 
  Play, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  UploadCloud, 
  FileSpreadsheet, 
  RotateCcw,
  FileCheck
} from 'lucide-react';
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
  const [fileName, setFileName] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Parse CSV text into validated StudentInput array
  const parseCSV = (text) => {
    const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      throw new Error('CSV file must have a header row and at least 1 student row.');
    }

    const splitRow = (rowStr) => {
      const values = [];
      let current = '';
      let insideQuotes = false;
      for (let i = 0; i < rowStr.length; i++) {
        const char = rowStr[i];
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values.map((v) => v.replace(/^"|"$/g, '').trim());
    };

    const rawHeaders = splitRow(lines[0]);
    const headers = rawHeaders.map((h) => h.toLowerCase().replace(/[\s_%-]/g, ''));

    const parsed = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = splitRow(lines[i]);
      if (cells.length < 2 || cells.every((c) => c === '')) continue;

      const row = {};
      headers.forEach((h, idx) => {
        row[h] = cells[idx] !== undefined ? cells[idx] : '';
      });

      const getNum = (keys, fallback) => {
        for (const k of keys) {
          if (row[k] !== undefined && row[k] !== '') {
            const v = parseFloat(row[k]);
            if (!isNaN(v)) return v;
          }
        }
        return fallback;
      };

      const getStr = (keys, fallback) => {
        for (const k of keys) {
          if (row[k] !== undefined && row[k] !== '') {
            return String(row[k]).trim();
          }
        }
        return fallback;
      };

      parsed.push({
        institution_id: Math.max(0, Math.min(9, Math.round(getNum(['institutionid', 'institution', 'collegeid'], 1)))),
        program: getStr(['program', 'degree', 'branch', 'course'], 'Computer Science'),
        semester: Math.max(1, Math.min(8, Math.round(getNum(['semester', 'sem'], 4)))),
        age: Math.max(17, Math.min(45, Math.round(getNum(['age'], 21)))),
        study_hours_per_day: Math.max(0, Math.min(24, getNum(['studyhoursperday', 'studyhours', 'studyhour', 'hours'], 4.0))),
        attendance_pct: Math.max(0, Math.min(100, getNum(['attendancepct', 'attendance', 'attendancerate'], 80.0))),
        previous_gpa: Math.max(0, Math.min(10, getNum(['previousgpa', 'gpa', 'cgpa'], 7.0))),
        assignment_completion_pct: Math.max(0, Math.min(100, getNum(['assignmentcompletionpct', 'assignmentpct', 'assignments', 'assignment'], 85.0))),
        internal_marks: Math.max(0, Math.min(100, getNum(['internalmarks', 'internal', 'internals', 'marks'], 75.0))),
        sleep_hours: Math.max(2, Math.min(14, getNum(['sleephours', 'sleep'], 7.0))),
        commute_minutes: Math.max(0, Math.min(300, getNum(['commuteminutes', 'commute'], 30.0))),
        internet_access: getStr(['internetaccess', 'internet'], 'Reliable'),
        parental_education: getStr(['parentaleducation', 'education'], 'Undergraduate'),
        extracurricular_level: getStr(['extracurricularlevel', 'extracurricular'], 'Medium'),
        financial_pressure: getStr(['financialpressure', 'financial'], 'Low'),
        part_time_job: getStr(['parttimejob', 'job', 'work'], 'No'),
        lms_logins: Math.max(0, Math.min(200, Math.round(getNum(['lmslogins', 'lms', 'logins'], 20)))),
        missed_deadlines: Math.max(0, Math.min(50, Math.round(getNum(['misseddeadlines', 'deadlines', 'missed'], 1)))),
      });
    }

    if (parsed.length === 0) {
      throw new Error('No valid student rows found in the CSV file.');
    }
    return parsed;
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a valid .csv file.');
      return;
    }
    setError('');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const students = parseCSV(text);
        setBatchData(students);
        setFileName(file.name);
        runBatch(students);
      } catch (err) {
        setError(err.message || 'Failed to parse CSV file.');
      }
    };
    reader.onerror = () => {
      setError('Error reading the selected file.');
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    handleFileUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleResetSample = () => {
    setBatchData(SAMPLE_BATCH);
    setFileName('');
    setResponse(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const runBatch = async (data = batchData) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.batchPredict(data);
      setResponse(res);
    } catch (err) {
      setError(err.message || 'Batch prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'program', 'semester', 'attendance_pct', 'study_hours_per_day',
      'internal_marks', 'previous_gpa', 'assignment_completion_pct',
      'lms_logins', 'missed_deadlines', 'institution_id'
    ];
    const demoRows = [
      ['Computer Science', '4', '92', '5.5', '88', '8.5', '95', '35', '0', '1'],
      ['Information Technology', '3', '75', '3.0', '68', '6.9', '78', '18', '2', '2'],
      ['Master of Computer Applications (MCA)', '2', '55', '1.5', '45', '5.2', '50', '8', '4', '3'],
      ['Data Science & AI', '5', '88', '4.5', '82', '7.8', '90', '26', '1', '1'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...demoRows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'student_batch_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCSV = () => {
    if (!response || !response.results) return;
    const headers = [
      'StudentID', 'Program', 'Semester', 'Attendance%', 'StudyHours',
      'InternalMarks', 'PredictedScore', 'Grade', 'Risk%', 'Status'
    ];
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
      
      {/* Top Banner & Action Controls */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E152A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Users size={22} color="#501E7E" />
            Batch Score Predictor
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#68597A', margin: '0.25rem 0 0' }}>
            Upload a CSV file or use sample data to predict scores for multiple students at once.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={downloadTemplate} title="Download CSV template">
            <FileSpreadsheet size={16} />
            Template CSV
          </button>
          <button className="btn btn-primary" onClick={() => runBatch()} disabled={loading}>
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
            {loading ? 'Processing...' : `Run Batch (${batchData.length})`}
          </button>
          {response && (
            <button className="btn btn-secondary" onClick={exportCSV}>
              <Download size={16} />
              Download CSV
            </button>
          )}
        </div>
      </div>

      {/* CSV File Upload Area */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          background: isDragActive ? '#F3EBF9' : '#FAF6FD',
          border: isDragActive ? '2px dashed #501E7E' : '1px dashed #C8B4DF',
          borderRadius: '12px',
          padding: '1.75rem',
          textAlign: 'center',
          transition: 'all 0.2s',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          accept=".csv" 
          onChange={handleFileInputChange} 
          style={{ display: 'none' }} 
        />
        
        <div style={{ 
          width: 52, 
          height: 52, 
          borderRadius: '50%', 
          background: '#F1E8F9', 
          border: '1px solid #DDCDEE', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#501E7E'
        }}>
          <UploadCloud size={26} />
        </div>

        <div>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 800, color: '#1E152A' }}>
            {fileName ? (
              <span style={{ color: '#501E7E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <FileCheck size={18} color="#16A34A" /> {fileName} ({batchData.length} students loaded)
              </span>
            ) : (
              'Upload CSV File for Batch Prediction'
            )}
          </h3>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#68597A' }}>
            Click or drag & drop a .csv file containing student marks and attendance
          </p>
        </div>

        {fileName && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }} onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              onClick={handleResetSample}
              style={{
                background: '#FFFFFF',
                color: '#501E7E',
                border: '1px solid #D8C7EB',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <RotateCcw size={13} /> Reset to Demo Cohort
            </button>
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: '#FDE8E7', border: '1px solid #FCA5A5', color: '#D9383A', padding: '0.85rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Cohort Summary Metrics */}
      {response && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#68597A', fontWeight: 600 }}>Total Students</span>
            <strong style={{ fontSize: '1.6rem', color: '#1E152A', display: 'block', fontWeight: 800 }}>{response.total_students}</strong>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#68597A', fontWeight: 600 }}>Average Predicted Score</span>
            <strong style={{ fontSize: '1.6rem', color: '#501E7E', display: 'block', fontWeight: 800 }}>{response.average_predicted_score}</strong>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#68597A', fontWeight: 600 }}>Flagged At-Risk</span>
            <strong style={{ fontSize: '1.6rem', color: response.at_risk_count > 0 ? '#D9383A' : '#16A34A', display: 'block', fontWeight: 800 }}>
              {response.at_risk_count}
            </strong>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#68597A', fontWeight: 600 }}>Safe Students</span>
            <strong style={{ fontSize: '1.6rem', color: '#16A34A', display: 'block', fontWeight: 800 }}>{response.safe_count}</strong>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2D4F0', background: '#FAF6FD', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E152A', margin: 0 }}>
            {fileName ? `Prediction Results: ${fileName}` : 'Cohort Student Predictions Roster'}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#501E7E', fontWeight: 700 }}>
            {batchData.length} records ready
          </span>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {response ? (
                response.results.map((item) => (
                  <tr key={item.student_id}>
                    <td style={{ fontWeight: 700, color: '#501E7E' }}>{item.student_id}</td>
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
                          background: item.result.risk_status === 'SAFE' ? '#E6F8EE' : '#FDE8E7',
                          color: item.result.risk_status === 'SAFE' ? '#16A34A' : '#D9383A',
                          border: `1px solid ${item.result.risk_status === 'SAFE' ? 'rgba(22, 163, 74, 0.25)' : 'rgba(217, 56, 58, 0.25)'}`,
                          fontSize: '0.68rem',
                        }}
                      >
                        {item.result.risk_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2.5rem', color: '#68597A' }}>
                    Upload a CSV file or click 'Run Batch ({batchData.length})' to process predictions.
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
