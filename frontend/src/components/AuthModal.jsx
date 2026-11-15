import React, { useState } from 'react';
import { LogIn, UserPlus, X, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { api, authStorage } from '../services/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regProgram, setRegProgram] = useState('Computer Science');
  const [regSemester, setRegSemester] = useState(4);

  if (!isOpen) return null;

  async function handleLogin(e) {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login({ email: loginEmail, password: loginPassword });
      authStorage.setToken(res.access_token);
      authStorage.setUser(res.user);
      setSuccessMsg('Signed in successfully!');
      setTimeout(() => {
        onLoginSuccess(res.user);
        onClose();
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setLoginEmail('demo@student.edu');
    setLoginPassword('demo1234');
    setError('');
    setLoading(true);
    try {
      const res = await api.login({ email: 'demo@student.edu', password: 'demo1234' });
      authStorage.setToken(res.access_token);
      authStorage.setUser(res.user);
      setSuccessMsg('Logged in as Demo Student!');
      setTimeout(() => {
        onLoginSuccess(res.user);
        onClose();
      }, 500);
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.register({
        email: regEmail,
        password: regPassword,
        full_name: regFullName,
        student_id: regStudentId,
        program: regProgram,
        semester: Number(regSemester),
        institution_id: 3,
      });
      authStorage.setToken(res.access_token);
      authStorage.setUser(res.user);
      setSuccessMsg('Account created successfully! Welcome aboard.');
      setTimeout(() => {
        onLoginSuccess(res.user);
        onClose();
      }, 600);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 11, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div style={{
        background: '#111d31',
        border: '1px solid #263750',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #1f2f47',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to right, rgba(26, 42, 69, 0.6), transparent)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#f3f7ff' }}>
                Student Portal
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#8899b5' }}>
                Sign in to view your diagnostic reports & academic advisory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#8899b5',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1f2f47', background: '#0c1626' }}>
          <button
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: mode === 'login' ? '#111d31' : 'transparent',
              border: 'none',
              borderBottom: mode === 'login' ? '2px solid #3b82f6' : '2px solid transparent',
              color: mode === 'login' ? '#f3f7ff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <LogIn size={16} /> Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: mode === 'register' ? '#111d31' : 'transparent',
              border: 'none',
              borderBottom: mode === 'register' ? '2px solid #3b82f6' : '2px solid transparent',
              color: mode === 'register' ? '#f3f7ff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <UserPlus size={16} /> Create Account
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#6ee7b7',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem', fontWeight: 500 }}>
                  Student Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex.morgan@university.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.875rem',
                    background: '#091220',
                    border: '1px solid #233550',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.375rem', fontWeight: 500 }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.875rem',
                    background: '#091220',
                    border: '1px solid #233550',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.8125rem',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In to Student Portal'}
              </button>

              <div style={{
                position: 'relative',
                textAlign: 'center',
                margin: '0.75rem 0',
              }}>
                <div style={{ borderTop: '1px solid #1f2f47', position: 'absolute', top: '50%', width: '100%' }}></div>
                <span style={{ background: '#111d31', padding: '0 0.75rem', position: 'relative', fontSize: '0.75rem', color: '#64748b' }}>
                  or instant demo
                </span>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  color: '#93c5fd',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Sparkles size={16} /> ⚡ Quick Demo Student Login (Alex Morgan)
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 500 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    background: '#091220',
                    border: '1px solid #233550',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 500 }}>
                    Roll / Student ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. STU-2026-08"
                    value={regStudentId}
                    onChange={(e) => setRegStudentId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      background: '#091220',
                      border: '1px solid #233550',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 500 }}>
                    Semester
                  </label>
                  <select
                    value={regSemester}
                    onChange={(e) => setRegSemester(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      background: '#091220',
                      border: '1px solid #233550',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.875rem',
                      outline: 'none',
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
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 500 }}>
                  Enrolled Degree Program
                </label>
                <select
                  value={regProgram}
                  onChange={(e) => setRegProgram(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    background: '#091220',
                    border: '1px solid #233550',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Master of Computer Applications (MCA)">Master of Computer Applications (MCA)</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Business Administration">Business Administration</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 500 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    background: '#091220',
                    border: '1px solid #233550',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 500 }}>
                  Create Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    background: '#091220',
                    border: '1px solid #233550',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                {loading ? 'Creating Student Profile...' : 'Complete Registration & Sign In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
