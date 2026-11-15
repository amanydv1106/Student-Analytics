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
    return <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>Loading dataset profiling statistics...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={22} color="#38bdf8" />
          Dataset Overview & Stats
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Overview of student cohort data, feature statistics, and score distributions.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cohort Volume</span>
          <strong style={{ fontSize: '1.75rem', color: '#38bdf8', display: 'block', marginTop: '0.25rem' }}>
            {analytics?.dataset_records?.toLocaleString() || '200,000'}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Synthetic Students</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Final Score</span>
          <strong style={{ fontSize: '1.75rem', color: '#f8fafc', display: 'block', marginTop: '0.25rem' }}>
            {analytics?.average_score || '76.46'}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Std Dev: ±{analytics?.score_std || '12.35'}</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>At-Risk Incidence</span>
          <strong style={{ fontSize: '1.75rem', color: '#f87171', display: 'block', marginTop: '0.25rem' }}>
            {analytics?.at_risk_percentage || '9.4'}%
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Class balance (&lt;60 threshold)</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modeled Attributes</span>
          <strong style={{ fontSize: '1.75rem', color: '#34d399', display: 'block', marginTop: '0.25rem' }}>
            {analytics?.features_count || '20'}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Behavioral & Academic features</span>
        </div>
      </div>

      {/* Figures & Plots Viewer */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
            Generated Distribution Figures
          </h3>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn ${activeFigure === 'score' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              onClick={() => setActiveFigure('score')}
            >
              Score Distribution
            </button>
            <button
              className={`btn ${activeFigure === 'risk' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              onClick={() => setActiveFigure('risk')}
            >
              At-Risk Class Balance
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', background: '#070f1e', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-card)' }}>
          <img
            src={api.getFigureUrl(activeFigure === 'score' ? 'score_distribution.png' : 'risk_class_balance.png')}
            alt="Distribution Figure"
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '420px', borderRadius: '0.5rem' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Feature Profile Table */}
      {analytics?.data_profile && analytics.data_profile.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-card)', background: 'var(--bg-card-subtle)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
              Summary Statistics Across Student Features
            </h3>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: 380 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Feature Name</th>
                  <th>Mean</th>
                  <th>Std</th>
                  <th>Min</th>
                  <th>50% (Median)</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                {analytics.data_profile.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: '#93c5fd' }}>{row.feature}</td>
                    <td>{row.mean ?? '-'}</td>
                    <td>{row.std ?? '-'}</td>
                    <td>{row.min ?? '-'}</td>
                    <td>{row['50%'] ?? '-'}</td>
                    <td>{row.max ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
