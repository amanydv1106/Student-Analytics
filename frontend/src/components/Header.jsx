import React from 'react';
import { 
  GraduationCap, 
  Sliders, 
  Trophy, 
  Globe2, 
  BarChart3, 
  Users, 
  Activity, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, backendStatus }) {
  const navItems = [
    { id: 'predict', label: 'Predictor & Early-Warning', icon: GraduationCap },
    { id: 'simulate', label: 'What-If Simulator', icon: Sliders },
    { id: 'leaderboard', label: 'Model Leaderboards', icon: Trophy },
    { id: 'domain', label: 'Domain Generalization', icon: Globe2 },
    { id: 'analytics', label: 'Dataset & EDA', icon: BarChart3 },
    { id: 'batch', label: 'Batch Predictor', icon: Users },
  ];

  return (
    <header style={{ borderBottom: '1px solid var(--border-card)', background: 'rgba(11, 23, 40, 0.85)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)' }}>
            <GraduationCap size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                Student Success AI
              </h1>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>MCA Prototype</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Early-Warning & Score Prediction Engine • 200,000 Synthetic Cohort
            </p>
          </div>
        </div>

        {/* Server status pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.35rem 0.85rem', borderRadius: 9999, border: '1px solid var(--border-card)', fontSize: '0.8rem' }}>
          {backendStatus === 'online' ? (
            <>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>API Connected</span>
            </>
          ) : (
            <>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }}></span>
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>Checking Server...</span>
            </>
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
                  color: isActive ? '#38bdf8' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
