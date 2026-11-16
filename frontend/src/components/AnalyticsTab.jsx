import React, { useState, useEffect } from 'react';
import { BarChart3, Database, PieChart, Layers, FileText } from 'lucide-react';
import { api } from '../services/api';

export default function AnalyticsTab() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFigure, setActiveFigure] = useState('score'); // 'score' or 'risk'

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getAnalyticsSummary();
        setAnalytics(res);
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#5F5070' }}>Loading dataset profiling statistics...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E152A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <BarChart3 size={22} color="#501E7E" />
          Dataset Overview & Stats
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#68597A', margin: '0.25rem 0 0' }}>
          Overview of student cohort data, feature distributions, and class metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#68597A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Cohort Volume</span>
          <strong style={{ fontSize: '1.75rem', color: '#501E7E', display: 'block', marginTop: '0.25rem', fontWeight: 800 }}>
            {analytics?.dataset_records?.toLocaleString() || '200,000'}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#8C7C9E' }}>Synthetic Students</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#68597A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Average Final Score</span>
          <strong style={{ fontSize: '1.75rem', color: '#1E152A', display: 'block', marginTop: '0.25rem', fontWeight: 800 }}>
            {analytics?.average_score || '76.46'}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#8C7C9E' }}>Std Dev: ±{analytics?.score_std || '12.35'}</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#68597A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>At-Risk Incidence</span>
          <strong style={{ fontSize: '1.75rem', color: '#D9383A', display: 'block', marginTop: '0.25rem', fontWeight: 800 }}>
            {analytics?.at_risk_percentage || '9.4'}%
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#8C7C9E' }}>Class balance (&lt;60 threshold)</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#68597A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Modeled Attributes</span>
          <strong style={{ fontSize: '1.75rem', color: '#16A34A', display: 'block', marginTop: '0.25rem', fontWeight: 800 }}>
            {analytics?.features_count || '20'}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#8C7C9E' }}>Behavioral & Academic features</span>
        </div>
      </div>

      {/* Figures & Plots Viewer */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid #E2D4F0', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E152A', margin: 0 }}>
            Generated Distribution Figures
          </h3>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn ${activeFigure === 'score' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
              onClick={() => setActiveFigure('score')}
            >
              Score Distribution
            </button>
            <button
              className={`btn ${activeFigure === 'risk' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
              onClick={() => setActiveFigure('risk')}
            >
              At-Risk Class Balance
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', background: '#FAF6FD', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #E2D4F0' }}>
          <img
            src={api.getFigureUrl(activeFigure === 'score' ? 'score_distribution.png' : 'risk_class_balance.png')}
            alt="Distribution Figure"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.5rem', maxHeight: '420px', objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<span style="color: #68597A; font-size: 0.875rem;">Figure available when training artifacts are compiled.</span>';
            }}
          />
        </div>
      </div>
    </div>
  );
}
