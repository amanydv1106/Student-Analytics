import React from 'react';
import { GraduationCap, LogIn, LogOut, User } from 'lucide-react';

export default function Header({ 
  currentUser, 
  onOpenAuthModal, 
  onLogout 
}) {
  return (
    <header style={{ 
      borderBottom: '1px solid var(--border-card)', 
      background: 'rgba(11, 23, 40, 0.95)', 
      backdropFilter: 'blur(12px)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50 
    }}>
      <div className="container" style={{ 
        padding: '0.875rem 1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Left top corner: Login Option / Student Account Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 10, 
            background: 'linear-gradient(135deg, #2563eb, #38bdf8)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)' 
          }}>
            <GraduationCap size={22} color="#ffffff" />
          </div>

          <div>
            <h1 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.01em' }}>
              Student Success AI
            </h1>
          </div>

          {/* Login Option placed prominently at left top corner */}
          <div style={{ marginLeft: '0.5rem', borderLeft: '1px solid #233550', paddingLeft: '1rem' }}>
            {currentUser ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                background: 'rgba(26, 42, 69, 0.7)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
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
                    {currentUser.full_name}
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: '#93c5fd' }}>
                    {currentUser.program} • Sem {currentUser.semester}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  style={{
                    marginLeft: '0.25rem',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5',
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <LogOut size={12} /> Sign Out
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
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)',
                }}
              >
                <LogIn size={15} /> Student Login / Sign Up
              </button>
            )}
          </div>
        </div>

        {/* Right side: Clean & Minimal */}
        <div>
          {currentUser && (
            <span style={{ 
              fontSize: '0.75rem', 
              color: '#94a3b8', 
              background: '#0e1a2c', 
              padding: '0.35rem 0.75rem', 
              borderRadius: '6px',
              border: '1px solid #1f2f47',
              fontFamily: 'monospace'
            }}>
              ID: {currentUser.student_id || 'STU-' + currentUser.id}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
