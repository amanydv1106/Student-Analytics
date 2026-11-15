import React from 'react';
import { 
  GraduationCap, 
  Sliders, 
  Trophy, 
  Globe2, 
  BarChart3, 
  Users, 
  LogIn,
  LogOut,
  UserCheck,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  backendStatus,
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  const navItems = [
    { id: 'student-portal', label: '🎓 Student Portal & Report', icon: GraduationCap, highlight: true },
    { id: 'predict', label: 'Faculty Predictor', icon: GraduationCap },
    { id: 'simulate', label: 'What-If Simulator', icon: Sliders },
    { id: 'leaderboard', label: 'Model Leaderboards', icon: Trophy },
    { id: 'domain', label: 'Domain Generalization', icon: Globe2 },
    { id: 'analytics', label: 'Dataset & EDA', icon: BarChart3 },
    { id: 'batch', label: 'Batch Predictor', icon: Users },
  ];

  return (
    <header style={{ borderBottom: '1px solid var(--border-card)', background: 'rgba(11, 23, 40, 0.85)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)' }}>
            <GraduationCap size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc', margin: 0 }}>
                Student Success AI
              </h1>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>MCA Prototype</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.125rem 0 0' }}>
              Early-Warning Advisory & Performance Diagnostic System
            </p>
          </div>
        </div>

        {/* User Auth & Server Status Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Server status pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-card)', padding: '0.35rem 0.75rem', borderRadius: 9999, border: '1px solid var(--border-card)', fontSize: '0.75rem' }}>
            {backendStatus === 'online' ? (
              <>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }}></span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>API Connected</span>
              </>
            ) : (
              <>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }}></span>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>Connecting...</span>
              </>
            )}
          </div>

          {/* Student Account Button / Profile Pill */}
          {currentUser ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '9999px',
              padding: '0.25rem 0.5rem 0.25rem 0.25rem',
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.1 }}>
                  {currentUser.full_name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                  Sem {currentUser.semester}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: '#ffffff',
                border: 'none',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              }}
            >
              <LogIn size={15} /> Student Login
            </button>
          )}
        </div>
      </div>

      {/* Navigation tabs */}
      <div style={{ borderTop: '1px solid rgba(28, 46, 76, 0.5)' }}>
        <div className="container" style={{ padding: '0 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #38bdf8' : '2px solid transparent',
                  color: isActive ? '#38bdf8' : (tab.highlight ? '#93c5fd' : 'var(--text-muted)'),
                  fontWeight: isActive ? 700 : (tab.highlight ? 600 : 500),
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
