import React, { useState, useEffect } from 'react';
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

  // Clear all form fields completely
  const resetForms = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegFullName('');
    setRegStudentId('');
    setRegEmail('');
    setRegPassword('');
    setRegProgram('Computer Science');
    setRegSemester(4);
    setError('');
    setSuccessMsg('');
  };

  // Reset form whenever modal opens or closes
  useEffect(() => {
    if (isOpen) {
      resetForms();
      setMode('login');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
  };

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
        resetForms();
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
        resetForms();
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
        resetForms();
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
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(32, 14, 52, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #DDCDEE',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 25px 50px -12px rgba(47, 18, 77, 0.28)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #EFE6F8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to right, #F7F1FB, #FFFFFF)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: '#1c2e4a',
              borderRadius: '10px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.25rem',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(28, 46, 74, 0.2)',
            }}>
              S
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: '#1E152A' }}>
                StudIQ Student Portal
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#68597A' }}>
                Sign in to view your diagnostic reports & academic advisory
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              color: '#68597A',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #EFE6F8', background: '#F8F3FB' }}>
          <button
            onClick={() => handleSwitchMode('login')}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: mode === 'login' ? '#FFFFFF' : 'transparent',
              border: 'none',
              borderBottom: mode === 'login' ? '3px solid #501E7E' : '3px solid transparent',
              color: mode === 'login' ? '#3B185F' : '#68597A',
              fontWeight: mode === 'login' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            <LogIn size={16} /> Sign In
          </button>
          <button
            onClick={() => handleSwitchMode('register')}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: mode === 'register' ? '#FFFFFF' : 'transparent',
              border: 'none',
              borderBottom: mode === 'register' ? '3px solid #501E7E' : '3px solid transparent',
              color: mode === 'register' ? '#3B185F' : '#68597A',
              fontWeight: mode === 'register' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            <UserPlus size={16} /> Create Account
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              background: '#FDE8E7',
              border: '1px solid #FCA5A5',
              color: '#D9383A',
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
              background: '#E6F8EE',
              border: '1px solid #86EFAC',
              color: '#16A34A',
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
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#1E152A', marginBottom: '0.375rem', fontWeight: 600 }}>
                  Student Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.875rem',
                    background: '#FAF6FD',
                    border: '1px solid #D8C8EA',
                    borderRadius: '8px',
                    color: '#1E152A',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#1E152A', marginBottom: '0.375rem', fontWeight: 600 }}>
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
                    background: '#FAF6FD',
                    border: '1px solid #D8C8EA',
                    borderRadius: '8px',
                    color: '#1E152A',
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
                  background: 'linear-gradient(135deg, #3B185F, #501E7E)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.8125rem',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 14px rgba(59, 24, 95, 0.3)',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In to Student Portal'}
              </button>

              <div style={{
                position: 'relative',
                textAlign: 'center',
                margin: '0.75rem 0',
              }}>
                <div style={{ borderTop: '1px solid #EFE6F8', position: 'absolute', top: '50%', width: '100%' }}></div>
                <span style={{ background: '#FFFFFF', padding: '0 0.75rem', position: 'relative', fontSize: '0.75rem', color: '#68597A' }}>
                  or instant demo
                </span>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                style={{
                  background: '#F1E8F9',
                  color: '#3B185F',
                  border: '1px solid #D4C2EB',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Sparkles size={16} /> ⚡ Quick Demo Student Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#1E152A', marginBottom: '0.25rem', fontWeight: 600 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Full Name"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    background: '#FAF6FD',
                    border: '1px solid #D8C8EA',
                    borderRadius: '8px',
                    color: '#1E152A',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: '#1E152A', marginBottom: '0.25rem', fontWeight: 600 }}>
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
                      background: '#FAF6FD',
                      border: '1px solid #D8C8EA',
                      borderRadius: '8px',
                      color: '#1E152A',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: '#1E152A', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Semester
                  </label>
                  <select
                    value={regSemester}
                    onChange={(e) => setRegSemester(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      background: '#FAF6FD',
                      border: '1px solid #D8C8EA',
                      borderRadius: '8px',
                      color: '#1E152A',
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
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#1E152A', marginBottom: '0.25rem', fontWeight: 600 }}>
                  Enrolled Degree Program
                </label>
                <select
                  value={regProgram}
                  onChange={(e) => setRegProgram(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    background: '#FAF6FD',
                    border: '1px solid #D8C8EA',
                    borderRadius: '8px',
                    color: '#1E152A',
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
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#1E152A', marginBottom: '0.25rem', fontWeight: 600 }}>
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
                    background: '#FAF6FD',
                    border: '1px solid #D8C8EA',
                    borderRadius: '8px',
                    color: '#1E152A',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#1E152A', marginBottom: '0.25rem', fontWeight: 600 }}>
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
                    background: '#FAF6FD',
                    border: '1px solid #D8C8EA',
                    borderRadius: '8px',
                    color: '#1E152A',
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
                  background: 'linear-gradient(135deg, #3B185F, #501E7E)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 14px rgba(59, 24, 95, 0.3)',
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
