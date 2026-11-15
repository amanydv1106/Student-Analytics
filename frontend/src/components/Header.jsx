import React from 'react';
import { 
  GraduationCap, 
  Sliders, 
  Trophy, 
  Globe2, 
  BarChart3, 
  Users, 
  LogIn,
  LogOut
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onOpenAuthModal, 
  onLogout 
}) {
  const publicNavItems = [
    { id: 'predict', label: 'Score Predictor', icon: GraduationCap },
    { id: 'simulate', label: 'Score Simulator', icon: Sliders },
    { id: 'leaderboard', label: 'Model Rankings', icon: Trophy },
    { id: 'domain', label: 'Domain Testing', icon: Globe2 },
    { id: 'analytics', label: 'Dataset & Stats', icon: BarChart3 },
    { id: 'batch', label: 'Batch Predictor', icon: Users },
  ];

  return (
    <header style={{ 
      borderBottom: '1px solid var(--border-card)', 
      background: 'rgba(11, 23, 40, 0.9)', 
      backdropFilter: 'blur(12px)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50 
    }}>
      {/* Top Bar */}
      <div className="container" style={{ 
        padding: '0.875rem 1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Left: Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div 
            onClick={() => setActiveTab(currentUser ? 'dashboard' : 'predict')}
            style={{ 
              width: 42, 
              height: 42, 
              borderRadius: 12, 
              background: 'linear-gradient(135deg, #2563eb, #38bdf8)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 0 18px rgba(56, 189, 248, 0.35)',
              cursor: 'pointer'
            }}
          >
            <GraduationCap size={24} color="#ffffff" />
          </div>
          <div>
            <h1 
              onClick={() => setActiveTab(currentUser ? 'dashboard' : 'predict')}
              style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em', cursor: 'pointer' }}
            >
              Student Success AI
            </h1>
          </div>
        </div>

        {/* Top Right Corner: Student Login / Sign Up or Student Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Student Profile Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(26, 42, 69, 0.7)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '8px',
                padding: '0.3rem 0.65rem',
              }}>
                <div style={{
                  width: 26,
                  height: 26,
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
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.1 }}>
                    {currentUser.full_name.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: '#93c5fd' }}>
                    Sem {currentUser.semester}
                  </span>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={onLogout}
                title="Sign Out"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  cursor: 'pointer',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: '#ffffff',
                border: 'none',
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              <LogIn size={16} /> Student Login / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* Navigation tabs: Shown only when student is NOT logged in */}
      {!currentUser && (
        <div style={{ borderTop: '1px solid rgba(28, 46, 76, 0.5)' }}>
          <div className="container" style={{ padding: '0 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
            {publicNavItems.map((tab) => {
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
                    color: isActive ? '#38bdf8' : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : 500,
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
      )}
    </header>
  );
}
