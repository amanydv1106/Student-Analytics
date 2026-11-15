import React, { useState, useEffect } from 'react';
import { Trophy, Award, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function LeaderboardTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metricTab, setMetricTab] = useState('both'); // regression, classification, both

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await api.getLeaderboard();
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load leaderboards.');
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  if (loading) {
    return <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>Loading benchmark leaderboards...</div>;
  }

  if (error) {
    return <div className="card" style={{ color: '#f87171' }}>{error}</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={22} color="#fbbf24" />
            Model Leaderboard
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Performance comparison across all tested machine learning models.
          </p>
        </div>

        {/* Best Model Badges */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-input)', padding: '0.5rem 0.85rem', borderRadius: '0.65rem', border: '1px solid var(--border-card)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Best Score Model</span>
            <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>{data.best_regression_model}</strong>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '0.5rem 0.85rem', borderRadius: '0.65rem', border: '1px solid var(--border-card)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Best Risk Model</span>
            <strong style={{ fontSize: '0.85rem', color: '#34d399' }}>{data.best_classification_model}</strong>
          </div>
        </div>
      </div>

      {/* Regression & Classification Leaderboard Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {/* Regression Leaderboard */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-card)', background: 'var(--bg-card-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#93c5fd' }}>
              Score Prediction Models
            </h3>
            <span className="badge badge-blue">Ranked by RMSE</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model Architecture</th>
                  <th>MAE</th>
                  <th>RMSE</th>
                  <th>R² Score</th>
                </tr>
              </thead>
              <tbody>
                {data.regression_models.map((m, idx) => {
                  const isTop = idx === 0;
                  return (
                    <tr key={m.model} style={{ background: isTop ? 'rgba(59, 130, 246, 0.08)' : 'transparent' }}>
                      <td style={{ fontWeight: isTop ? 700 : 500, color: isTop ? '#60a5fa' : 'inherit' }}>
                        {isTop && '🥇 '}
                        {m.model}
                      </td>
                      <td>{m.MAE.toFixed(3)}</td>
                      <td style={{ fontWeight: 600 }}>{m.RMSE.toFixed(3)}</td>
                      <td>{(m.R2 * 100).toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Classification Leaderboard */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-card)', background: 'var(--bg-card-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
              Risk Prediction Models
            </h3>
            <span className="badge badge-green">Ranked by F1</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model Architecture</th>
                  <th>Accuracy</th>
                  <th>Recall</th>
                  <th>F1 Score</th>
                  <th>ROC-AUC</th>
                </tr>
              </thead>
              <tbody>
                {data.classification_models.map((m, idx) => {
                  const isTop = idx === 0;
                  return (
                    <tr key={m.model} style={{ background: isTop ? 'rgba(16, 185, 129, 0.08)' : 'transparent' }}>
                      <td style={{ fontWeight: isTop ? 700 : 500, color: isTop ? '#34d399' : 'inherit' }}>
                        {isTop && '🥇 '}
                        {m.model}
                      </td>
                      <td>{(m.accuracy * 100).toFixed(1)}%</td>
                      <td>{(m.recall * 100).toFixed(1)}%</td>
                      <td style={{ fontWeight: 700, color: isTop ? '#34d399' : 'inherit' }}>
                        {m.f1.toFixed(3)}
                      </td>
                      <td>{m.roc_auc.toFixed(3)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
