import React from 'react';
import { 
  GraduationCap, 
  Sliders, 
  Trophy, 
  BarChart3, 
  Users, 
  LogIn,
  LogOut,
  ChevronRight
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
    { id: 'analytics', label: 'Dataset & Stats', icon: BarChart3 },
    { id: 'batch', label: 'Batch Predictor', icon: Users },
  ];

  return (
    <header style={{ 
      borderBottom: '1px solid #E5DAEE', 
      background: '#FFFFFF', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50,
      boxShadow: '0 2px 10px rgba(78, 36, 115, 0.04)'
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
        {/* Left: Branding (Matching user's attached photo StudIQ) */}
        <div 
          onClick={() => setActiveTab(currentUser ? 'dashboard' : 'predict')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', cursor: 'pointer', userSelect: 'none' }}
        >
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 12, 
              background: '#1c2e4a', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 3px 10px rgba(28, 46, 74, 0.25)',
              flexShrink: 0
            }}
          >
            <span style={{ color: '#ffffff', fontSize: '1.45rem', fontWeight: 800, fontFamily: 'sans-serif', lineHeight: 1 }}>
              S
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 
              style={{ 
                fontSize: '1.4rem', 
                fontWeight: 800, 
                color: '#1c2e4a', 
                margin: 0, 
                letterSpacing: '-0.02em', 
                lineHeight: 1.1 
              }}
            >
              StudIQ
            </h1>
            <span style={{ 
              fontSize: '0.625rem', 
              fontWeight: 700, 
              color: '#64748b', 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase', 
              marginTop: '3px' 
            }}>
              STUDENT PERFORMANCE ANALYTICS
            </span>
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
                background: '#F4EDF9',
                border: '1px solid #D8C7EB',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
              }}>
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3B185F, #501E7E)',
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
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E152A', lineHeight: 1.1 }}>
                    {currentUser.full_name.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: '#501E7E', fontWeight: 600 }}>
                    Sem {currentUser.semester}
                  </span>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={onLogout}
                title="Sign Out"
                style={{
                  background: '#FDE8E7',
                  border: '1px solid #FCA5A5',
                  color: '#D9383A',
                  cursor: 'pointer',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'background 0.2s',
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              style={{
                background: '#3B185F',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 14px rgba(59, 24, 95, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4A1D75';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3B185F';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <span>Student Login / Sign Up</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation tabs: Shown only when student is NOT logged in */}
      {!currentUser && (
        <div style={{ borderTop: '1px solid #EFE6F8', background: '#FFFFFF' }}>
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
                    borderBottom: isActive ? '3px solid #501E7E' : '3px solid transparent',
                    color: isActive ? '#3B185F' : '#68597A',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={16} color={isActive ? '#501E7E' : '#8C7C9E'} />
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
